import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendSlackNewUserNotification } from '@/lib/services/user-notifier'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null

// In-flight mutex để serialize và deduplicate các request đồng thời cho cùng 1 userId
const globalForSync = globalThis as unknown as {
  activeSyncMap?: Map<string, Promise<{ success: boolean; created: boolean; profile: any }>>
  notifiedUserIds?: Set<string>
}

const activeSyncMap =
  globalForSync.activeSyncMap ||
  (globalForSync.activeSyncMap = new Map<string, Promise<{ success: boolean; created: boolean; profile: any }>>())

const notifiedUserIds =
  globalForSync.notifiedUserIds ||
  (globalForSync.notifiedUserIds = new Set<string>())

async function processUserProfileSync(params: {
  userId: string
  email?: string | null
  fullName?: string | null
  referredBy?: string | null
  provider?: string | null
}) {
  const { userId, email, fullName, referredBy, provider } = params

  if (!supabaseAdmin) {
    throw new Error('Supabase admin client unavailable')
  }

  // 1. Kiểm tra profile hiện tại trong database
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from('user_profiles')
    .select('id, subscription_plan, subscription_status, subscription_end, email, created_at')
    .eq('id', userId)
    .maybeSingle()

  if (fetchErr) {
    console.warn('Error checking existing profile:', fetchErr)
  }

  // 2. Truy vấn thông tin tài khoản từ auth.admin để lấy metadata và thời điểm đăng ký
  let authUser: any = null
  try {
    const { data: authData } = await supabaseAdmin.auth.admin.getUserById(userId)
    authUser = authData?.user || null
  } catch (err) {
    console.warn('Could not query auth user:', err)
  }

  const resolvedEmail = email || authUser?.email || null
  const resolvedFullName =
    fullName ||
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    null
  const resolvedProvider =
    provider ||
    authUser?.app_metadata?.provider ||
    authUser?.identities?.[0]?.provider ||
    'email'

  // 3. Kiểm tra xem tài khoản này đã được thông báo Slack chưa
  const alreadyNotified =
    notifiedUserIds.has(userId) ||
    Boolean(authUser?.user_metadata?.slack_notified_at)

  const now = Date.now()
  const profileCreatedAt = existing?.created_at ? new Date(existing.created_at).getTime() : 0
  const authCreatedAt = authUser?.created_at ? new Date(authUser.created_at).getTime() : 0

  // Là user mới nếu CHƯA từng được thông báo VÀ (chưa có profile hoặc vừa được tạo trong 5 phút gần nhất)
  const isNewUser = !alreadyNotified && (!existing || (now - profileCreatedAt < 300000) || (now - authCreatedAt < 300000))

  // 4. Nếu là tài khoản mới, đánh dấu và gửi thông báo Slack duy nhất 1 lần
  if (isNewUser) {
    // Đánh dấu ngay vào in-memory set trên server để chặn các request đồng thời khác
    notifiedUserIds.add(userId)

    // Đánh dấu vào user_metadata trong Supabase Auth để bảo toàn vĩnh viễn
    try {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...(authUser?.user_metadata || {}),
          slack_notified_at: new Date().toISOString(),
        },
      })
    } catch (mErr) {
      console.warn('Could not update user_metadata slack flag:', mErr)
    }

    // Gửi thông báo Slack
    await sendSlackNewUserNotification({
      userId,
      email: resolvedEmail,
      fullName: resolvedFullName,
      provider: resolvedProvider || 'google',
      referredBy: referredBy || authUser?.user_metadata?.referred_by || null,
      registeredAt: authUser?.created_at ? new Date(authUser.created_at) : new Date(),
    }).catch((slackErr) => {
      console.warn('Gửi thông báo Slack user mới thất bại:', slackErr)
    })
  }

  // 5. Cập nhật hoặc tạo profile
  if (existing) {
    // Nếu profile đã tồn tại nhưng thiếu email thì bổ sung
    if (!existing.email && resolvedEmail) {
      await supabaseAdmin
        .from('user_profiles')
        .update({ email: resolvedEmail, updated_at: new Date().toISOString() })
        .eq('id', userId)
    }

    return {
      success: true,
      created: false,
      profile: existing,
    }
  }

  // Profile chưa tồn tại: khởi tạo gói Free mặc định
  const { data: newProfile, error: insertErr } = await supabaseAdmin
    .from('user_profiles')
    .upsert({
      id: userId,
      email: resolvedEmail,
      subscription_plan: 'free',
      subscription_status: 'free',
      daily_search_count: 0,
      last_search_date: new Date().toISOString().split('T')[0],
      referred_by: referredBy || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })
    .select('id, subscription_plan, subscription_status, subscription_end')
    .single()

  if (insertErr) {
    console.error('Failed to insert user profile:', insertErr)
    throw new Error(insertErr.message)
  }

  return {
    success: true,
    created: true,
    profile: newProfile,
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client unavailable' }, { status: 500 })
    }

    const body = await request.json()
    const { userId, email, fullName, referredBy, provider } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Nếu đang có một request sync profile cho cùng userId đang xử lý, dùng chung kết quả (chống race-condition)
    if (activeSyncMap.has(userId)) {
      const activeResult = await activeSyncMap.get(userId)
      return NextResponse.json(activeResult)
    }

    // Tạo deferred promise để các request đồng thời khác phải chờ
    let resolveSync!: (value: { success: boolean; created: boolean; profile: any }) => void
    let rejectSync!: (reason?: any) => void
    const syncPromise = new Promise<{ success: boolean; created: boolean; profile: any }>((res, rej) => {
      resolveSync = res
      rejectSync = rej
    })
    activeSyncMap.set(userId, syncPromise)

    try {
      const result = await processUserProfileSync({ userId, email, fullName, referredBy, provider })
      resolveSync(result)
      return NextResponse.json(result)
    } catch (processErr) {
      rejectSync(processErr)
      throw processErr
    } finally {
      activeSyncMap.delete(userId)
    }
  } catch (error: any) {
    console.error('sync-profile API error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
