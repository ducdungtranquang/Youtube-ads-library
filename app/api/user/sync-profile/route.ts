import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendSlackNewUserNotification } from '@/lib/services/user-notifier'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null

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

    // Check if profile already exists
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('user_profiles')
      .select('id, subscription_plan, subscription_status, subscription_end, email, created_at')
      .eq('id', userId)
      .maybeSingle()

    if (fetchErr) {
      console.warn('Error checking existing profile:', fetchErr)
    }

    // Truy vấn thông tin tài khoản từ auth.admin để xác định thời điểm đăng ký và metadata
    let authUser: any = null
    try {
      const { data: authData } = await supabaseAdmin.auth.admin.getUserById(userId)
      authUser = authData?.user || null
    } catch (err) {
      console.warn('Could not query auth user:', err)
    }

    let resolvedEmail = email || authUser?.email || null
    let resolvedFullName =
      fullName ||
      authUser?.user_metadata?.full_name ||
      authUser?.user_metadata?.name ||
      null
    let resolvedProvider =
      provider ||
      authUser?.app_metadata?.provider ||
      authUser?.identities?.[0]?.provider ||
      'email'

    // Xác định xem user này có phải là tài khoản vừa mới tạo không (trong vòng 5 phút)
    // Trường hợp Supabase DB trigger tự chèn user_profiles trước khi gọi API này,
    // hoặc gọi từ Google callback / Email signup:
    const now = Date.now()
    const profileCreatedAt = existing?.created_at ? new Date(existing.created_at).getTime() : 0
    const authCreatedAt = authUser?.created_at ? new Date(authUser.created_at).getTime() : 0
    
    // Là user mới nếu chưa có profile hoặc vừa được tạo trong 5 phút gần nhất
    const isNewUser = !existing || (now - profileCreatedAt < 300000) || (now - authCreatedAt < 300000)

    if (existing) {
      // If profile exists but email is not populated, fill it in
      if (!existing.email && resolvedEmail) {
        await supabaseAdmin
          .from('user_profiles')
          .update({ email: resolvedEmail, updated_at: new Date().toISOString() })
          .eq('id', userId)
      }

      // Nếu tài khoản mới tạo (ví dụ trigger Supabase chèn trước hoặc Google login lần đầu)
      if (isNewUser) {
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

      return NextResponse.json({
        success: true,
        created: false,
        profile: existing
      })
    }

    // Profile does not exist: create it with default free tier
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
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    // Gửi thông báo có thành viên mới về Slack tức thì và await để đảm bảo request hoàn tất
    await sendSlackNewUserNotification({
      userId,
      email: resolvedEmail,
      fullName: resolvedFullName,
      provider: resolvedProvider || 'google',
      referredBy: referredBy || null,
      registeredAt: new Date(),
    }).catch((slackErr) => {
      console.warn('Gửi thông báo Slack user mới thất bại:', slackErr)
    })

    return NextResponse.json({
      success: true,
      created: true,
      profile: newProfile
    })
  } catch (error: any) {
    console.error('sync-profile API error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
