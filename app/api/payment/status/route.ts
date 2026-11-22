import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { payos } from '@/lib/payos'
import { notifyPaymentSuccess } from '@/lib/services/payment-notifier'

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
    const numOrderCode = Number(orderCode)
    const paymentInfo = await payos.paymentRequests.get(numOrderCode)

    // Get payment from database with flexible number/string type check
    let { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('order_code', orderCode)
      .maybeSingle()

    if (!payment && !isNaN(numOrderCode)) {
      const { data: p2 } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('order_code', numOrderCode)
        .maybeSingle()
      payment = p2
    }

    // A payment is considered successful if PayOS status is PAID
    // OR if the user paid in full (amountPaid >= amount) - covers late transfers after 15m expiration
    const isPaidInPayOS =
      paymentInfo.status === 'PAID' ||
      (typeof paymentInfo.amountPaid === 'number' && paymentInfo.amountPaid >= paymentInfo.amount)

    // If payment is PAID or fully transferred in PayOS, but our DB not updated yet, update it
    if (isPaidInPayOS && payment?.status !== 'completed') {
      const paidAmount = Number(payment?.amount || paymentInfo?.amountPaid || paymentInfo?.amount || 0)
      const userEmail = payment?.user_email || (paymentInfo as any)?.buyerEmail
      let targetUserId = payment?.user_id

      if (!targetUserId && userEmail) {
        const { data: profileByEmail } = await supabaseAdmin
          .from('user_profiles')
          .select('id')
          .eq('email', userEmail)
          .maybeSingle()
        targetUserId = profileByEmail?.id
      }

      const subscriptionStart = new Date()
      const subscriptionEnd = new Date()
      let durationMonths = 1
      if (paidAmount >= 900000) {
        durationMonths = 12
      } else if (paidAmount >= 250000) {
        durationMonths = 3
      }
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + durationMonths)

      // Upsert user profile with subscription (create if not exists)
      if (targetUserId) {
        await supabaseAdmin
          .from('user_profiles')
          .upsert({
            id: targetUserId,
            email: userEmail,
            subscription_status: 'unlimited',
            subscription_plan: 'unlimited',
            subscription_start: subscriptionStart.toISOString(),
            subscription_end: subscriptionEnd.toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })
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
      } else if (targetUserId) {
        await supabaseAdmin
          .from('payments')
          .insert({
            order_code: numOrderCode || orderCode,
            user_id: targetUserId,
            user_email: userEmail,
            plan_id: 'unlimited',
            amount: paidAmount,
            status: 'completed',
            paid_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          })
      }

      // Xử lý tính hoa hồng 20% cho đối tác tiếp thị nếu có mã giới thiệu
      if (payment?.referral_code && targetUserId) {
        try {
          const { data: partner } = await supabaseAdmin
            .from('affiliate_partners')
            .select('*')
            .eq('referral_code', payment.referral_code.toString().trim().toUpperCase())
            .maybeSingle()

          if (partner && partner.id !== targetUserId) {
            const commission = Math.round(paidAmount * 0.20)

            await supabaseAdmin
              .from('affiliate_commissions')
              .insert({
                affiliate_id: partner.id,
                referred_user_id: targetUserId,
                referred_email: userEmail,
                order_code: orderCode,
                plan_name: 'Gói Unlimited',
                order_amount: paidAmount,
                commission_rate: 0.20,
                commission_amount: commission,
                status: 'completed',
              })

            await supabaseAdmin
              .from('affiliate_partners')
              .update({
                balance: Number(partner.balance || 0) + commission,
                total_earned: Number(partner.total_earned || 0) + commission,
                total_conversions: Number(partner.total_conversions || 0) + 1,
                updated_at: new Date().toISOString(),
              })
              .eq('id', partner.id)
          }
        } catch (affErr) {
          console.error('[Status API] Affiliate commission error:', affErr)
        }
      }

      // Gửi thông báo tức thì về Slack và Email (báo về điện thoại cho admin)
      notifyPaymentSuccess({
        orderCode,
        amount: paidAmount,
        userEmail: userEmail,
        userId: targetUserId,
        planName: 'Gói Unlimited',
        durationMonths,
        referralCode: payment?.referral_code,
        paidAt: new Date(),
      }).catch((err) => console.error('[Status API] Failed to dispatch payment notification:', err))

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
