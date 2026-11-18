"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MonitorPlay,
  Film,
  Download,
  Share2,
  ExternalLink,
  Flame,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TUTORIAL_VIDEOS, VideoTutorial } from "./tutorial-data";

interface VideoTutorialsPlayerProps {
  initialVideoId?: string;
  className?: string;
  showTitle?: boolean;
}

export function VideoTutorialsPlayer({
  initialVideoId,
  className = "",
  showTitle = true,
}: VideoTutorialsPlayerProps) {
  const [selectedId, setSelectedId] = useState<string>(
    initialVideoId || TUTORIAL_VIDEOS[0].id
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeVideo =
    TUTORIAL_VIDEOS.find((v) => v.id === selectedId) || TUTORIAL_VIDEOS[0];

  const handleSelectVideo = (id: string) => {
    setSelectedId(id);
    setIsPlaying(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-2xs">
              <MonitorPlay className="h-3.5 w-3.5" />
              <span>Khóa học thực chiến miễn phí</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Hướng Dẫn Tìm Hàng WIN & Tải Creative
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-1 max-w-2xl">
              Học cách đọc dữ liệu ngầm, trích xuất video quảng cáo và nhân bản phễu chuyển đổi từ các chuyên gia Media Buyer.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Xem trực tiếp tại web • 3 bài học tinh gọn</span>
          </div>
        </div>
      )}

      {/* Main Grid: Player on the left (2 cols on lg) + Playlist on the right (1 col on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Video Player Column */}
        <div className="lg:col-span-8 space-y-5">
          {/* Video Container (16:9 Aspect Ratio) */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="relative w-full h-full cursor-pointer overflow-hidden group/thumb"
              >
                {/* Video High-Quality Thumbnail */}
                <Image
                  src={`https://i.ytimg.com/vi/${activeVideo.youtubeId}/hqdefault.jpg`}
                  alt={activeVideo.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/thumb:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Big Floating Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-20 w-20 rounded-full bg-indigo-500/30 animate-ping pointer-events-none" />
                    <button
                      type="button"
                      aria-label="Phát video"
                      className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-600/50 hover:scale-110 active:scale-95 transition-all cursor-pointer group-hover/thumb:brightness-110"
                    >
                      <Play className="h-7 w-7 sm:h-9 sm:w-9 ml-1 fill-white" />
                    </button>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-600/90 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider">
                    {activeVideo.badge}
                  </div>
                  <h3 className="text-base sm:text-xl font-black line-clamp-2 drop-shadow-md">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs text-slate-300 hidden sm:block">
                    Bấm để phát video trực tiếp không cần rời trang
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Active Video Overview & Key Takeaways */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="space-y-1.5 flex-1 min-w-[260px]">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${activeVideo.badgeColor}`}
                  >
                    {activeVideo.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {activeVideo.author}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {activeVideo.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {activeVideo.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  asChild
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer h-10 px-4"
                >
                  <Link href={activeVideo.actionHref}>
                    <span>{activeVideo.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Video Description */}
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {activeVideo.description}
            </p>

            {/* Key Takeaways Section */}
            <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Kiến Thức Trọng Tâm Cần Nhớ:</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                {activeVideo.keyTakeaways.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Playlist Column (Right Side) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Danh sách {TUTORIAL_VIDEOS.length} bài học
            </span>
            <span className="text-[11px] font-semibold text-indigo-600">
              {TUTORIAL_VIDEOS.findIndex((v) => v.id === selectedId) + 1}/{TUTORIAL_VIDEOS.length}
            </span>
          </div>

          <div className="space-y-3">
            {TUTORIAL_VIDEOS.map((video, idx) => {
              const isCurrent = video.id === selectedId;
              return (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video.id)}
                  className={`group relative rounded-2xl border p-3.5 transition-all cursor-pointer flex gap-3.5 items-start ${
                    isCurrent
                      ? "bg-indigo-50/80 border-indigo-400 shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm hover:bg-slate-50/50"
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative h-20 w-32 rounded-xl overflow-hidden shrink-0 bg-slate-900 shadow-xs">
                    <Image
                      src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${
                          isCurrent
                            ? "bg-indigo-600 text-white scale-110"
                            : "bg-slate-950/70 text-white group-hover:bg-indigo-600 group-hover:scale-110"
                        } transition-all shadow-sm`}
                      >
                        <Play className="h-3.5 w-3.5 ml-0.5 fill-current" />
                      </div>
                    </div>

                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
                      Bài {video.step}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full border ${video.badgeColor}`}
                      >
                        Bài {video.step}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-700 bg-indigo-100/80 px-1.5 py-0.2 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                          Đang xem
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-xs sm:text-sm font-bold line-clamp-2 leading-snug ${
                        isCurrent
                          ? "text-indigo-950 font-black"
                          : "text-slate-800 group-hover:text-indigo-600"
                      }`}
                    >
                      {video.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {video.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Helper Banner Card */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 p-4 text-white space-y-2 mt-4 shadow-md border border-indigo-800/40">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Flame className="h-4 w-4 fill-amber-300" />
              <span>Bí quyết cho người mới:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Hãy xem xong <strong>Bài 1</strong> trước để nắm vững các chỉ số Duplicates, Duration, sau đó thực hành tìm kiếm trực tiếp trên Facebook Ads Search để đạt hiệu quả cao nhất!
            </p>
            <div className="pt-1">
              <Button
                asChild
                variant="outline"
                className="w-full h-8 text-[11px] font-bold border-indigo-400/40 bg-indigo-950/60 text-indigo-200 hover:bg-indigo-600 hover:text-white cursor-pointer rounded-lg"
              >
                <Link href="/facebook-ads-search">
                  <span>Mở Trình Tìm Kiếm Ads</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

