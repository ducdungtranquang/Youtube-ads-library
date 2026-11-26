import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId || !supabaseAdmin) {
      return NextResponse.json({
        plan: 'free',
        limit: 3,
        used: 0,
        remaining: 3,
        isUnlimited: false,
      })
    }

    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('subscription_plan, subscription_status, daily_search_count, last_search_date')
      .eq('id', userId)
      .maybeSingle()

    let userProfile = profile
    if (!userProfile) {
      // Auto-create missing user profile with free plan
      const { data: createdProfile } = await supabaseAdmin
        .from('user_profiles')
        .upsert({
          id: userId,
          subscription_plan: 'free',
          subscription_status: 'free',
          daily_search_count: 0,
          last_search_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .select('subscription_plan, subscription_status, daily_search_count, last_search_date')
        .maybeSingle()

      userProfile = createdProfile
    }

    if (!userProfile) {
      return NextResponse.json({
        plan: 'free',
        limit: 3,
        used: 0,
        remaining: 3,
        isUnlimited: false,
      })
    }

    let plan = (userProfile.subscription_plan || userProfile.subscription_status || 'free').toLowerCase()

    // Auto-recovery: If user is on 'free' plan, check if they have any pending payment that was already transferred
    if (plan === 'free' && supabaseAdmin) {
      try {
        const { data: pendingPayment } = await supabaseAdmin
          .from('payments')
          .select('id, order_code, amount, user_email')
          .eq('user_id', userId)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (pendingPayment && pendingPayment.order_code) {
          const { payos } = await import('@/lib/payos')
          const numOrderCode = Number(pendingPayment.order_code)
          const paymentInfo = await payos.paymentRequests.get(numOrderCode)
          const isPaidInPayOS =
            paymentInfo.status === 'PAID' ||
            (typeof paymentInfo.amountPaid === 'number' && paymentInfo.amountPaid >= paymentInfo.amount)

          if (isPaidInPayOS) {
            const paidAmount = Number(pendingPayment.amount || paymentInfo?.amountPaid || paymentInfo?.amount || 0)
            const subscriptionStart = new Date()
            const subscriptionEnd = new Date()
            let durationMonths = 1
            if (paidAmount >= 900000) {
              durationMonths = 12
            } else if (paidAmount >= 250000) {
              durationMonths = 3
            }
            subscriptionEnd.setMonth(subscriptionEnd.getMonth() + durationMonths)

            // Auto-upgrade user profile
            await supabaseAdmin
              .from('user_profiles')
              .upsert({
                id: userId,
                subscription_status: 'unlimited',
                subscription_plan: 'unlimited',
                subscription_start: subscriptionStart.toISOString(),
                subscription_end: subscriptionEnd.toISOString(),
                updated_at: new Date().toISOString()
              }, { onConflict: 'id' })

            // Mark payment as completed
            await supabaseAdmin
              .from('payments')
              .update({
                status: 'completed',
                paid_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', pendingPayment.id)

            plan = 'unlimited'
            userProfile.subscription_plan = 'unlimited'
          }
        }
      } catch (recoveryErr) {
        console.warn('Pending payment auto-recovery check error:', recoveryErr)
      }
    }
    let limit = 3
    if (plan === 'unlimited' || plan === 'business' || plan === 'company' || plan === 'personal') {
      limit = -1
    }

    const today = new Date().toISOString().split('T')[0]
    const lastDate = userProfile?.last_search_date
      ? new Date(userProfile.last_search_date).toISOString().split('T')[0]
      : null

    const used = lastDate === today ? (userProfile?.daily_search_count || 0) : 0
    const remaining = limit === -1 ? -1 : Math.max(0, limit - used)

    return NextResponse.json({
      plan,
      limit,
      used,
      remaining,
      isUnlimited: limit === -1,
      canSearch: limit === -1 || remaining > 0,
    })
  } catch (error) {
    console.warn('Get search quota error:', error)
    return NextResponse.json({
      plan: 'free',
      limit: 3,
      used: 0,
      remaining: 3,
      isUnlimited: false,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, date } = body

    if (!userId || !supabaseAdmin) {
      return NextResponse.json({ success: true, message: 'Skipped - no user or admin client' })
    }

    const today = date || new Date().toISOString().split('T')[0]

    // Fetch existing profile
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('daily_search_count, last_search_date')
      .eq('id', userId)
      .maybeSingle()

    if (profile) {
      const lastDate = profile.last_search_date
        ? new Date(profile.last_search_date).toISOString().split('T')[0]
        : null

      const isSameDay = lastDate === today
      const newCount = isSameDay ? (profile.daily_search_count || 0) + 1 : 1

      await supabaseAdmin
        .from('user_profiles')
        .update({
          daily_search_count: newCount,
          last_search_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.warn('Update search quota error:', error)
    // Don't fail search if quota sync fails
    return NextResponse.json({ success: true, warning: 'Sync error' })
  }
}
