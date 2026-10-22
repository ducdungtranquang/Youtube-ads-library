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
        limit: 5,
        used: 0,
        remaining: 5,
        isUnlimited: false,
      })
    }

    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('subscription_plan, subscription_status, daily_search_count, last_search_date')
      .eq('id', userId)
      .maybeSingle()

    if (error || !profile) {
      return NextResponse.json({
        plan: 'free',
        limit: 5,
        used: 0,
        remaining: 5,
        isUnlimited: false,
      })
    }

    const plan = (profile.subscription_plan || profile.subscription_status || 'free').toLowerCase()
    let limit = 5
    if (plan === 'unlimited' || plan === 'business' || plan === 'company' || plan === 'personal') {
      limit = -1
    }

    const today = new Date().toISOString().split('T')[0]
    const lastDate = profile.last_search_date
      ? new Date(profile.last_search_date).toISOString().split('T')[0]
      : null

    const used = lastDate === today ? (profile.daily_search_count || 0) : 0
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
      limit: 5,
      used: 0,
      remaining: 5,
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
