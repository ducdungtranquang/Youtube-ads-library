import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { payos } from '@/lib/payos'
import { notifyPaymentSuccess } from '@/lib/services/payment-notifier'

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
    let webhookData: any = null
    try {
      webhookData = await payos.webhooks.verify(body)
      console.log('Verified webhook data:', webhookData)
    } catch (verifyError) {
      console.error('Invalid webhook signature:', verifyError)
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const orderCode = webhookData?.orderCode ?? body?.data?.orderCode ?? body?.orderCode
    const code = body?.code ?? webhookData?.code ?? body?.data?.code
    const desc = body?.desc ?? webhookData?.desc ?? body?.data?.desc

    // code === '00' or success status means payment success
    const isPaymentSuccess = code === '00' || desc === 'success' || body?.success === true

    if (isPaymentSuccess && orderCode) {
      // Get payment info from database with flexible number/string type check
      let { data: payment } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('order_code', orderCode)
        .maybeSingle()

      if (!payment && typeof orderCode === 'number') {
        const { data: p2 } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('order_code', String(orderCode))
          .maybeSingle()
        payment = p2
      } else if (!payment && typeof orderCode === 'string') {
        const num = Number(orderCode)
        if (!isNaN(num)) {
          const { data: p2 } = await supabaseAdmin
            .from('payments')
            .select('*')
            .eq('order_code', num)
            .maybeSingle()
          payment = p2
        }
      }

      // Check if PayOS has payment info in case DB insert was missing
      let paymentInfo: any = null
      try {
        paymentInfo = await payos.paymentRequests.get(Number(orderCode))
      } catch (payosErr) {
        console.warn('[Webhook] Could not fetch paymentRequests from PayOS:', payosErr)
      }

      // Resolve user ID and Email
      let targetUserId = payment?.user_id
      let targetEmail = payment?.user_email || webhookData?.counterAccountName || paymentInfo?.buyerEmail

      if (!targetUserId && targetEmail) {
        const { data: profileByEmail } = await supabaseAdmin
          .from('user_profiles')
          .select('id, email')
          .eq('email', targetEmail)
          .maybeSingle()
        if (profileByEmail) {
          targetUserId = profileByEmail.id
          targetEmail = profileByEmail.email
        }
      }

      if (!targetUserId) {
        console.error('Payment user not found for orderCode:', orderCode)
        return NextResponse.json(
          { success: false, error: 'User for payment not found' },
          { status: 404 }
        )
      }

      // Check if payment was already processed to avoid duplicated notifications / renewals
      const isAlreadyCompleted = payment?.status === 'completed'

      // Calculate subscription end date based on payment amount (1, 3, or 12 months)
      const rawAmount = Number(payment?.amount || webhookData?.amount || body?.data?.amount || paymentInfo?.amount || 0)
      const subscriptionStart = new Date()
      const subscriptionEnd = new Date()
      let durationMonths = 1
      if (rawAmount >= 900000) {
        durationMonths = 12
      } else if (rawAmount >= 250000) {
        durationMonths = 3
      }
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + durationMonths)

      // Upsert user profile with subscription (create if not exists)
      const { error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .upsert({
          id: targetUserId,
          email: targetEmail,
          subscription_status: 'unlimited',
          subscription_plan: 'unlimited',
          subscription_start: subscriptionStart.toISOString(),
          subscription_end: subscriptionEnd.toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (updateError) {
        console.error('Profile update error:', updateError)
        return NextResponse.json(
          { success: false, error: 'Failed to update profile' },
          { status: 500 }
        )
      }

      // Update or create payment record
      if (payment) {
        await supabaseAdmin
          .from('payments')
          .update({
            status: 'completed',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('order_code', orderCode)
      } else {
        await supabaseAdmin
          .from('payments')
          .insert({
            order_code: orderCode,
            user_id: targetUserId,
            user_email: targetEmail,
            plan_id: 'unlimited',
            amount: rawAmount,
            status: 'completed',
            paid_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          })
      }

      // Xử lý tính hoa hồng 20% cho đối tác tiếp thị nếu có mã giới thiệu
      if (payment?.referral_code && !isAlreadyCompleted) {
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
                referred_user_id: targetUserId,
                referred_email: targetEmail,
                order_code: orderCode,
                plan_name: 'Gói Unlimited',
                order_amount: rawAmount,
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

      // Gửi thông báo tức thì về Slack và Email (báo về điện thoại cho admin) nếu đơn hàng mới được hoàn thành
      if (!isAlreadyCompleted) {
        notifyPaymentSuccess({
          orderCode,
          amount: rawAmount,
          userEmail: targetEmail,
          userId: targetUserId,
          planName: 'Gói Unlimited',
          durationMonths,
          referralCode: payment?.referral_code,
          paidAt: new Date(),
        }).catch((err) => console.error('[Webhook] Failed to dispatch payment notification:', err))
      }

      console.log(`Payment ${orderCode} completed successfully for user ${targetUserId}`)

      return NextResponse.json({ success: true })
    } else {
      // Payment failed or cancelled
      console.log(`Payment ${orderCode} failed/cancelled: ${desc}`)

      if (orderCode) {
        await supabaseAdmin
          .from('payments')
          .update({
            status: 'failed',
            error_message: desc
          })
          .eq('order_code', orderCode)
      }

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
