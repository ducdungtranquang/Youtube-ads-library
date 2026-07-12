"use client";

import { useEffect, useState } from "react";

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
  fallbackText = "Ảnh hết hạn",
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
    return (
      <div
        className={fallbackClassName || containerClassName || "h-full w-full bg-muted flex items-center justify-center px-2 text-center text-[11px] text-muted-foreground"}
      >
        {hasError ? fallbackText : "No image"}
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
