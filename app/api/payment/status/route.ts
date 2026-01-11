import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { payos } from '@/lib/payos'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderCode = searchParams.get('orderCode')

    if (!orderCode) {
      return NextResponse.json(
        { success: false, error: 'Order code is required' },
        { status: 400 }
      )
    }

    // Get payment from PayOS using SDK v2
    const paymentInfo = await payos.paymentRequests.get(Number(orderCode))

    // Get payment from database
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('order_code', orderCode)
      .single()

    // If payment is PAID but our DB not updated yet, update it
    if (paymentInfo.status === 'PAID' && payment?.status !== 'completed') {
      const subscriptionStart = new Date()
      const subscriptionEnd = new Date()
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)

      // Update user profile
      await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_status: payment.plan_id,
          subscription_plan: payment.plan_id,
          subscription_start: subscriptionStart.toISOString(),
          subscription_end: subscriptionEnd.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.user_id)

      // Update payment status
      await supabaseAdmin
        .from('payments')
        .update({
          status: 'completed',
          paid_at: new Date().toISOString()
        })
        .eq('order_code', orderCode)

      return NextResponse.json({
        success: true,
        status: 'PAID',
        message: 'Payment verified and profile updated'
      })
    }

    return NextResponse.json({
      success: true,
      status: paymentInfo.status,
      amount: paymentInfo.amount,
      orderCode: paymentInfo.orderCode
    })

  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check payment status'
      },
      { status: 500 }
    )
  }
}
