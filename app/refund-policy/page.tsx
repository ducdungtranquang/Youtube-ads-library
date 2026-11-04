import Link from "next/link";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import {
  CreditCard,
  Gift,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Chính sách thanh toán & hoàn tiền | Ads Spy Tool",
  description: "Chính sách thanh toán, kích hoạt gói cước và cam kết bù 1 tháng Unlimited miễn phí khi gặp sự cố tại Ads Spy Tool.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]" />

      <Header />

      <main className="flex-1 container max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 rounded-xl">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại trang chủ</span>
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="space-y-3 pb-8 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <CreditCard className="h-3.5 w-3.5" />
            Quy định giao dịch & Dịch vụ số
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Chính Sách Thanh Toán & Hoàn Tiền
          </h1>
          <p className="text-sm text-slate-500">
            Cập nhật lần cuối: Tháng 11/2026 • Ban hành bởi CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK.
          </p>
        </div>

        {/* Highlight Alert Box: No-Cash-Refund + Free Unlimited Extension Policy */}
        <div className="my-8 p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-rose-50 border-2 border-indigo-200/90 text-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-indigo-900 font-extrabold text-base">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Gift className="h-5 w-5" />
            </div>
            <span>CAM KẾT ĐẶC QUYỀN BẢO HÀNH DỊCH VỤ (SERVICE WARRANTY)</span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-slate-700">
            <p>
              Do đặc thù của <strong>Ads Spy Tool</strong> là sản phẩm phần mềm trực tuyến (SaaS), dữ liệu và tính năng số được mở khóa và cung cấp tức thời ngay sau khi người dùng nâng cấp gói thành công, nên chính sách dịch vụ của chúng tôi <strong>KHÔNG ÁP DỤNG HOÀN TIỀN MẶT / CHUYỂN KHOẢN LẠI</strong> cho các khoản phí đã thanh toán.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 font-medium">
              <strong className="text-amber-900 flex items-center gap-1.5 mb-1 text-sm font-bold">
                <Zap className="h-4 w-4 text-amber-600 shrink-0" />
                Chính sách Bù 01 Tháng Unlimited Miễn Phí (Đền bù lỗi kỹ thuật):
              </strong>
              Trong trường hợp hệ thống gặp lỗi kỹ thuật nghiêm trọng kéo dài do phía nhà cung cấp (máy chủ gián đoạn quá 24h, tính năng tìm kiếm chính không thể sử dụng) gây ảnh hưởng trực tiếp đến trải nghiệm của quý khách, hệ thống sẽ <strong>TỰ ĐỘNG KÍCH HOẠT VÀ TẶNG THÊM 01 THÁNG GÓI UNLIMITED HOÀN TOÀN MIỄN PHÍ</strong> vào tài khoản của quý khách như một lời tri ân và cam kết đồng hành bền vững.
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Phương thức thanh toán */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">1</span>
              Hình thức Thanh toán Hỗ trợ
            </h2>
            <p>
              Hệ thống Ads Spy Tool hỗ trợ các phương thức thanh toán điện tử an toàn, tiện lợi qua cổng thanh toán tự động và chuyển khoản ngân hàng:
            </p>
            <div className="grid gap-3 sm:grid-cols-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                <strong className="text-xs font-bold text-slate-900 block">Chuyển khoản QR Napas 24/7</strong>
                <p className="text-xs text-slate-500">Quét mã QR qua app ngân hàng hoặc VietQR, tự động kích hoạt tài khoản trong vòng 30 giây.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                <strong className="text-xs font-bold text-slate-900 block">Thẻ ATM / Internet Banking</strong>
                <p className="text-xs text-slate-500">Hỗ trợ tất cả các ngân hàng nội địa tại Việt Nam thông qua cổng giao dịch trực tuyến.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                <strong className="text-xs font-bold text-slate-900 block">Thẻ Quốc Tế (Visa / Mastercard)</strong>
                <p className="text-xs text-slate-500">Mã hóa chuẩn PCI-DSS cấp độ cao nhất, bảo mật tuyệt đối thông tin thẻ khách hàng.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Thời gian kích hoạt & Giao nhận dịch vụ */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">2</span>
              Thời gian Kích hoạt Dịch vụ
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Kích hoạt tự động:</strong> Hạn mức tra cứu và các tính năng nâng cao (Bộ lọc Minea, Spy Winning Ads, Tải video HD) sẽ được mở khóa ngay lập tức khi hệ thống nhận được tín hiệu thanh toán thành công (Webhook ngân hàng).
              </li>
              <li>
                <strong>Xác nhận qua Email:</strong> Hệ thống tự động gửi thông báo xác nhận giao dịch kèm thông tin thời hạn gói cước về địa chỉ email đăng ký tài khoản của quý khách.
              </li>
              <li>
                Trường hợp sau 15 phút kể từ khi trừ tiền trong tài khoản mà gói cước chưa tự động mở, vui lòng liên hệ ngay với bộ phận CSKH qua Hotline <strong className="font-mono text-slate-900">0388 875 102</strong> hoặc email <strong className="text-slate-900">business.quickblack@gmail.com</strong> kèm biên lai để được hỗ trợ kích hoạt thủ công ngay tức khắc.
              </li>
            </ul>
          </section>

          {/* Section 3: Quy định bảo lưu và Bồi thường dịch vụ */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">3</span>
              Điều kiện Kích hoạt Gói Unlimited Bù (Bảo hành sự cố)
            </h2>
            <p>
              Gói Unlimited 01 tháng miễn phí sẽ được áp dụng trong các trường hợp sau:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">
                  Sự cố downtime máy chủ kéo dài liên tục trên 24 giờ mà không có kế hoạch bảo trì báo trước.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">
                  Lỗi hệ cơ sở dữ liệu làm gián đoạn toàn bộ hoạt động tra cứu của tài khoản trả phí trên 48 giờ làm việc.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">
                  Bộ phận kỹ thuật xác nhận lỗi nghiệm thu thuộc về hệ thống của QuickBlack và không thể khắc phục kịp thời trong thời gian cam kết SLA.
                </span>
              </div>
            </div>
          </section>

          {/* Section 4: Hủy gia hạn */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">4</span>
              Chính sách Gia hạn & Hủy Gói
            </h2>
            <p>
              Tất cả các gói cước tại Ads Spy Tool được thiết lập theo chu kỳ linh hoạt (1 tháng / 6 tháng / 1 năm) và không tự động trừ tiền âm thầm nếu người dùng không thiết lập tính năng Recurring Billing. Quý khách hoàn toàn chủ động trong việc nâng cấp hoặc ngừng sử dụng khi hết hạn gói cước mà không phát sinh thêm bất kỳ chi phí ẩn nào.
            </p>
          </section>
        </div>

        {/* Support Help Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-100/80 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Cần hỗ trợ về thanh toán hoặc kích hoạt gói?</h4>
            <p className="mt-0.5">Hotline: 0388 875 102 • Email: business.quickblack@gmail.com (Phản hồi trong vòng 1 giờ)</p>
          </div>
          <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shrink-0 cursor-pointer">
            <Link href="/pricing">Xem bảng giá gói cước</Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

