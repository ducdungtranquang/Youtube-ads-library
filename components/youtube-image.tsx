"use client"

import { useState } from 'react'
import Image from 'next/image'

interface YouTubeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallback?: string
}

export function YouTubeImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "",
  fallback = "/placeholder.svg"
}: YouTubeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if it's a YouTube image URL that needs proxying
  const needsProxy = src && (src.includes('yt3.ggpht.com') || src.includes('i.ytimg.com'))
  
  const imageSrc = imageError 
    ? fallback 
    : needsProxy 
      ? `/api/proxy-image?url=${encodeURIComponent(src)}`
      : src || fallback

  return (
    <div className={`relative ${className}`} 
    // style={{ width, height }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={320}
        height={240}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        unoptimized={Boolean(needsProxy)} // Disable Next.js optimization for proxied images
      />
    </div>
  )
}