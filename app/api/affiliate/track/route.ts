import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referralCode, eventType = 'click' } = body

    if (!referralCode || typeof referralCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'referralCode is required' },
        { status: 400 }
      )
    }

    const cleanCode = referralCode.trim().toUpperCase()

    // Find the partner
    const { data: partner } = await supabaseAdmin
      .from('affiliate_partners')
      .select('id, total_clicks, total_signups')
      .eq('referral_code', cleanCode)
      .maybeSingle()

    if (partner) {
      if (eventType === 'click') {
        await supabaseAdmin
          .from('affiliate_partners')
          .update({
            total_clicks: (partner.total_clicks || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', partner.id)
      } else if (eventType === 'signup') {
        await supabaseAdmin
          .from('affiliate_partners')
          .update({
            total_signups: (partner.total_signups || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', partner.id)
      }
    }

    const response = NextResponse.json({ success: true, code: cleanCode })
    // Set 30-day attribution cookie
    response.cookies.set('ads_spy_ref', cleanCode, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      httpOnly: false,
      sameSite: 'lax'
    })

    return response
  } catch (error) {
    console.error('Affiliate tracking error:', error)
    return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500 })
  }
}
