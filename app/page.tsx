import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Search, Heart, Video, Target, DollarSign, BarChart3, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { HeroSlider } from "@/components/home/hero-slider";
import { ContactForm } from "@/components/home/contact-form";
import { ScrollObserver } from "@/components/home/scroll-observer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative">
      <Header />

      <HeroSlider />

      <main>
        {/* Quick Access Floating Cards */}
        <section className="container py-8 -mt-12 relative z-30 scroll-fade-section transition-all duration-700">
          <div className="grid gap-5 md:grid-cols-3">
            <Link href="/quicksearch" className="group">
              <Card className="h-full border border-indigo-500/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-950/50 hover:border-indigo-400 hover:bg-slate-900/95 hover:-translate-y-2 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Search className="h-6 w-6 text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-white text-base tracking-wide group-hover:text-indigo-300 transition-colors">Tìm kiếm nhanh</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Truy xuất ads toàn diện</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-slate-500 group-hover:translate-x-1.5 group-hover:text-indigo-400 transition-all" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/mkt" className="group">
              <Card className="h-full border border-purple-500/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-purple-950/50 hover:border-purple-400 hover:bg-slate-900/95 hover:-translate-y-2 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <TrendingUp className="h-6 w-6 text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-white text-base tracking-wide group-hover:text-purple-300 transition-colors">YouTube Ads</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Phân tích video đối thủ</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-slate-500 group-hover:translate-x-1.5 group-hover:text-purple-400 transition-all" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/facebook-ads-search" className="group">
              <Card className="h-full border border-blue-500/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-blue-950/50 hover:border-blue-400 hover:bg-slate-900/95 hover:-translate-y-2 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <DollarSign className="h-6 w-6 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-white text-base tracking-wide group-hover:text-blue-300 transition-colors">Facebook Ads</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Săn sản phẩm Winner</p>
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
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold mb-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-block">Tính năng chuyên sâu chuẩn SEO</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-2">Công Cụ Spy Đỉnh Cao Cho Marketers</h2>
            <p className="text-base text-slate-400 max-w-2xl mx-auto mt-4 leading-relaxed">
              Tối ưu hóa quy trình nghiên cứu thị trường, bóc tách chiến dịch quảng cáo hiệu quả cao với công nghệ hiện đại.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Search className="h-6 w-6" />,
                color: "from-blue-500 to-indigo-600",
                borderColor: "hover:border-blue-500/50",
                shadowColor: "hover:shadow-blue-950/50",
                title: "Tìm kiếm thông minh",
                desc: "Truy vấn chuẩn xác theo từ khóa, URL landing page hoặc thương hiệu với hệ thống cơ sở dữ liệu khổng lồ.",
                bullets: ["Tìm theo từ khóa & URL", "Lọc theo quốc gia, thời gian", "Kết quả tìm kiếm real-time"]
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                color: "from-purple-500 to-indigo-600",
                borderColor: "hover:border-purple-500/50",
                shadowColor: "hover:shadow-purple-950/50",
                title: "Phân tích chỉ số sâu",
                desc: "Nắm bắt toàn diện các thông số chi tiêu ước tính, thời gian scale và mức độ hiệu quả của chiến dịch.",
                bullets: ["Ước tính ngân sách chi tiêu", "Theo dõi lịch sử chạy ads", "So sánh thông số đối thủ"]
              },
              {
                icon: <Target className="h-6 w-6" />,
                color: "from-emerald-500 to-teal-600",
                borderColor: "hover:border-emerald-500/50",
                shadowColor: "hover:shadow-emerald-950/50",
                title: "Spy Đối Thủ Cạnh Tranh",
                desc: "Theo dõi sát sao mọi hoạt động marketing của đối thủ trong ngành, phát hiện xu hướng sản phẩm sớm nhất.",
                bullets: ["Theo dõi brand trực tiếp", "Bắt trend thị trường sớm", "Lưu vết lịch sử quảng cáo"]
              },
              {
                icon: <Video className="h-6 w-6" />,
                color: "from-red-500 to-rose-600",
                borderColor: "hover:border-red-500/50",
                shadowColor: "hover:shadow-red-950/50",
                title: "YouTube Ads Library",
                desc: "Kho lưu trữ hơn 10 triệu video quảng cáo YouTube, hỗ trợ xem trực tiếp và phân tích creator.",
                bullets: ["Hơn 10M+ video quảng cáo", "Trình phát video trực quan", "Trích xuất landing page dễ dàng"]
              },
              {
                icon: <DollarSign className="h-6 w-6" />,
                color: "from-blue-600 to-cyan-600",
                borderColor: "hover:border-cyan-500/50",
                shadowColor: "hover:shadow-cyan-950/50",
                title: "Facebook Ads Central",
                desc: "Lọc quảng cáo theo nền tảng e-commerce, định dạng bài viết và phân loại mức độ tăng trưởng (Winner/Good).",
                bullets: ["Định dạng Image, Video, Carousel", "Tích hợp Shopify, WooCommerce", "Chấm điểm Winner Ads"]
              },
              {
                icon: <Heart className="h-6 w-6" />,
                color: "from-orange-500 to-amber-600",
                borderColor: "hover:border-orange-500/50",
                shadowColor: "hover:shadow-orange-950/50",
                title: "Lưu Trữ & Theo Dõi",
                desc: "Quản lý danh sách quảng cáo yêu thích, phân loại theo bộ sưu tập cá nhân và xuất báo cáo tiện lợi.",
                bullets: ["Bookmark quảng cáo nhanh", "Tạo bộ sưu tập tùy biến", "Xuất file báo cáo chi tiết"]
              },
            ].map((feat, idx) => (
              <Card key={idx} className={`group relative border border-slate-800 bg-slate-900/70 backdrop-blur-xl ${feat.borderColor} hover:shadow-2xl ${feat.shadowColor} hover:-translate-y-2 transition-all duration-500 rounded-3xl overflow-hidden p-2`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                <CardHeader className="pb-3 pt-6 px-6">
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {feat.icon}
                  </div>
                  <CardTitle className="text-2xl font-black text-white tracking-wide">{feat.title}</CardTitle>
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
                Sẵn sàng tìm kiếm Winning Ads?
              </h2>
              <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
                Đăng ký ngay để nhận tư vấn trực tiếp và trải nghiệm hệ thống phân tích quảng cáo chuyên nghiệp nhất.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-base font-bold bg-white text-slate-950 hover:bg-slate-100 shadow-xl shadow-white/10 hover:scale-105 transition-all cursor-pointer rounded-full">
                  <Link href="#contact-form-section">
                    Nhận tư vấn miễn phí
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Link href="/quicksearch">
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
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold mb-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-block">Hỗ trợ nhanh chóng</span>
                <h2 className="text-3xl font-black text-white tracking-tight mt-2 mb-4">Kết Nối Với Đội Ngũ Chuyên Gia</h2>
                <p className="text-slate-300 leading-relaxed">
                  Chúng tôi luôn sẵn sàng hỗ trợ giải đáp thắc mắc, hướng dẫn sử dụng tính năng và xây dựng chiến lược spy phù hợp nhất cho doanh nghiệp của bạn.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                {[
                  { title: "Phản hồi siêu tốc", desc: "Đội ngũ chăm sóc khách hàng liên hệ lại trong vòng 24 giờ." },
                  { title: "Demo 1 kèm 1", desc: "Trực tiếp thao tác và hướng dẫn chi tiết theo đúng nhu cầu ngành hàng." },
                  { title: "Đồng hành lâu dài", desc: "Hỗ trợ kỹ thuật và cập nhật xu hướng marketing liên tục mỗi tuần." },
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
                <CardDescription className="text-slate-400">Điền thông tin bên dưới để nhận lịch hẹn hỗ trợ sớm nhất</CardDescription>
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
          <p>© 2026 Ads Spy Tool. Được xây dựng chuyên nghiệp dành cho marketers và affiliate marketers.</p>
        </div>
      </footer>

      {/* Chèn Observer chạy ở Client để kích hoạt hiệu ứng */}
      <ScrollObserver />
    </div>
  );
}