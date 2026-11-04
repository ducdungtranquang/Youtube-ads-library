import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  ExternalLink,
  Scale,
  Sparkles,
} from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700 relative z-10 selection:bg-rose-500 selection:text-white">
      {/* Upper Main Footer Grid */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand & Business Legal Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                  Ads Spy Tool
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-indigo-600">
                  QuickBlack Digital Tech Co., Ltd
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Nền tảng phân tích và nghiên cứu dữ liệu quảng cáo số (Facebook Ads, YouTube Ads, TikTok Ads) hàng đầu cho Performance Marketers & Doanh nghiệp.
            </p>

            {/* Official Enterprise Legal Information Box */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 space-y-2 text-xs text-slate-700 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-[13px] border-b border-slate-200/80 pb-2">
                <Building2 className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 text-[11.5px]">
                <div>
                  <span className="text-slate-500 font-medium">Mã số thuế:</span>{" "}
                  <strong className="text-slate-900 font-mono font-bold">0111005412</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Tình trạng:</span>{" "}
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Đang hoạt động
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Ngày hoạt động:</span>{" "}
                  <strong className="text-slate-900 font-mono">28/03/2025</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Nơi cấp:</span>{" "}
                  <span className="text-slate-800 font-medium">Sở KH&ĐT TP Hà Nội</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-medium">Người đại diện:</span>{" "}
                  <strong className="text-slate-900 font-bold">TRẦN QUANG ĐỨC DŨNG</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-medium">Tên quốc tế:</span>{" "}
                  <span className="text-slate-800 font-medium">
                    QUICKBLACK DIGITAL TECHNOLOGY COMPANY LIMITED
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-medium">Tên viết tắt:</span>{" "}
                  <span className="text-slate-800 font-medium">CÔNG TY QUICKBLACK</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70 text-[11.5px] space-y-1">
                <div className="flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 font-medium">Địa chỉ trụ sở / Thuế:</span>{" "}
                    <span className="text-slate-900 font-medium">
                      Ngõ 240, Phố Nguyễn Lân, Phường Phương Liệt, TP Hà Nội, Việt Nam
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Legal & Compliance Links (3 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
              <Scale className="h-4 w-4 text-indigo-600" />
              <span>Chính sách & Quy định pháp lý</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Các điều khoản, chính sách bảo vệ người tiêu dùng và tuân thủ Nghị định pháp luật Việt Nam:
            </p>

            <ul className="space-y-2 pt-1 text-xs">
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 hover:translate-x-0.5 transition-all py-1 font-medium group"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span>Điều khoản dịch vụ & Chống Crawl</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 hover:translate-x-0.5 transition-all py-1 font-medium group"
                >
                  <CreditCard className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span>Chính sách thanh toán & hoàn tiền (Bảo hành 1 tháng Unlimited)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 hover:translate-x-0.5 transition-all py-1 font-medium group"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span>Chính sách bảo mật (Theo NĐ 13/2023/NĐ-CP)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/complaint-handling"
                  className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 hover:translate-x-0.5 transition-all py-1 font-medium group"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span>Quy trình tiếp nhận & giải quyết khiếu nại</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support & Contact Hotline (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
              <Phone className="h-4 w-4 text-rose-600" />
              <span>Hỗ trợ & CSKH 24/7</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kênh liên hệ tiếp nhận thắc mắc kỹ thuật, thanh toán hoặc khiếu nại dịch vụ:
            </p>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="rounded-xl border border-slate-200/90 bg-white p-3 space-y-2">
                <div>
                  <span className="text-slate-400 text-[11px] block font-medium">Hotline hỗ trợ:</span>
                  <a
                    href="tel:0388875102"
                    className="text-slate-900 font-mono font-black text-sm hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5 text-rose-500" />
                    <span>0388 875 102</span>
                  </a>
                </div>

                <div className="pt-1.5 border-t border-slate-100">
                  <span className="text-slate-400 text-[11px] block font-medium">Email CSKH & Kỹ thuật:</span>
                  <a
                    href="mailto:business.quickblack@gmail.com"
                    className="text-slate-900 font-medium text-xs hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5 break-all"
                  >
                    <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span>business.quickblack@gmail.com</span>
                  </a>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 rounded-lg p-2 border border-slate-200/70">
                <span className="font-semibold text-slate-700">Thời gian làm việc:</span> Thứ 2 – Thứ 7 (08:30 – 18:00). Hỗ trợ khẩn cấp qua Hotline 24/7.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Trademark & Compliance Notice */}
      <div className="border-t border-slate-200 bg-slate-50/70 py-6">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} <strong>Ads Spy Tool</strong>. Bản quyền thuộc về{" "}
            <strong>CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK</strong> (MST: 0111005412).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-600">
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">
              Điều khoản
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-indigo-600 transition-colors">
              Chính sách thanh toán
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-indigo-600 transition-colors">
              Bảo mật NĐ 13/2023
            </Link>
            <span>•</span>
            <Link href="/complaint-handling" className="hover:text-indigo-600 transition-colors">
              Giải quyết khiếu nại
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

