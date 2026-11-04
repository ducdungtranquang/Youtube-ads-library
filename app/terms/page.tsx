import Link from "next/link";
import { Header } from "@/components/header";
import { ShieldAlert, FileText, CheckCircle2, AlertOctagon, Scale, Lock, UserCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Điều khoản dịch vụ | Ads Spy Tool",
  description: "Điều khoản sử dụng dịch vụ và chính sách chống crawl dữ liệu của Ads Spy Tool.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]" />

      <Header />

      <main className="flex-1 container max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 rounded-xl">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại trang đăng nhập</span>
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="space-y-3 pb-8 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
            <Scale className="h-3.5 w-3.5" />
            Văn bản pháp lý & Quy định sử dụng
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Điều Khoản Dịch Vụ (Terms of Service)
          </h1>
          <p className="text-sm text-slate-500">
            Cập nhật lần cuối: Tháng 11/2026 • Áp dụng cho toàn bộ người dùng đăng ký và sử dụng Ads Spy Tool.
          </p>
        </div>

        {/* Highlight Alert Box: Anti-Scraping / Anti-Crawling Policy */}
        <div className="my-8 p-5 sm:p-6 rounded-2xl bg-amber-50 border-2 border-amber-300/80 text-amber-950 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900 font-extrabold text-base">
            <AlertOctagon className="h-5 w-5 text-amber-600 shrink-0" />
            <span>QUY ĐỊNH ĐẶC BIỆT: NGHIÊM CẤM THU THẬP & CRAWL DỮ LIỆU TRÁI PHÉP</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90 font-medium">
            Người dùng <strong>TUYỆT ĐỐI KHÔNG ĐƯỢC</strong> sử dụng bất kỳ công cụ tự động, phần mềm bot, crawler, scraper, script hoặc phương thức kỹ thuật nào để trích xuất, thu thập hàng loạt (crawl / scrape / bulk download) cơ sở dữ liệu quảng cáo, dữ liệu phân tích sản phẩm, tài nguyên media hoặc thông tin độc quyền từ hệ thống <strong>Ads Spy Tool</strong> nhằm phục vụ cho mục đích thương mại riêng hoặc sao chép xây dựng các công cụ, sản phẩm tương tự (competitor ads spy tools).
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90">
            Mọi hành vi vi phạm sẽ bị khóa tài khoản vĩnh viễn ngay lập tức mà không cần báo trước, đồng thời chúng tôi bảo lưu quyền áp dụng các biện pháp pháp lý và kỹ thuật cần thiết để yêu cầu bồi thường thiệt hại.
          </p>
        </div>

        {/* Main Terms Sections */}
        <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">1</span>
              Chấp thuận Điều khoản
            </h2>
            <p>
              Bằng việc truy cập, đăng ký tài khoản, đăng nhập hoặc sử dụng bất kỳ tính năng nào của Ads Spy Tool, bạn xác nhận rằng bạn đã đọc kỹ, hiểu rõ và đồng ý bị ràng buộc bởi toàn bộ các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng ngừng sử dụng dịch vụ ngay lập tức.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">2</span>
              Mô tả Dịch vụ
            </h2>
            <p>
              Ads Spy Tool cung cấp nền tảng SaaS phục vụ cho việc nghiên cứu thị trường, theo dõi, thống kê, phân tích xu hướng quảng cáo kỹ thuật số (Facebook Ads, TikTok Ads, YouTube Ads...) dành cho các cá nhân, doanh nghiệp và các nhà tiếp thị (Performance Marketers / Media Buyers) với mục đích tham khảo sáng tạo ý tưởng và tối ưu hóa chiến dịch quảng bá.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">3</span>
              Quy định về Tài khoản và Bảo mật
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Bạn có trách nhiệm bảo mật thông tin đăng nhập tài khoản của mình và chịu hoàn toàn trách nhiệm đối với tất cả các hoạt động diễn ra dưới tài khoản của bạn.</li>
              <li>Mỗi tài khoản được đăng ký là duy nhất và dành riêng cho mục đích sử dụng cá nhân hoặc nội bộ của tổ chức bạn, không được phép chia sẻ, cho thuê lại hoặc chuyển nhượng trái phép cho bên thứ ba.</li>
              <li>Thông tin cung cấp khi đăng ký phải đảm bảo tính xác thực, cập nhật và chính xác.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">4</span>
              Hành vi bị Nghiêm cấm
            </h2>
            <p>Khi sử dụng nền tảng Ads Spy Tool, bạn cam kết không thực hiện các hành vi sau:</p>
            <div className="grid gap-2 sm:grid-cols-2 pt-1">
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-xs">Sử dụng bot/crawler để trích xuất dữ liệu, media, API hoặc thông tin phân tích hàng loạt.</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-xs">Đảo ngược mã nguồn (reverse engineer), can thiệp hoặc gây gián đoạn hệ thống máy chủ, proxy hoặc API.</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-xs">Sử dụng dữ liệu thu thập được từ Ads Spy Tool để phát triển hoặc vận hành công cụ cạnh tranh trực tiếp.</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-xs">Phát tán mã độc, virus hoặc thực hiện tấn công từ chối dịch vụ (DDoS) vào hạ tầng hệ thống.</span>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">5</span>
              Quyền Sở Hữu Trí Tuệ
            </h2>
            <p>
              Toàn bộ giao diện người dùng, cấu trúc dữ liệu tổng hợp, thuật toán tính điểm sáng tạo (creative score), chỉ số phân tích, tính năng dự đoán xu hướng và thương hiệu "Ads Spy Tool" đều thuộc quyền sở hữu trí tuệ độc quyền của chúng tôi.
            </p>
            <p className="text-xs text-slate-500">
              * Lưu ý: Các nội dung mẫu quảng cáo gốc (hình ảnh, video, văn bản quảng cáo của nhà quảng cáo bên thứ ba) thuộc bản quyền của chính chủ sở hữu quảng cáo đó và các nền tảng mạng xã hội liên quan. Ads Spy Tool chỉ tổng hợp cho mục đích lưu trữ tham khảo và học hỏi kỹ thuật tiếp thị.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">6</span>
              Giới hạn Trách nhiệm
            </h2>
            <p>
              Dịch vụ được cung cấp trên nguyên tắc "nguyên trạng" (as-is). Chúng tôi không bảo đảm rằng các dữ liệu dự đoán hay ước tính ngân sách chi tiêu quảng cáo sẽ chính xác 100% so với dữ liệu nội bộ thực tế của nhà quảng cáo. Bạn tự chịu trách nhiệm về mọi quyết định đầu tư, kinh doanh hoặc phân bổ ngân sách quảng cáo của riêng mình dựa trên dữ liệu tham khảo từ hệ thống.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">7</span>
              Sửa đổi Điều khoản
            </h2>
            <p>
              Chúng tôi có quyền cập nhật, thay đổi hoặc điều chỉnh các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được công bố trên trang web này. Việc bạn tiếp tục sử dụng dịch vụ sau khi các điều khoản được sửa đổi đồng nghĩa với việc bạn chấp nhận những thay đổi đó.
            </p>
          </section>
        </div>

        {/* Bottom Contact & Acceptance Action */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>Nếu bạn có bất kỳ câu hỏi nào về Điều khoản Dịch vụ, vui lòng liên hệ đội ngũ hỗ trợ qua kênh CSKH chính thức.</p>
          <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
            <Link href="/login">Đã hiểu & Quay lại Đăng nhập</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 relative z-10 bg-white/80">
        <div className="container px-4 text-center text-xs text-slate-500">
          <p>© 2025 - 2026 Ads Spy Tool. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

