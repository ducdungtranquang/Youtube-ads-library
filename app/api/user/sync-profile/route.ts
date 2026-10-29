import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    const { userId, email, fullName, referredBy } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Check if profile already exists
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('user_profiles')
      .select('id, subscription_plan, subscription_status, subscription_end, email')
      .eq('id', userId)
      .maybeSingle()

    if (fetchErr) {
      console.warn('Error checking existing profile:', fetchErr)
    }

    if (existing) {
      // If profile exists but email is not populated, fill it in
      if (!existing.email && email) {
        await supabaseAdmin
          .from('user_profiles')
          .update({ email, updated_at: new Date().toISOString() })
          .eq('id', userId)
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
        email: email || null,
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
