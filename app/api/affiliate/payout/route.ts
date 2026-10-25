import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { MIN_PAYOUT_AMOUNT } from '@/lib/affiliate'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount, bankName, bankAccount, bankHolder } = body

    if (!userId || !amount || !bankName || !bankAccount || !bankHolder) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ thông tin tài khoản ngân hàng và số tiền rút.' },
        { status: 400 }
      )
    }

    const withdrawAmount = Number(amount)
    if (isNaN(withdrawAmount) || withdrawAmount < MIN_PAYOUT_AMOUNT) {
      return NextResponse.json(
        { success: false, error: `Số tiền rút tối thiểu là ${MIN_PAYOUT_AMOUNT.toLocaleString('vi-VN')} VNĐ.` },
        { status: 400 }
      )
    }

    // 1. Fetch partner to check balance
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('affiliate_partners')
      .select('*')
      .eq('id', userId)
      .single()

    if (partnerError || !partner) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy hồ sơ đối tác tiếp thị.' },
        { status: 404 }
      )
    }

    if (Number(partner.balance) < withdrawAmount) {
      return NextResponse.json(
        { success: false, error: 'Số dư hoa hồng khả dụng không đủ để thực hiện yêu cầu này.' },
        { status: 400 }
      )
    }

    // 2. Insert payout request
    const { data: payout, error: payoutError } = await supabaseAdmin
      .from('affiliate_payouts')
      .insert({
        affiliate_id: userId,
        amount: withdrawAmount,
        bank_name: bankName.trim(),
        bank_account: bankAccount.trim(),
        bank_holder: bankHolder.trim().toUpperCase(),
        status: 'pending',
      })
      .select()
      .single()

    if (payoutError) {
      console.error('Payout insert error:', payoutError)
      return NextResponse.json(
        { success: false, error: 'Không thể tạo yêu cầu rút tiền lúc này. Vui lòng thử lại sau.' },
        { status: 500 }
      )
    }

    // 3. Deduct partner balance & save bank details
    const newBalance = Number(partner.balance) - withdrawAmount
    const newTotalWithdrawn = Number(partner.total_withdrawn || 0) + withdrawAmount

    await supabaseAdmin
      .from('affiliate_partners')
      .update({
        balance: newBalance,
        total_withdrawn: newTotalWithdrawn,
        bank_name: bankName.trim(),
        bank_account: bankAccount.trim(),
        bank_holder: bankHolder.trim().toUpperCase(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    return NextResponse.json({
      success: true,
      message: 'Gửi yêu cầu rút tiền hoa hồng thành công! Ban quản trị sẽ xử lý trong 24h làm việc.',
      data: payout,
      newBalance
    })

  } catch (error) {
    console.error('Affiliate payout error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Lỗi hệ thống khi xử lý rút tiền.' },
      { status: 500 }
    )
  }
}
