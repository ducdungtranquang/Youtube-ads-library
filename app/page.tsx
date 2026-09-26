import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Search, Heart, Video, Target, DollarSign, BarChart3, CheckCircle, ArrowRight, Zap, Globe } from "lucide-react";
import { HeroSlider } from "@/components/home/hero-slider";
import { ContactForm } from "@/components/home/contact-form";
import { ScrollObserver } from "@/components/home/scroll-observer";

export default function HomePage() {
  // Page-level Structured Data giúp Google hiểu chi tiết các tính năng của trang chủ
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Ads Spy Tool - Phân Tích Spend & Reach Quảng Cáo",
    "description": "Công cụ phân tích quảng cáo chuyên sâu: ước tính Ngân sách (Spend), Lượt tiếp cận (Reach), thời gian chạy và nhân nhóm theo từng quốc gia.",
    "publisher": {
      "@type": "Organization",
      "name": "QUICKBLACK DIGITAL TECHNOLOGY"
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative">
      <Header />
      <HeroSlider />

      <main>
        {/* Khai báo Schema cho SEO SSR */}
        <Script
          id="homepage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
        />

        {/* Quick Access Floating Cards */}
        <section className="container py-8 -mt-12 relative z-30 scroll-fade-section transition-all duration-700">
          <div className="grid gap-5 md:grid-cols-3">
            <Link href="/quicksearch" className="group" title="Tìm kiếm nhanh quảng cáo" aria-label="Truy cập công cụ tìm kiếm nhanh">
              <Card className="h-full border border-indigo-500/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-950/50 hover:border-indigo-400 hover:bg-slate-900/95 hover:-translate-y-2 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Search className="h-6 w-6 text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-white text-base tracking-wide group-hover:text-indigo-300 transition-colors">Tìm kiếm đa quốc gia</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Truy xuất dữ liệu Mỹ, EU, Á</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-slate-500 group-hover:translate-x-1.5 group-hover:text-indigo-400 transition-all" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/mkt" className="group" title="Phân tích YouTube Ads" aria-label="Truy cập công cụ phân tích YouTube Ads">
              <Card className="h-full border border-purple-500/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-purple-950/50 hover:border-purple-400 hover:bg-slate-900/95 hover:-translate-y-2 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <TrendingUp className="h-6 w-6 text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-white text-base tracking-wide group-hover:text-purple-300 transition-colors">YouTube Ads</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Bóc tách chiến dịch Video</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-slate-500 group-hover:translate-x-1.5 group-hover:text-purple-400 transition-all" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/facebook-ads-search" className="group" title="Săn Winning Ads Facebook" aria-label="Truy cập công cụ Facebook Ads">
              <Card className="h-full border border-blue-500/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-blue-950/50 hover:border-blue-400 hover:bg-slate-900/95 hover:-translate-y-2 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <DollarSign className="h-6 w-6 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-white text-base tracking-wide group-hover:text-blue-300 transition-colors">Facebook Ads</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Phân tích Reach & Spend</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-slate-500 group-hover:translate-x-1.5 group-hover:text-blue-400 transition-all" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-24 scroll-fade-section transition-all duration-700">
          <div className="mb-16 text-center">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold mb-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-block">
              Giải Pháp Ads Intelligence Chuyên Sâu
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-2">Công Cụ Spy Bóc Tách Chỉ Số Thực Tế</h2>
            <p className="text-base text-slate-400 max-w-2xl mx-auto mt-4 leading-relaxed">
              Vượt qua các giới hạn hiển thị cơ bản. Công nghệ của chúng tôi giúp bạn tính toán chính xác mức độ hiệu quả của mọi chiến dịch toàn cầu.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <BarChart3 className="h-6 w-6" />,
                color: "from-purple-500 to-indigo-600",
                borderColor: "hover:border-purple-500/50",
                shadowColor: "hover:shadow-purple-950/50",
                title: "Phân tích Spend & Reach",
                desc: "Thuật toán bóc tách ngân sách chi tiêu (Spend) và số lượt tiếp cận (Reach) chuẩn xác dựa trên dữ liệu minh bạch.",
                bullets: ["Ước tính ngân sách thực tế", "Quy đổi CPM theo quốc gia", "Xử lý ca chạy lâu ngân sách nhỏ"]
              },
              {
                icon: <Target className="h-6 w-6" />,
                color: "from-emerald-500 to-teal-600",
                borderColor: "hover:border-emerald-500/50",
                shadowColor: "hover:shadow-emerald-950/50",
                title: "Theo Dõi Scaling (Duration & Duplicates)",
                desc: "Đo lường thời gian chạy (Duration) và số lượng nhân nhóm (Duplicates) để phát hiện sớm các chiến dịch đang được vít mạnh.",
                bullets: ["Phát hiện Ads được Scale", "Theo dõi số ngày chạy (Duration)", "Cập nhật trạng thái Active/Inactive"]
              },
              {
                icon: <Globe className="h-6 w-6" />,
                color: "from-blue-500 to-cyan-600",
                borderColor: "hover:border-blue-500/50",
                shadowColor: "hover:shadow-blue-950/50",
                title: "GEO & Thị Trường Toàn Cầu",
                desc: "Phân tích quảng cáo theo từng khu vực (Countries). Thuật toán áp dụng chuẩn hệ số ngành hàng và CPM riêng cho Mỹ, Châu Âu, Châu Á.",
                bullets: ["Phân tích theo Quốc gia (Geo)", "Dữ liệu chuẩn theo luật EU DSA", "Lọc theo Tier thị trường"]
              },
              {
                icon: <Video className="h-6 w-6" />,
                color: "from-red-500 to-rose-600",
                borderColor: "hover:border-red-500/50",
                shadowColor: "hover:shadow-red-950/50",
                title: "YouTube Ads Library",
                desc: "Kho lưu trữ hàng triệu video quảng cáo YouTube, hỗ trợ xem trực tiếp, phân tích kịch bản và trích xuất landing page.",
                bullets: ["Phát video trực quan", "Trích xuất link đích (URL)", "Nghiên cứu đối thủ ngách"]
              },
              {
                icon: <DollarSign className="h-6 w-6" />,
                color: "from-amber-500 to-orange-600",
                borderColor: "hover:border-amber-500/50",
                shadowColor: "hover:shadow-amber-950/50",
                title: "Khám Phá E-commerce Winner",
                desc: "Tìm kiếm các sản phẩm Dropshipping/Affiliate tiềm năng. Lọc nhanh qua các nền tảng như Shopify hay WooCommerce.",
                bullets: ["Phát hiện Winning Products", "Tìm kiếm theo từ khóa ngách", "Lọc định dạng Image/Video"]
              },
              {
                icon: <Heart className="h-6 w-6" />,
                color: "from-pink-500 to-rose-500",
                borderColor: "hover:border-pink-500/50",
                shadowColor: "hover:shadow-pink-950/50",
                title: "Lưu Trữ & Theo Dõi Cá Nhân",
                desc: "Tạo các bộ sưu tập quảng cáo (Collections) cá nhân hóa. Đánh dấu theo dõi sự thay đổi của đối thủ qua từng ngày.",
                bullets: ["Bookmark nhanh chóng", "Phân loại Ads theo nhóm", "Lưu vết dữ liệu lịch sử"]
              },
            ].map((feat, idx) => (
              <Card key={idx} className={`group relative border border-slate-800 bg-slate-900/70 backdrop-blur-xl ${feat.borderColor} hover:shadow-2xl ${feat.shadowColor} hover:-translate-y-2 transition-all duration-500 rounded-3xl overflow-hidden p-2`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                <CardHeader className="pb-3 pt-6 px-6">
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {feat.icon}
                  </div>
                  <CardTitle className="text-xl font-black text-white tracking-wide">{feat.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    {feat.desc}
                  </p>
                  <ul className="space-y-3 text-sm border-t border-slate-800/80 pt-5">
                    {feat.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-3 text-slate-300 font-medium">
                        <CheckCircle className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Action Banner Section */}
        <section className="container py-12 scroll-fade-section transition-all duration-700">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 p-8 md:p-14 lg:p-16 text-white shadow-2xl border border-indigo-500/20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                Sẵn sàng khám phá Winning Ads?
              </h2>
              <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
                Đăng ký ngay để trải nghiệm hệ thống phân tích Ngân sách, Lượt tiếp cận và xu hướng Scale chiến dịch toàn cầu.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-base font-bold bg-white text-slate-950 hover:bg-slate-100 shadow-xl shadow-white/10 hover:scale-105 transition-all cursor-pointer rounded-full">
                  <Link href="#contact-form-section" title="Nhận tư vấn miễn phí Ads Spy">
                    Nhận tư vấn miễn phí
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Link href="/quicksearch" title="Trải nghiệm thử công cụ phân tích quảng cáo">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white cursor-pointer rounded-full">
                    Trải nghiệm ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container py-24 scroll-fade-section transition-all duration-700" id="contact-form-section">
          {/* ... (Giữ nguyên Contact Form như code gốc của bạn) ... */}
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold mb-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-block">Hỗ trợ doanh nghiệp</span>
                <h2 className="text-3xl font-black text-white tracking-tight mt-2 mb-4">Kết Nối Với Chuyên Gia Phân Tích</h2>
                <p className="text-slate-300 leading-relaxed">
                  Chúng tôi luôn sẵn sàng hỗ trợ giải đáp thắc mắc, hướng dẫn sử dụng tính toán Spread/Reach và xây dựng chiến lược spy quốc tế (Geo) phù hợp.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                {[
                  { title: "Phản hồi siêu tốc", desc: "Đội ngũ kỹ thuật hỗ trợ liên hệ lại trong vòng 24 giờ." },
                  { title: "Demo 1 kèm 1", desc: "Trực tiếp thao tác bóc tách insight theo ngành hàng." },
                  { title: "Đồng hành lâu dài", desc: "Cập nhật dữ liệu minh bạch và xu hướng CPM liên tục." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5 border border-indigo-500/30">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{item.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="shadow-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl rounded-3xl p-2">
              <CardHeader className="pb-4 pt-6 px-6">
                <CardTitle className="text-2xl font-black text-white">Đăng ký tư vấn trực tiếp</CardTitle>
                <CardDescription className="text-slate-400">Điền thông tin bên dưới để nhận lịch hẹn demo tính năng</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-8 bg-slate-950">
        <div className="container text-center text-sm text-slate-500">
          <p>© 2026 Ads Spy Tool bởi QUICKBLACK DIGITAL TECHNOLOGY. Nền tảng phân tích dữ liệu quảng cáo chuyên nghiệp.</p>
        </div>
      </footer>

      {/* Observer chạy ở Client */}
      <ScrollObserver />
    </div>
  );
}