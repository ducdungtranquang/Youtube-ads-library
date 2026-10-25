import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { payos, SUBSCRIPTION_PLANS, BILLING_CYCLES, BillingCycle, generateOrderCode, PlanId } from '@/lib/payos'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userEmail, planId = 'unlimited', billingCycle = 'monthly', referralCode } = body
    const activeRefCode = (referralCode || request.cookies.get('ads_spy_ref')?.value || null)?.toString().trim().toUpperCase() || null

    // Validate input
    if (!userId || !userEmail || !planId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate plan
    if (planId === 'free') {
      return NextResponse.json(
        { success: false, error: 'Gói miễn phí không cần thanh toán' },
        { status: 400 }
      )
    }

    const cycleKey: BillingCycle = (billingCycle in BILLING_CYCLES) ? (billingCycle as BillingCycle) : 'monthly'
    const cycle = BILLING_CYCLES[cycleKey]
    const orderCode = generateOrderCode()
    const amount = cycle.totalPrice

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      (request.headers.get('origin') || 'http://localhost:3000')

    const descMap: Record<BillingCycle, string> = {
      monthly: 'Goi Unlimited 1T',
      quarterly: 'Goi Unlimited 3T',
      yearly: 'Goi Unlimited 12T',
    }

    // Create PayOS payment link using SDK v2
    const paymentLink = await payos.paymentRequests.create({
      orderCode,
      amount,
      description: descMap[cycleKey], // Max 25 chars
      items: [
        {
          name: `Gói Unlimited (${cycle.name})`,
          quantity: 1,
          price: amount,
        }
      ],
      returnUrl: `${baseUrl}/payment/success?orderCode=${orderCode}`,
      cancelUrl: `${baseUrl}/payment/cancel?orderCode=${orderCode}`,
      expiredAt: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes expiry
    })

    // Store payment info in database for later verification
    const { error: dbError } = await supabaseAdmin
      .from('payments')
      .insert({
        order_code: orderCode,
        user_id: userId,
        user_email: userEmail,
        plan_id: 'unlimited',
        amount: amount,
        status: 'pending',
        checkout_url: paymentLink.checkoutUrl,
        referral_code: activeRefCode,
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue anyway - payment can still be processed
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: paymentLink.checkoutUrl,
      orderCode,
      qrCode: paymentLink.qrCode,
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment'
      },
      { status: 500 }
    )
  }
}
