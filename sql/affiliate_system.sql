-- ==============================================================================
-- ADS SPY TOOL - AFFILIATE & 20% COMMISSION SYSTEM MIGRATION
-- ==============================================================================

-- 1. Bảng lưu thông tin đối tác tiếp thị (Affiliate Partners)
CREATE TABLE IF NOT EXISTS public.affiliate_partners (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code VARCHAR(32) UNIQUE NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,         -- Số dư khả dụng có thể rút
  total_earned NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,    -- Tổng hoa hồng 20% tích lũy trọn đời
  total_withdrawn NUMERIC(15, 2) DEFAULT 0.00 NOT NULL, -- Tổng tiền đã rút thành công
  total_clicks INTEGER DEFAULT 0 NOT NULL,              -- Số lượt click vào link
  total_signups INTEGER DEFAULT 0 NOT NULL,             -- Số người dùng đăng ký qua link
  total_conversions INTEGER DEFAULT 0 NOT NULL,         -- Số đơn thanh toán thành công
  bank_name VARCHAR(100),                               -- Tên ngân hàng nhận hoa hồng
  bank_account VARCHAR(50),                             -- Số tài khoản ngân hàng
  bank_holder VARCHAR(150),                             -- Tên chủ tài khoản
  status VARCHAR(20) DEFAULT 'active' NOT NULL,         -- 'active', 'paused', 'banned'
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index tra cứu mã giới thiệu nhanh
CREATE INDEX IF NOT EXISTS idx_affiliate_referral_code ON public.affiliate_partners(referral_code);

-- 2. Bảng ghi nhận từng đơn hàng được chia 20% hoa hồng (Affiliate Commissions)
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliate_partners(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_email VARCHAR(255) NOT NULL,
  order_code BIGINT NOT NULL,                           -- Mã đơn hàng PayOS
  plan_name VARCHAR(100) NOT NULL,                      -- Gói đăng ký: 'Gói 1 tháng', 'Gói 3 tháng', 'Gói 1 năm'
  order_amount NUMERIC(15, 2) NOT NULL,                 -- Giá trị đơn hàng (VNĐ)
  commission_rate NUMERIC(5, 2) DEFAULT 0.20 NOT NULL,  -- Tỷ lệ hoa hồng 20%
  commission_amount NUMERIC(15, 2) NOT NULL,            -- Số tiền hoa hồng 20% (order_amount * 0.2)
  status VARCHAR(30) DEFAULT 'completed' NOT NULL,      -- 'pending', 'completed', 'refunded'
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON public.affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_code ON public.affiliate_commissions(order_code);

-- 3. Bảng yêu cầu rút tiền hoa hồng (Affiliate Payouts)
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliate_partners(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,                       -- Số tiền yêu cầu rút (Tối thiểu 200,000đ)
  bank_name VARCHAR(100) NOT NULL,
  bank_account VARCHAR(50) NOT NULL,
  bank_holder VARCHAR(150) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending' NOT NULL,        -- 'pending', 'processing', 'completed', 'rejected'
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payouts_affiliate_id ON public.affiliate_payouts(affiliate_id);

-- 4. Bổ sung cột referral_code vào bảng payments và user_profiles (nếu chưa có)
ALTER TABLE IF EXISTS public.payments ADD COLUMN IF NOT EXISTS referral_code VARCHAR(32);
ALTER TABLE IF EXISTS public.user_profiles ADD COLUMN IF NOT EXISTS referred_by VARCHAR(32);

-- 5. Thiết lập Row Level Security (RLS)
ALTER TABLE public.affiliate_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Policy: Đối tác xem thông tin của chính mình
CREATE POLICY "Users can view own affiliate profile"
  ON public.affiliate_partners FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own affiliate payout info"
  ON public.affiliate_partners FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Đối tác xem danh sách hoa hồng của mình
CREATE POLICY "Users can view own commissions"
  ON public.affiliate_commissions FOR SELECT
  USING (auth.uid() = affiliate_id);

-- Policy: Đối tác xem và tạo yêu cầu rút tiền của mình
CREATE POLICY "Users can view own payouts"
  ON public.affiliate_payouts FOR SELECT
  USING (auth.uid() = affiliate_id);

CREATE POLICY "Users can create own payout requests"
  ON public.affiliate_payouts FOR INSERT
  WITH CHECK (auth.uid() = affiliate_id);
