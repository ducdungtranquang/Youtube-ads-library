import Link from "next/link";
import { 
  Building2, 
  Target, 
  Lightbulb, 
  ShieldCheck, 
  Users, 
  Cpu, 
  BarChart, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutUsSection() {
  return (
    <section className="container py-24 scroll-fade-section transition-all duration-700 relative" id="about-us-section">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            Về Chúng Tôi & Đội Ngũ Phát Triển
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Minh Bạch Hóa Dữ Liệu Quảng Cáo Cho Marketers Việt & Toàn Cầu
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Ads Spy Tool được phát triển bởi đội ngũ kỹ sư dữ liệu lớn và chuyên gia Performance Marketing tại <strong className="text-white font-semibold">QUICKBLACK DIGITAL TECHNOLOGY</strong> với sứ mệnh giúp bạn ngừng lãng phí ngân sách vào những thử nghiệm mù quáng.
          </p>
        </div>

        {/* Story & Problem Solving Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Card Story */}
          <div className="p-8 md:p-10 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-5">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Tại Sao Ads Spy Tool Ra Đời?
              </h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Chúng tôi từng là những Media Buyer đốt hàng trăm triệu mỗi tháng để test creative và sản phẩm mới. Mỗi lần vào Facebook Ad Library, chúng tôi chỉ thấy được bề nổi: vài chục mẫu quảng cáo nhưng <strong className="text-indigo-300 font-semibold">không hề biết đối thủ đã chi bao nhiêu tiền</strong>, mẫu nào đang sinh lời và mẫu nào đã dừng chạy từ lâu. Còn trên YouTube, hoàn toàn không có một công cụ chính thức nào để tìm kiếm các video quảng cáo ẩn (Unlisted).
              </p>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Chính nỗi đau đó đã thúc đẩy đội ngũ QuickBlack xây dựng nên <strong className="text-white font-semibold">Ads Spy Tool</strong>: một nền tảng bóc tách số liệu ngầm, đưa các chỉ số minh bạch như Ngân sách (Spend), Lượt hiển thị (Reach), Số nhóm nhân bản (Duplicates) ra ánh sáng.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                <ShieldCheck className="h-4 w-4" /> Chuẩn hóa dữ liệu EU DSA
              </span>
              <span>•</span>
              <span>Không phỏng đoán cảm tính</span>
            </div>
          </div>

          {/* Card Pillars */}
          <div className="p-8 md:p-10 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-900/90 backdrop-blur-xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                3 Trụ Cột Năng Lực Cốt Lõi
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Thuật Toán Bóc Tách Spend Dựa Trên Big Data</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Kết hợp dữ liệu minh bạch của Đạo luật Dịch vụ Kỹ thuật số EU (DSA), hệ số CPM theo 45+ ngành hàng và mô hình hồi quy phân tích phân bổ ngân sách chuẩn xác đến 98%.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Phát Hiện Winning Ads & Scaling Signal</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Theo dõi số ngày chạy liên tục (Duration) và số lượng cụm nhân nhóm (Duplicates) để phát hiện sớm các chiến dịch đang được các đối thủ lớn vít mạnh ngân sách.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Tối Ưu Cả Thị Trường Việt Nam & Quốc Tế</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Phục vụ đa dạng mô hình kinh doanh: từ Local Brand, Doanh nghiệp SME Việt Nam đến Marketers chạy Dropshipping, POD, Affiliate thị trường US, UK, EU, Đông Nam Á.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Đơn vị chủ quản:</span>
              <span className="text-xs font-bold text-white">QUICKBLACK DIGITAL TECHNOLOGY CO., LTD</span>
            </div>
          </div>
        </div>

        {/* Company Fact & Trust Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-3xl font-black text-indigo-400 mb-1">12.5M+</div>
            <div className="text-xs font-medium text-slate-300">Quảng cáo trong cơ sở dữ liệu</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-3xl font-black text-cyan-400 mb-1">30+</div>
            <div className="text-xs font-medium text-slate-300">Quốc gia được phân bổ dữ liệu</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-3xl font-black text-purple-400 mb-1">8,500+</div>
            <div className="text-xs font-medium text-slate-300">Marketers & Media Buyers</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-3xl font-black text-emerald-400 mb-1">99.9%</div>
            <div className="text-xs font-medium text-slate-300">Hệ thống giám sát Uptime 24/7</div>
          </div>
        </div>
      </div>
    </section>
  );
}
