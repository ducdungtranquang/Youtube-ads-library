"use client"

import { Search, Trophy, TrendingUp, CheckCircle2 } from "lucide-react"

interface AuthSpyShowcaseProps {
  mode: "login" | "register"
}

export function AuthSpyShowcase({ mode }: AuthSpyShowcaseProps) {
  return (
    <div className="hidden lg:flex flex-col justify-between space-y-8 py-2 pr-4">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Nền tảng nghiên cứu quảng cáo đa kênh</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-slate-900 leading-[1.22]">
          {mode === "login" ? (
            <>
              Theo dõi quảng cáo đối thủ.
              <br />
              <span className="text-indigo-600">Tìm sản phẩm thắng nhanh hơn.</span>
            </>
          ) : (
            <>
              Bắt đầu nghiên cứu
              <br />
              <span className="text-indigo-600">hàng triệu mẫu Ads thực tế.</span>
            </>
          )}
        </h1>

        <p className="text-sm xl:text-base text-slate-600 leading-relaxed max-w-lg">
          {mode === "login"
            ? "Đăng nhập để truy cập kho dữ liệu Facebook Ads, YouTube Ads và danh sách Winning Products cập nhật mỗi ngày."
            : "Tạo tài khoản miễn phí trong 30 giây. Khám phá creative đang chạy hiệu quả, landing page và sản phẩm tiềm năng."}
        </p>
      </div>

      {/* Clean Product Feature Summary Cards */}
      <div className="space-y-3">
        <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Thư viện Facebook Ads</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Tìm kiếm theo từ khóa, tên trang, quốc gia và lọc nhanh các mẫu quảng cáo đang hoạt động.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Kho Sản Phẩm Win (Winning Products)</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              500+ sản phẩm đang vít mạnh tại thị trường Việt Nam &amp; Global, kèm sẵn link ads và landing page.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Phân tích YouTube Ads chuyên sâu</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Xem ước tính chi tiêu, lượt tiếp cận, video Unlisted và phân tích kịch bản Hook 3 giây đầu.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Social Proof */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-slate-600 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Cập nhật dữ liệu hàng ngày</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>5,200+ Marketer đang sử dụng</span>
        </div>
      </div>
    </div>
  )
}
