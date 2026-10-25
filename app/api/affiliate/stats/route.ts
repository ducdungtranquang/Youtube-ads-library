import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateReferralCode, AffiliatePartner, AffiliateCommission, AffiliatePayout } from '@/lib/affiliate'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const userIdHeader = request.headers.get('x-user-id')
    const searchParams = request.nextUrl.searchParams
    const userId = userIdHeader || searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 401 }
      )
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // 1. Fetch user to verify email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (userError || !userData?.user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const userEmail = userData.user.email || ''
    const fullName = (userData.user.user_metadata?.full_name as string) || null

    // 2. Fetch or create affiliate partner record
    let partner: AffiliatePartner | null = null

    try {
      const { data: existingPartner, error: partnerError } = await supabaseAdmin
        .from('affiliate_partners')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (existingPartner) {
        partner = {
          id: existingPartner.id,
          referralCode: existingPartner.referral_code,
          userEmail: existingPartner.user_email || userEmail,
          fullName: existingPartner.full_name || fullName,
          balance: Number(existingPartner.balance || 0),
          totalEarned: Number(existingPartner.total_earned || 0),
          totalWithdrawn: Number(existingPartner.total_withdrawn || 0),
          totalClicks: Number(existingPartner.total_clicks || 0),
          totalSignups: Number(existingPartner.total_signups || 0),
          totalConversions: Number(existingPartner.total_conversions || 0),
          bankName: existingPartner.bank_name || null,
          bankAccount: existingPartner.bank_account || null,
          bankHolder: existingPartner.bank_holder || null,
          status: existingPartner.status || 'active',
          createdAt: existingPartner.created_at || new Date().toISOString(),
        }
      } else if (!partnerError) {
        // Create new affiliate partner
        const newCode = generateReferralCode(userEmail.split('@')[0])
        const { data: created, error: createError } = await supabaseAdmin
          .from('affiliate_partners')
          .insert({
            id: userId,
            referral_code: newCode,
            user_email: userEmail,
            full_name: fullName,
            balance: 0,
            total_earned: 0,
            total_withdrawn: 0,
            total_clicks: 0,
            total_signups: 0,
            total_conversions: 0,
            status: 'active'
          })
          .select()
          .single()

        if (created && !createError) {
          partner = {
            id: created.id,
            referralCode: created.referral_code,
            userEmail: created.user_email,
            fullName: created.full_name,
            balance: 0,
            totalEarned: 0,
            totalWithdrawn: 0,
            totalClicks: 0,
            totalSignups: 0,
            totalConversions: 0,
            bankName: null,
            bankAccount: null,
            bankHolder: null,
            status: 'active',
            createdAt: created.created_at,
          }
        }
      }
    } catch (dbErr) {
      console.warn('Affiliate table check warning:', dbErr)
    }

    // Fallback if table doesn't exist yet
    if (!partner) {
      const fallbackCode = `ADS${userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}`
      partner = {
        id: userId,
        referralCode: fallbackCode,
        userEmail,
        fullName,
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        totalClicks: 0,
        totalSignups: 0,
        totalConversions: 0,
        bankName: null,
        bankAccount: null,
        bankHolder: null,
        status: 'active',
        createdAt: new Date().toISOString(),
      }
    }

    // 3. Fetch commissions
    let commissions: AffiliateCommission[] = []
    try {
      const { data: commData } = await supabaseAdmin
        .from('affiliate_commissions')
        .select('*')
        .eq('affiliate_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (commData && Array.isArray(commData)) {
        commissions = commData.map((c) => ({
          id: c.id,
          affiliateId: c.affiliate_id,
          referredEmail: c.referred_email,
          orderCode: Number(c.order_code),
          planName: c.plan_name,
          orderAmount: Number(c.order_amount),
          commissionRate: Number(c.commission_rate || 0.2),
          commissionAmount: Number(c.commission_amount),
          status: c.status || 'completed',
          createdAt: c.created_at,
        }))
      }
    } catch {
      commissions = []
    }

    // 4. Fetch payouts
    let payouts: AffiliatePayout[] = []
    try {
      const { data: payoutData } = await supabaseAdmin
        .from('affiliate_payouts')
        .select('*')
        .eq('affiliate_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (payoutData && Array.isArray(payoutData)) {
        payouts = payoutData.map((p) => ({
          id: p.id,
          affiliateId: p.affiliate_id,
          amount: Number(p.amount),
          bankName: p.bank_name,
          bankAccount: p.bank_account,
          bankHolder: p.bank_holder,
          status: p.status || 'pending',
          adminNote: p.admin_note,
          createdAt: p.created_at,
        }))
      }
    } catch {
      payouts = []
    }

    const referralUrl = `${origin}/register?ref=${partner.referralCode}`

    return NextResponse.json({
      success: true,
      data: {
        partner,
        commissions,
        payouts,
        referralUrl,
      },
    })
  } catch (error) {
    console.error('Affiliate stats API error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
