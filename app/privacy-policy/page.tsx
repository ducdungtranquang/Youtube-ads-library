import Link from "next/link";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileCheck2,
  Database,
  UserCheck,
  Building2,
  ArrowLeft,
  AlertCircle,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Chính sách bảo mật (NĐ 13/2023/NĐ-CP) | Ads Spy Tool",
  description: "Chính sách bảo vệ dữ liệu cá nhân theo Nghị định số 13/2023/NĐ-CP của Chính phủ Việt Nam tại Ads Spy Tool.",
};

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            Tuân thủ pháp luật Việt Nam • NĐ 13/2023/NĐ-CP
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Chính Sách Bảo Mật & Bảo Vệ Dữ Liệu Cá Nhân
          </h1>
          <p className="text-sm text-slate-500">
            Ban hành và áp dụng bởi CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK • Hiệu lực từ tháng 04/2025.
          </p>
        </div>

        {/* Legal Context Notice */}
        <div className="my-8 p-6 rounded-3xl bg-white border-2 border-emerald-200/90 text-slate-900 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm sm:text-base">
            <FileCheck2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>CAM KẾT TUÂN THỦ NGHỊ ĐỊNH SỐ 13/2023/NĐ-CP VỀ BẢO VỆ DỮ LIỆU CÁ NHÂN</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Chính sách bảo mật này quy định cách thức <strong>CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK</strong> (sau đây gọi tắt là "Chúng tôi" hoặc "QuickBlack") thu thập, lưu trữ, xử lý, bảo vệ và quản lý dữ liệu cá nhân của người sử dụng nền tảng <strong>Ads Spy Tool</strong>, đảm bảo phù hợp đầy đủ các nguyên tắc bảo vệ quyền riêng tư theo quy định pháp luật hiện hành của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
          </p>
        </div>

        {/* Detailed Policy Sections */}
        <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Thông tin người kiểm soát dữ liệu */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">1</span>
              Bên Kiểm Soát & Xử Lý Dữ Liệu Cá Nhân
            </h2>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1.5">
              <p><strong>Đơn vị:</strong> CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK</p>
              <p><strong>Mã số doanh nghiệp (MST):</strong> 0111005412 do Sở Kế hoạch và Đầu tư TP Hà Nội cấp.</p>
              <p><strong>Người đại diện theo pháp luật:</strong> TRẦN QUANG ĐỨC DŨNG</p>
              <p><strong>Địa chỉ trụ sở:</strong> Ngõ 240, Phố Nguyễn Lân, Phường Phương Liệt, TP Hà Nội, Việt Nam.</p>
              <p><strong>Email chuyên trách bảo vệ dữ liệu (DPO):</strong> business.quickblack@gmail.com</p>
              <p><strong>Điện thoại:</strong> 0388 875 102</p>
            </div>
          </section>

          {/* Section 2: Dữ liệu thu thập */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">2</span>
              Loại Dữ Liệu Cá Nhân Thu Thập
            </h2>
            <p>Chúng tôi chỉ thu thập các dữ liệu cá nhân cơ bản tối thiểu cần thiết để vận hành tài khoản dịch vụ của bạn:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Dữ liệu định danh tài khoản:</strong> Họ và tên, địa chỉ email, ảnh đại diện (nếu bạn đăng nhập qua Google OAuth), số điện thoại liên lạc (nếu có yêu cầu xuất hóa đơn hoặc hỗ trợ kỹ thuật).
              </li>
              <li>
                <strong>Dữ liệu giao dịch & thanh toán:</strong> Lịch sử đăng ký gói cước, mã giao dịch ngân hàng, thời hạn sử dụng. <em>(Lưu ý: Chúng tôi không bao giờ lưu trữ mật khẩu thẻ tín dụng hoặc số CVV của bạn trên hệ thống).</em>
              </li>
              <li>
                <strong>Dữ liệu kỹ thuật & nhật ký truy cập:</strong> Địa chỉ IP, loại trình duyệt, hệ điều hành, thời gian đăng nhập nhằm mục đích xác thực phiên làm việc, ngăn chặn gian lận và phòng chống tấn công mạng.
              </li>
            </ul>
          </section>

          {/* Section 3: Mục đích xử lý dữ liệu */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">3</span>
              Mục Đích Xử Lý Dữ Liệu
            </h2>
            <p>Dữ liệu cá nhân chỉ được sử dụng cho các mục đích hợp pháp sau:</p>
            <div className="grid gap-2 sm:grid-cols-2 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                ✓ Cung cấp, duy trì và nâng cao trải nghiệm tra cứu trên nền tảng Ads Spy Tool.
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                ✓ Kích hoạt và quản lý hạn mức gói cước thành viên (Free / Pro / Unlimited).
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                ✓ Tiếp nhận, hỗ trợ kỹ thuật và phản hồi thắc mắc, khiếu nại của khách hàng.
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                ✓ Ngăn ngừa các hành vi gian lận, botnet, crawl dữ liệu trái phép hoặc phá hoại hệ thống.
              </div>
            </div>
          </section>

          {/* Section 4: Quyền của Chủ thể dữ liệu theo NĐ 13/2023 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">4</span>
              Quyền của Chủ Thể Dữ Liệu (Quyền của Bạn)
            </h2>
            <p>Theo Điều 9 Nghị định 13/2023/NĐ-CP, bạn có đầy đủ các quyền sau đối với dữ liệu cá nhân của mình:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Quyền được biết:</strong> Được thông báo về hoạt động xử lý dữ liệu cá nhân của mình.</li>
              <li><strong>Quyền đồng ý hoặc rút lại sự đồng ý:</strong> Có quyền cho phép hoặc rút lại sự đồng ý bất cứ lúc nào.</li>
              <li><strong>Quyền truy cập và chỉnh sửa:</strong> Xem và cập nhật thông tin tài khoản qua trang cá nhân hoặc yêu cầu hỗ trợ.</li>
              <li><strong>Quyền xóa dữ liệu ("Quyền được quên"):</strong> Yêu cầu chúng tôi xóa vĩnh viễn tài khoản và dữ liệu cá nhân khi ngừng sử dụng.</li>
              <li><strong>Quyền khiếu nại, tố cáo và yêu cầu bồi thường:</strong> Theo đúng quy định của pháp luật nếu phát hiện hành vi xử lý dữ liệu sai mục đích.</li>
            </ul>
          </section>

          {/* Section 5: Biện pháp bảo mật & Thời gian lưu trữ */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">5</span>
              Biện Pháp Bảo Mật & Thời Gian Lưu Trữ
            </h2>
            <p>
              Chúng tôi áp dụng các tiêu chuẩn an toàn kỹ thuật hàng đầu bao gồm giao thức mã hóa đường truyền SSL/TLS 256-bit, hệ thống tường lửa (WAF), mã hóa cơ sở dữ liệu và cơ chế phân quyền truy cập nghiêm ngặt.
            </p>
            <p>
              Dữ liệu của bạn được lưu trữ an toàn trong suốt thời gian tài khoản của bạn đang hoạt động trên hệ thống hoặc cho đến khi bạn gửi yêu cầu xóa tài khoản hợp lệ tới ban quản trị.
            </p>
          </section>

          {/* Section 6: Cam kết không chia sẻ dữ liệu */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-mono">6</span>
              Cam Kết Không Mua Bán Dữ Liệu
            </h2>
            <p>
              Chúng tôi cam kết <strong>TUYỆT ĐỐI KHÔNG BÁN, CHO THUÊ HOẶC CHIA SẺ</strong> dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích tiếp thị hoặc quảng cáo độc lập mà không có sự đồng ý rõ ràng của bạn, trừ trường hợp cơ quan nhà nước có thẩm quyền tại Việt Nam yêu cầu cung cấp theo quy định của pháp luật.
            </p>
          </section>
        </div>

        {/* Data Protection Contact Box */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Bạn muốn thực thi quyền dữ liệu cá nhân (Xem/Sửa/Xóa)?</h4>
            <p className="mt-0.5">Gửi email yêu cầu đến: <strong className="text-slate-900">business.quickblack@gmail.com</strong> (Xử lý trong vòng 72 giờ làm việc)</p>
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-xl shrink-0 cursor-pointer">
            <Link href="/terms">Xem Điều khoản dịch vụ</Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

