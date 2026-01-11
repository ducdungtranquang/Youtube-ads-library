"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Video } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Header } from "@/components/header";
import { VideoCard } from "@/components/video-card";
import { VideoDetailModal } from "@/components/video-detail-modal";

interface Video {
  ytVideoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  totalSpend: string;
  channel?: string;
  ctr?: string;
  description?: string;
  duration?: string;
  companyName?: string;
}

export default function BrandVideosPage({ params }: { params: { brandId: string } } | { params: Promise<{ brandId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<'youtube' | 'shorts'>('youtube');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const limit = 10;

  // Unwrap params if it's a Promise (Next.js 14+)
  let brandId: string = "";
  if (typeof (params as any).then === "function") {
    // @ts-ignore
    brandId = React.use(params).brandId;
  } else {
    // @ts-ignore
    brandId = (params as any).brandId;
  }

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      try {
        const apiPath = filter === 'shorts'
          ? `/api/brands/${brandId}/shorts?page=${page}&limit=${limit}`
          : `/api/brands/${brandId}/videos?page=${page}&limit=${limit}`;
        const res = await fetch(apiPath);
        const data = await res.json();
        setVideos(data.data?.results || []);
        setHasMore(data.data?.hasMore || false);
      } catch (e) {
        setVideos([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [brandId, page, filter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.replace(`?page=${newPage}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-12 md:py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white">
              <Sparkles className="h-4 w-4" />
              Chi tiết thương hiệu
            </div>
            <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl">
              Video của Brand #{brandId}
            </h1>
            <p className="text-base text-white/80 max-w-xl mx-auto">
              Xem tất cả video quảng cáo của thương hiệu này
            </p>
          </div>
        </div>
      </section>

      <main className="container py-8 -mt-6 relative z-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <Video className="h-5 w-5" />
            </div>
            <span className="font-semibold text-foreground">Danh sách video</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-medium">Loại video:</span>
            <Select value={filter} onValueChange={(value: string) => { setFilter(value as 'youtube' | 'shorts'); setPage(1); }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">Youtube</SelectItem>
                <SelectItem value="shorts">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Card className="mb-8 border-2">
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin w-8 h-8" />
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Không có video nào</div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => {
                  // Map API fields to VideoFavoriteData fields with fallbacks
                  const channel = video.channel || "Unknown Channel";
                  const views = video.totalSpend || "0";
                  const ctr = video.ctr || "0%";
                  const date = video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : "-";
                  return (
                    <VideoCard
                      key={video.ytVideoId}
                      title={video.title}
                      channel={channel}
                      views={views}
                      ctr={ctr}
                      date={date}
                      thumbnail={video.thumbnail}
                      url={`https://youtube.com/watch?v=${video.ytVideoId}`}
                      ytVideoId={video.ytVideoId}
                      description={video.description}
                      duration={video.duration}
                      companyName={video.companyName}
                      onClick={() => setSelectedVideo(video)}
                    />
                  );
                })}
              </div>
            )}
            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-8">
              <Button disabled={page <= 1 || loading} onClick={() => handlePageChange(page - 1)} className="cursor-pointer">
                Trang trước
              </Button>
              <span className="px-4 py-2">Trang {page}</span>
              <Button disabled={!hasMore || loading} onClick={() => handlePageChange(page + 1)} className="cursor-pointer">
                Trang sau
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Video Detail Modal */}
        <VideoDetailModal
          open={!!selectedVideo}
          onOpenChange={(open) => !open && setSelectedVideo(null)}
          video={{
            title: selectedVideo?.title || "",
            channel: selectedVideo?.channel || "",
            views: "0",
            ctr: selectedVideo?.ctr || "0%",
            date: selectedVideo?.publishedAt || "",
            thumbnail: selectedVideo?.thumbnail || "",
            url: selectedVideo ? `https://youtube.com/watch?v=${selectedVideo.ytVideoId}` : "",
            companyName: selectedVideo?.companyName || "",
            description: selectedVideo?.description || "",
            duration: selectedVideo?.duration || "",
            ytVideoId: selectedVideo?.ytVideoId || ""
          }}
          onClose={() => setSelectedVideo(null)}
        />
      </main>

      <footer className="border-t border-border/40 py-8 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Ads Spy Tool. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  );
}
