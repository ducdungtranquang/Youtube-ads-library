import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Search,
  Heart,
  Video,
  Target,
  DollarSign,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Sparkles,
  Filter,
  Layers,
  FileCode2,
  ShieldCheck,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { HeroSlider } from "@/components/home/hero-slider";
import { LiveSpyDemo } from "@/components/home/live-spy-demo";
import { AboutUsSection } from "@/components/home/about-us-section";
import { FaqSection } from "@/components/home/faq-section";
import { FAQ_ITEMS } from "@/components/home/faq-data";
import { ContactForm } from "@/components/home/contact-form";
import { ScrollObserver } from "@/components/home/scroll-observer";

export default function HomePage() {
  // Schema.org nâng cao cho SEO & GEO: WebPage + AboutPage + FAQPage
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ads-spy-tool.tech/#webpage",
        "url": "https://ads-spy-tool.tech",
        "name": "Ads Spy Tool - Bóc Tách Ngân Sách, Lượt Reach & Spy Quảng Cáo YouTube, Facebook",
        "description": "Công cụ phân tích quảng cáo chuyên sâu: ước tính Ngân sách (Spend), Lượt tiếp cận (Reach), thời gian chạy và số nhóm nhân bản (Duplicates) cho YouTube Ads & Facebook Ads.",
        "inLanguage": "vi-VN",
        "publisher": {
          "@type": "Organization",
          "name": "CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK",
          "url": "https://ads-spy-tool.tech"
        }
      },
      {
        "@type": "AboutPage",
        "@id": "https://ads-spy-tool.tech/#about",
        "url": "https://ads-spy-tool.tech/#about-us-section",
        "name": "Về Ads Spy Tool & Đội ngũ QUICKBLACK DIGITAL",
        "description": "Sứ mệnh minh bạch hóa dữ liệu quảng cáo số, hỗ trợ Marketer Việt Nam và Quốc tế bóc tách dữ liệu đối thủ chính xác và tiết kiệm ngân sách thử nghiệm."
      },
      {
        "@type": "FAQPage",
        "@id": "https://ads-spy-tool.tech/#faq",
        "mainEntity": FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative">
      <Header />
      <HeroSlider />

      <main>
        {/* Khai báo Schema cho SEO & GEO (AI Search Engine Optimization) */}
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
                    <p className="text-xs text-slate-400 mt-0.5">Truy xuất dữ liệu Mỹ, EU, Châu Á</p>
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
                    <h2 className="font-extrabold text-white text-base tracking-wide group-hover:text-purple-300 transition-colors">YouTube Ads Intelligence</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Bóc tách video unlisted & kịch bản</p>
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
                    <h2 className="font-extrabold text-white text-base tracking-wide group-hover:text-blue-300 transition-colors">Facebook Ads Spy</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Xem Spend, Reach & Duplicates</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-slate-500 group-hover:translate-x-1.5 group-hover:text-blue-400 transition-all" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Live Interactive Spy Showcase Mockup */}
        <LiveSpyDemo />

        {/* Features Section - Sắc bén, chuẩn thuật ngữ Media Buyer */}
        <section className="container py-24 scroll-fade-section transition-all duration-700">
          <div className="mb-16 text-center">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold mb-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-block">
              Vũ Khí Chiến Lược Cho Performance Marketer
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-2">
              Bộ Công Cụ Bóc Tách Chỉ Số Ngầm Độc Quyền
            </h2>
            <p className="text-base text-slate-400 max-w-2xl mx-auto mt-4 leading-relaxed">
              Vượt qua sự che đậy của các thư viện quảng cáo truyền thống. Nhận dữ liệu phân tích chi phí, thời gian và sức mạnh ngân sách thực sự của mọi chiến dịch.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <BarChart3 className="h-6 w-6" />,
                color: "from-purple-500 to-indigo-600",
                borderColor: "hover:border-purple-500/50",
                shadowColor: "hover:shadow-purple-950/50",
                title: "Ước Tính Ngân Sách (Spend) & Reach",
                desc: "Thuật toán đối soát minh bạch dựa trên tiêu chuẩn EU DSA và mô hình hồi quy CPM theo 45+ ngành hàng, bóc tách chính xác số tiền đối thủ đã chi trả.",
                bullets: ["Ước tính chi tiêu USD/VND thực tế", "Quy đổi CPM theo Tier quốc gia", "Theo dõi biến động ngân sách theo ngày"]
              },
              {
                icon: <Target className="h-6 w-6" />,
                color: "from-emerald-500 to-teal-600",
                borderColor: "hover:border-emerald-500/50",
                shadowColor: "hover:shadow-emerald-950/50",
                title: "Phát Hiện Scaling Qua Duplicates",
                desc: "Tự động nhận diện cụm quảng cáo được nhân bản (10 - 50 nhóm). Khi media buyer duplicate nhiều nhóm kết hợp Duration dài, đó chắc chắn là một Winning Ad.",
                bullets: ["Bắt bài chiến dịch đang vít ngân sách", "Đo lường số ngày chạy liên tục", "Cập nhật trạng thái Active tức thì"]
              },
              {
                icon: <Video className="h-6 w-6" />,
                color: "from-red-500 to-rose-600",
                borderColor: "hover:border-red-500/50",
                shadowColor: "hover:shadow-red-950/50",
                title: "YouTube Ads Library & Video Ẩn",
                desc: "Khai quật hàng triệu video ads được đặt ở chế độ Unlisted (không công khai) trên YouTube, phân tích kịch bản hook 3 giây đầu và trích xuất landing page.",
                bullets: ["Xem video unlisted không cần kênh", "Tải video MP4 độ phân giải cao", "Phân tích cấu trúc Hook & Call to action"]
              },
              {
                icon: <Globe className="h-6 w-6" />,
                color: "from-blue-500 to-cyan-600",
                borderColor: "hover:border-blue-500/50",
                shadowColor: "hover:shadow-blue-950/50",
                title: "Bản Đồ Phân Phối Geo & CPM Quốc Tế",
                desc: "Xem tỷ trọng phân bổ quảng cáo theo từng quốc gia. Nắm rõ đối thủ đang tập trung ngân sách vào thị trường Mỹ (Tier 1), Châu Âu hay Đông Nam Á.",
                bullets: ["Phân bổ % hiển thị theo quốc gia", "Lọc theo Tier thị trường xuất khẩu", "Chuẩn hóa theo dữ liệu luật DSA"]
              },
              {
                icon: <DollarSign className="h-6 w-6" />,
                color: "from-amber-500 to-orange-600",
                borderColor: "hover:border-amber-500/50",
                shadowColor: "hover:shadow-amber-950/50",
                title: "Săn Winning Products Dropshipping",
                desc: "Lọc quảng cáo theo nền tảng e-commerce (Shopify, WooCommerce, ClickFunnels). Tìm ra các sản phẩm ngách đang viral để nhân bản cửa hàng ngay lập tức.",
                bullets: ["Phát hiện sản phẩm win có margin cao", "Nhận diện công nghệ store & pixel", "Lọc định dạng video reel/shorts"]
              },
              {
                icon: <FileCode2 className="h-6 w-6" />,
                color: "from-pink-500 to-rose-500",
                borderColor: "hover:border-pink-500/50",
                shadowColor: "hover:shadow-pink-950/50",
                title: "Trích Xuất Funnel & Link Đích",
                desc: "Bóc tách trọn vẹn đường dẫn trang đích (Landing Page), cấu trúc UTM tracking và chiến lược ưu đãi của đối thủ để tối ưu tỷ lệ chuyển đổi cho bạn.",
                bullets: ["Trích xuất URL landing page", "Xem mã giảm giá & ưu đãi đối thủ", "Lưu bộ sưu tập nghiên cứu cá nhân"]
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

        {/* 3-Step Practical Workflow */}
        <section className="container py-16 scroll-fade-section transition-all duration-700">
          <div className="rounded-[2.5rem] border border-slate-800 bg-slate-900/50 p-8 md:p-14 backdrop-blur-xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-block mb-3">
                Quy Trình 3 Bước Tinh Gọn
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Từ Nghiên Cứu Đối Thủ Đến Nhân Bản Chiến Dịch Triệu Đô
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 relative flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-white">Quét & Lọc Theo Ngách</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Nhập tên đối thủ, đường dẫn Fanpage, kênh YouTube, hoặc các từ khóa ngách. Áp dụng bộ lọc quốc gia (Geo), nền tảng store (Shopify) và thời gian chạy.
                  </p>
                </div>
                <Link href="/quicksearch" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 pt-2 group">
                  Mở công cụ QuickSearch <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 relative flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-lg shadow-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-white">Xem Dữ Liệu Ngầm & Scaling</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Bóc tách chi phí thực tế (Spend), số ngày chạy liên tục và số nhóm nhân bản (Duplicates). Xác định chính xác đâu là creative & offer đối thủ đang tập trung vít mạnh.
                  </p>
                </div>
                <Link href="/mkt" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 pt-2 group">
                  Xem dữ liệu trên YouTube Ads <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 relative flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg shadow-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-white">Tối Ưu & Clone Phễu Thắng</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Tải mẫu video MP4, học tập góc tiếp cận (Angle) của hook 3s đầu, tham khảo bố cục trang đích và triển khai chiến dịch với rủi ro thử nghiệm gần như bằng 0.
                  </p>
                </div>
                <Link href="/facebook-ads-search" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2 group">
                  Săn mẫu thắng trên Facebook Ads <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section VỀ CHÚNG TÔI (About Us & Sứ Mệnh QuickBlack Digital) */}
        <AboutUsSection />

        {/* Section FAQ (Hỏi đáp chuyên sâu - Chuẩn GEO & Knowledge Graph) */}
        <FaqSection />

        {/* Action Banner Section */}
        <section className="container py-12 scroll-fade-section transition-all duration-700">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 p-8 md:p-14 lg:p-16 text-white shadow-2xl border border-indigo-500/20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                Sẵn Sàng Khám Phá Winning Ads Tiếp Theo?
              </h2>
              <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
                Trải nghiệm ngay hôm nay để bóc tách toàn diện ngân sách chi tiêu, số ngày chạy và các mẫu ads đang được vít mạnh trên YouTube và Facebook.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="h-13 px-8 text-base font-bold bg-white text-slate-950 hover:bg-slate-100 shadow-xl shadow-white/10 hover:scale-105 transition-all cursor-pointer rounded-full">
                  <Link href="/mkt" title="Bóc tách YouTube Ads">
                    Bóc Tách YouTube Ads
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" className="h-13 px-8 text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all cursor-pointer rounded-full">
                  <Link href="/facebook-ads-search" title="Xem Facebook Ads">
                    Xem Facebook Ads
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-13 px-7 text-base font-semibold border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white cursor-pointer rounded-full">
                  <Link href="/pricing" title="Xem bảng giá dịch vụ">
                    Xem Bảng Giá
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container py-24 scroll-fade-section transition-all duration-700" id="contact-form-section">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold mb-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-block">Hỗ trợ doanh nghiệp & Agency</span>
                <h2 className="text-3xl font-black text-white tracking-tight mt-2 mb-4">Kết Nối Trực Tiếp Với Đội Ngũ Kỹ Thuật</h2>
                <p className="text-slate-300 leading-relaxed">
                  Chúng tôi luôn sẵn sàng hỗ trợ giải đáp thắc mắc, hướng dẫn bóc tách chỉ số Spend/Reach theo đặc thù ngành hàng của bạn và xây dựng lộ trình spy đối thủ quốc tế.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                {[
                  { title: "Phản hồi trong 24 giờ", desc: "Đội ngũ kỹ thuật hỗ trợ liên hệ và tư vấn chi tiết qua email hoặc Zalo." },
                  { title: "Demo 1 kèm 1 chuyên sâu", desc: "Trực tiếp thao tác bóc tách dữ liệu ngành hàng bạn đang chạy." },
                  { title: "Đồng hành lâu dài", desc: "Cập nhật các bản phân tích thuật toán CPM và báo cáo thị trường liên tục." },
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
                <CardDescription className="text-slate-400">Điền thông tin bên dưới để nhận lịch hẹn demo và dùng thử công cụ</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-12 bg-slate-950">
        <div className="container max-w-6xl mx-auto px-4 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div className="space-y-2">
              <div className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Ads Spy Tool</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Intelligence</span>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Nền tảng phân tích dữ liệu quảng cáo số, bóc tách ngân sách Spend, lượt Reach và phát hiện quảng cáo scaling cho Marketer & Doanh nghiệp.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <Link href="/quicksearch" className="hover:text-white transition-colors">Tìm kiếm nhanh</Link>
              <Link href="/mkt" className="hover:text-white transition-colors">YouTube Ads</Link>
              <Link href="/facebook-ads-search" className="hover:text-white transition-colors">Facebook Ads</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog Insights</Link>
              <Link href="#about-us-section" className="hover:text-white transition-colors">Về chúng tôi</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 Ads Spy Tool. Phát triển bởi CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK.</p>
            <p>Trụ sở: Hà Nội, Việt Nam • Dữ liệu chuẩn hóa EU DSA & Global CPM Models</p>
          </div>
        </div>
      </footer>

      {/* Observer chạy ở Client */}
      <ScrollObserver />
    </div>
  );
}