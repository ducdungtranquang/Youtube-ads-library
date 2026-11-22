import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null

export async function POST(request: NextRequest) {
  try {
    const { userId, referralCode } = await request.json()

    if (!userId || !referralCode || !supabaseAdmin) {
      return NextResponse.json({ success: false, message: 'Thiếu thông tin người dùng hoặc mã giới thiệu.' }, { status: 400 })
    }

    const cleanCode = referralCode.trim().toUpperCase()

    // 1. Kiểm tra mã giới thiệu có tồn tại trên hệ thống không
    const { data: partner } = await supabaseAdmin
      .from('affiliate_partners')
      .select('id, referral_code, user_email, total_signups')
      .eq('referral_code', cleanCode)
      .maybeSingle()

    if (!partner) {
      return NextResponse.json({ success: false, message: `Mã giới thiệu "${cleanCode}" không tồn tại hoặc đã hết hạn.` }, { status: 404 })
    }

    // Không được tự giới thiệu chính mình
    if (partner.id === userId) {
      return NextResponse.json({ success: false, message: 'Bạn không thể áp dụng mã giới thiệu của chính mình.' }, { status: 400 })
    }

    // 2. Kiểm tra xem profile của user này đã có người giới thiệu chưa
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('id, referred_by')
      .eq('id', userId)
      .maybeSingle()

    if (profile?.referred_by) {
      return NextResponse.json({
        success: false,
        message: `Tài khoản của bạn đã được liên kết với mã giới thiệu: ${profile.referred_by}.`
      }, { status: 400 })
    }

    // 3. Cập nhật mã người giới thiệu vào user_profiles
    const { error: updateErr } = await supabaseAdmin
      .from('user_profiles')
      .update({
        referred_by: cleanCode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (updateErr) {
      return NextResponse.json({ success: false, message: 'Không thể cập nhật hồ sơ người dùng.' }, { status: 500 })
    }

    // 4. Tăng tổng lượt đăng ký qua mã cho đối tác
    await supabaseAdmin
      .from('affiliate_partners')
      .update({
        total_signups: (partner.total_signups || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', partner.id)

    return NextResponse.json({
      success: true,
      message: `Đã liên kết mã giới thiệu ${cleanCode} thành công!`,
      referred_by: cleanCode,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Lỗi hệ thống khi áp dụng mã giới thiệu.' }, { status: 500 })
  }
}
