import Link from "next/link";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import {
  HelpCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Scale,
  FileCheck,
  Building2,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Quy trình giải quyết khiếu nại | Ads Spy Tool",
  description: "Quy trình tiếp nhận và giải quyết khiếu nại của khách hàng tại CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK.",
};

export default function ComplaintHandlingPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
            <Scale className="h-3.5 w-3.5" />
            Bảo vệ quyền lợi người tiêu dùng
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Quy Trình Tiếp Nhận & Giải Quyết Khiếu Nại
          </h1>
          <p className="text-sm text-slate-500">
            CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK cam kết giải quyết minh bạch, công bằng và nhanh chóng mọi vướng mắc của khách hàng.
          </p>
        </div>

        {/* Quick Contact Box for Complaints */}
        <div className="my-8 p-6 rounded-3xl bg-white border-2 border-rose-200/90 text-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-800 font-extrabold text-base">
            <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
              <Phone className="h-5 w-5" />
            </div>
            <span>KÊNH TIẾP NHẬN KHIẾU NẠI TRỰC TIẾP CỦA BAN QUẢN TRỊ</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Mọi thắc mắc, khiếu nại về chất lượng dữ liệu, thời gian kích hoạt gói, sự cố kỹ thuật hoặc thái độ phục vụ của nhân viên, quý khách có thể gửi trực tiếp qua các đầu mối chính thức sau:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <Phone className="h-5 w-5 text-rose-600 shrink-0" />
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">Hotline khiếu nại / Khẩn cấp:</span>
                <a href="tel:0388875102" className="text-slate-900 font-mono font-bold text-sm hover:text-rose-600">
                  0388 875 102
                </a>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <Mail className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">Email giải quyết khiếu nại:</span>
                <a href="mailto:business.quickblack@gmail.com" className="text-slate-900 font-semibold text-xs hover:text-indigo-600 break-all">
                  business.quickblack@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Standard Resolution Workflow */}
        <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Quy Trình 4 Bước Giải Quyết Chuẩn
            </h2>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-sm shrink-0 font-mono border border-indigo-200">
                  BƯỚC 1
                </div>
                <div className="space-y-1.5 flex-1 text-xs sm:text-sm">
                  <h3 className="font-bold text-slate-900 text-sm">Gửi Thông Tin Khiếu Nại</h3>
                  <p className="text-slate-600">
                    Khách hàng gửi yêu cầu qua Hotline, Email hoặc biểu mẫu liên hệ, nêu rõ: Email tài khoản Ads Spy Tool, thời gian phát sinh sự cố, mô tả chi tiết vấn đề kèm hình ảnh/biên lai giao dịch (nếu có).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-amber-50 text-amber-700 font-black text-sm shrink-0 font-mono border border-amber-200">
                  BƯỚC 2
                </div>
                <div className="space-y-1.5 flex-1 text-xs sm:text-sm">
                  <h3 className="font-bold text-slate-900 text-sm">Tiếp Nhận & Xác Minh (Trong vòng 24 giờ làm việc)</h3>
                  <p className="text-slate-600">
                    Bộ phận Chăm sóc khách hàng & Kỹ thuật viên của QuickBlack sẽ phản hồi bằng văn bản xác nhận đã tiếp nhận khiếu nại, đồng thời tiến hành tra soát log hệ thống, kiểm tra cơ sở dữ liệu và liên hệ trao đổi thêm thông tin nếu cần thiết.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-sm shrink-0 font-mono border border-emerald-200">
                  BƯỚC 3
                </div>
                <div className="space-y-1.5 flex-1 text-xs sm:text-sm">
                  <h3 className="font-bold text-slate-900 text-sm">Đưa Ra Phương Án Xử Lý & Bồi Thường (Tối đa 48 giờ)</h3>
                  <p className="text-slate-600">
                    Dựa trên kết quả xác minh nguyên nhân:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 pt-1 text-xs">
                    <li>Nếu do lỗi kỹ thuật nghiêm trọng từ phía hệ thống: Áp dụng chính sách <strong>Kích hoạt tặng bù 01 tháng gói Unlimited miễn phí</strong> hoặc gia hạn tương ứng thời gian bị gián đoạn.</li>
                    <li>Nếu do sự cố mạng hoặc lỗi thao tác của người dùng: Kỹ thuật viên sẽ hướng dẫn chi tiết cách khắc phục từ xa qua Ultraview/AnyDesk hoặc tài liệu hướng dẫn.</li>
                  </ul>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-slate-100 text-slate-800 font-black text-sm shrink-0 font-mono border border-slate-300">
                  BƯỚC 4
                </div>
                <div className="space-y-1.5 flex-1 text-xs sm:text-sm">
                  <h3 className="font-bold text-slate-900 text-sm">Hoàn Tất & Khảo Sát Mức Độ Hài Lòng</h3>
                  <p className="text-slate-600">
                    Khách hàng kiểm tra lại tình trạng tài khoản và xác nhận kết quả xử lý. Bộ phận chất lượng ghi nhận trường hợp để cải tiến quy trình phục vụ ngày một tốt hơn.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cơ quan trọng tài pháp luật */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              Cơ Chế Giải Quyết Tranh Chấp Ngoài Tòa Án
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mọi tranh chấp phát sinh giữa người sử dụng và CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK trước hết sẽ được ưu tiên giải quyết thông qua thương lượng, hòa giải trên tinh thần tôn trọng quyền lợi của cả hai bên. Trường hợp không đạt được thỏa thuận chung sau 30 ngày kể từ ngày bắt đầu khiếu nại, một trong hai bên có quyền đưa vụ việc ra Tòa án nhân dân có thẩm quyền tại Thành phố Hà Nội để giải quyết theo quy định của pháp luật Việt Nam.
            </p>
          </section>
        </div>

        {/* Address & Working Hours Footer Info */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-100/90 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            <strong className="text-slate-900 block font-bold text-sm">CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK</strong>
            <p className="mt-0.5">Địa chỉ: Ngõ 240, Phố Nguyễn Lân, Phường Phương Liệt, TP Hà Nội, Việt Nam</p>
            <p className="text-slate-500 mt-0.5">Giờ làm việc: Thứ Hai – Thứ Bảy (08:30 – 18:00)</p>
          </div>
          <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shrink-0 cursor-pointer">
            <Link href="tel:0388875102">Gọi Hotline 0388 875 102</Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

