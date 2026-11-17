import { Metadata } from "next";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { VideoTutorialsPlayer } from "@/components/tutorials/video-tutorials-player";
import { Sparkles, Trophy, Lightbulb, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Video Hướng Dẫn Tìm Hàng WIN & Tải Creative | Ads Spy Tool",
  description:
    "Xem video hướng dẫn chi tiết cách đánh giá sản phẩm chiến thắng (Winning Product), tải video Facebook Ads Library và triển khai mở rộng sang TikTok & YouTube Ads.",
};

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-14 md:py-20 text-white border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-4 py-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Thực Chiến Tìm Hàng WIN 2026</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Video Hướng Dẫn Sử Dụng & Săn Hàng WIN
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Xem trực tiếp các bài học video chất lượng cao để nắm vững quy trình thẩm định sản phẩm có lời, bóc tách creative gốc và vít ngân sách đa kênh.
            </p>
          </div>
        </section>

        {/* Video Player Section */}
        <section className="container py-12 md:py-16 mx-auto px-4 max-w-6xl -mt-6 relative z-20">
          <div className="rounded-[2.5rem] border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
            <VideoTutorialsPlayer showTitle={false} />
          </div>

          {/* Practical Tips Grid */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 font-black">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Lọc Theo Duplicates & Ngày Chạy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đừng chỉ nhìn vào lượt like. Hãy ưu tiên các mẫu ads có <strong>Duplicates &gt; 10</strong> và thời gian chạy kéo dài <strong>&gt; 14 ngày</strong> để đảm bảo sản phẩm đã được kiểm chứng chuyển đổi.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-black">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Remake Hook & Landing Page
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tải video gốc về để phân tích 3 giây đầu tiên (Hook 3s). Sau đó quay mới hoặc làm lại lời thoại bằng AI để tạo ra creative độc quyền với chi phí CPM rẻ hơn đối thủ.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-black">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Đón Đầu Trên TikTok & YouTube Ads
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Khi thấy sản phẩm đang bùng nổ trên Facebook Ads, hãy test ngay sang TikTok Ads và YouTube Ads để gom sạch khách hàng tiềm năng trên các kênh đối thủ chưa chạm tới.
              </p>
            </div>
          </div>

          {/* Quick Action Banner */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl font-black text-white">
                Đã sẵn sàng bắt đầu săn hàng WIN?
              </h3>
              <p className="text-xs text-slate-300">
                Áp dụng ngay các kỹ năng vừa học để tra cứu hàng ngàn chiến dịch quảng cáo thực tế.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm h-11 px-6 shadow-md cursor-pointer">
                <Link href="/facebook-ads-search">
                  <span>Tìm Facebook Ads Ngay</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl border-white/30 text-white hover:bg-white/10 font-bold text-sm h-11 px-5 cursor-pointer">
                <Link href="/winning-products">
                  <span>Xem Kho Winning Products</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

