import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { payos, SUBSCRIPTION_PLANS, generateOrderCode, PlanId } from '@/lib/payos'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userEmail, planId } = body

    // Validate input
    if (!userId || !userEmail || !planId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate plan
    if (!SUBSCRIPTION_PLANS[planId as PlanId]) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan' },
        { status: 400 }
      )
    }

    const plan = SUBSCRIPTION_PLANS[planId as PlanId]
    const orderCode = generateOrderCode()

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      (request.headers.get('origin') || 'http://localhost:3000')

    // Create PayOS payment link using SDK v2
    const paymentLink = await payos.paymentRequests.create({
      orderCode,
      amount: plan.price,
      description: `Gói ${plan.name}`.slice(0, 25), // Max 25 chars
      items: [
        {
          name: `Gói ${plan.name} - 1 tháng`,
          quantity: 1,
          price: plan.price,
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
        plan_id: planId,
        amount: plan.price,
        status: 'pending',
        checkout_url: paymentLink.checkoutUrl,
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
