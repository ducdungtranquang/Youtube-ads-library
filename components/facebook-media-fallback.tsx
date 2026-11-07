"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Film } from "lucide-react";

interface FacebookMediaFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackText?: string;
  isVideo?: boolean;
  poster?: string | null;
  videoClassName?: string;
  containerClassName?: string;
}

export function FacebookMediaFallback({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackText = "Ảnh đang được cập nhật",
  isVideo = false,
  poster,
  videoClassName,
  containerClassName,
}: FacebookMediaFallbackProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    const isVideoType = isVideo || (Boolean(fallbackText) && fallbackText.toLowerCase().includes("video"));
    const displayText = hasError
      ? fallbackText
      : isVideoType
        ? "Video trên FB Ads Library"
        : "Đang cập nhật ảnh xem trước";
    const tooltipText = isVideoType
      ? "Video quảng cáo cần mở xem trực tiếp trên Facebook Ads Library"
      : "Ảnh quảng cáo đang được cập nhật hoặc cần xem trên Facebook Ads Library";

    return (
      <div
        className={
          fallbackClassName ||
          containerClassName ||
          "h-full w-full bg-slate-900 flex flex-col items-center justify-center p-3 text-center text-xs text-slate-400 gap-2 border border-slate-800/80 select-none"
        }
        title={tooltipText}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800/90 border border-slate-700/60 text-slate-400 shadow-inner shrink-0">
          {isVideoType ? (
            <Film className="h-4.5 w-4.5 text-indigo-400" />
          ) : (
            <ImageIcon className="h-4.5 w-4.5 text-slate-400" />
          )}
        </div>
        <div className="flex flex-col items-center gap-0.5 max-w-[90%]">
          <span className="text-[11px] font-semibold text-slate-300 leading-tight line-clamp-1">
            {displayText}
          </span>
          <span className="text-[9px] text-slate-500 font-medium leading-tight">
            {isVideoType ? "Bấm để xem chi tiết →" : "Facebook Ads Library"}
          </span>
        </div>
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={src}
        poster={poster || undefined}
        controls
        className={videoClassName || className}
        onError={() => setHasError(true)}
      />
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />;
}
