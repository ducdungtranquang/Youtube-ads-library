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

      // Calculate subscription end date based on payment amount (1, 3, or 12 months)
      const subscriptionStart = new Date()
      const subscriptionEnd = new Date()
      let durationMonths = 1
      if (payment.amount >= 900000) {
        durationMonths = 12
      } else if (payment.amount >= 250000) {
        durationMonths = 3
      }
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + durationMonths)

      // Update user profile with subscription
      const { error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_status: 'unlimited',
          subscription_plan: 'unlimited',
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

      // Xử lý tính hoa hồng 20% cho đối tác tiếp thị nếu có mã giới thiệu
      if (payment.referral_code) {
        try {
          const { data: partner } = await supabaseAdmin
            .from('affiliate_partners')
            .select('*')
            .eq('referral_code', payment.referral_code.toString().trim().toUpperCase())
            .maybeSingle()

          if (partner && partner.id !== payment.user_id) {
            const commission = Math.round(Number(payment.amount) * 0.20)

            // Ghi log hoa hồng
            await supabaseAdmin
              .from('affiliate_commissions')
              .insert({
                affiliate_id: partner.id,
                referred_user_id: payment.user_id,
                referred_email: payment.user_email,
                order_code: orderCode,
                plan_name: 'Gói Unlimited',
                order_amount: payment.amount,
                commission_rate: 0.20,
                commission_amount: commission,
                status: 'completed',
              })

            // Cập nhật số dư và số đơn chuyển đổi cho đối tác
            await supabaseAdmin
              .from('affiliate_partners')
              .update({
                balance: Number(partner.balance || 0) + commission,
                total_earned: Number(partner.total_earned || 0) + commission,
                total_conversions: Number(partner.total_conversions || 0) + 1,
                updated_at: new Date().toISOString(),
              })
              .eq('id', partner.id)

            console.log(`Credited 20% commission (${commission} VND) to affiliate ${partner.referral_code}`)
          }
        } catch (affErr) {
          console.error('Affiliate commission processing error:', affErr)
        }
      }

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
