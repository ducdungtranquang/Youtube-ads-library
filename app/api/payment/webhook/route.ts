import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { payos } from '@/lib/payos'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('PayOS Webhook received:', JSON.stringify(body, null, 2))

    // Verify webhook signature using SDK v2
    try {
      const webhookData = (payos.webhooks as any).verifyPaymentData(body)
      console.log('Verified webhook data:', webhookData)
    } catch (verifyError) {
      console.error('Invalid webhook signature:', verifyError)
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const { orderCode, code, desc } = body.data || body

    // code === '00' means payment success
    if (code === '00') {
      // Get payment info from database
      const { data: payment, error: fetchError } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('order_code', orderCode)
        .single()

      if (fetchError || !payment) {
        console.error('Payment not found:', fetchError)
        return NextResponse.json(
          { success: false, error: 'Payment not found' },
          { status: 404 }
        )
      }

      // Calculate subscription end date (1 month from now)
      const subscriptionStart = new Date()
      const subscriptionEnd = new Date()
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)

      // Update user profile with subscription
      const { error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_status: payment.plan_id,
          subscription_plan: payment.plan_id,
          subscription_start: subscriptionStart.toISOString(),
          subscription_end: subscriptionEnd.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.user_id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        return NextResponse.json(
          { success: false, error: 'Failed to update profile' },
          { status: 500 }
        )
      }

      // Update payment status
      await supabaseAdmin
        .from('payments')
        .update({
          status: 'completed',
          paid_at: new Date().toISOString()
        })
        .eq('order_code', orderCode)

      console.log(`Payment ${orderCode} completed successfully for user ${payment.user_id}`)

      return NextResponse.json({ success: true })
    } else {
      // Payment failed or cancelled
      console.log(`Payment ${orderCode} failed/cancelled: ${desc}`)

      await supabaseAdmin
        .from('payments')
        .update({
          status: 'failed',
          error_message: desc
        })
        .eq('order_code', orderCode)

      return NextResponse.json({ success: true })
    }

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook processing failed'
      },
      { status: 500 }
    )
  }
}

// PayOS may send GET request for webhook verification
export async function GET() {
  return NextResponse.json({ message: 'PayOS Webhook endpoint is active' })
}
