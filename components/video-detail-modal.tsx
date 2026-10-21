"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { FavoriteButton } from "@/components/favorite-button"
import { YouTubeImage } from "@/components/youtube-image"
import { 
  Eye, Calendar, TrendingUp, ExternalLink, Building2, Play, DollarSign, 
  Clock, AlertTriangle, X, Copy, Check, Video, BarChart3, Sparkles
} from "lucide-react"
import { useVideoDetails } from "@/hooks/use-video-details"
import { toast } from "sonner"
import { VideoFavoriteData } from "@/lib/favorites"

interface VideoDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  video: {
    title: string
    channel: string
    views: string
    ctr: string
    date: string
    thumbnail: string
    url?: string
    companyName?: string
    description?: string
    duration?: string
    engagement?: string
    avgViewDuration?: string
    ytVideoId?: string
    brandId?: string
  }
  onCompanyClick?: () => void
  onClose?: (videoId: string) => void
}

export function VideoDetailModal({ open, onOpenChange, video, onCompanyClick, onClose }: VideoDetailModalProps) {
  const { videoDetails, loading, error, fetchVideoDetails } = useVideoDetails()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  // Fetch video details when modal opens and video ID is available
  useEffect(() => {
    if (open && video?.ytVideoId) {
      fetchVideoDetails(video.ytVideoId)
    }
    if (!open) {
      setIsPlaying(false)
      setIsCopied(false)
      setDescExpanded(false)
    }
  }, [open, video?.ytVideoId, fetchVideoDetails])

  // Handle modal close with callback
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      setIsPlaying(false)
      if (onClose && video.ytVideoId) {
        onClose(video.ytVideoId)
      }
    }
  }

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error(`Không thể tải chi tiết video: ${error}`)
    }
  }, [error])

  // Helper functions
  const formatDuration = (seconds?: number) => {
    if (!seconds && seconds !== 0) return video.duration || "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa xác định"
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount?: number) => {
    if (amount == null) return "N/A"
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Use API data if available, fallback to props
  const displayData = videoDetails ? {
    title: videoDetails?.title || video?.title || "Video Quảng Cáo",
    channel: videoDetails?.brandName || video?.channel || "Thương hiệu",
    thumbnail: videoDetails?.thumbnail || video?.thumbnail || "",
    description: videoDetails?.description || video?.description || "",
    duration: formatDuration(videoDetails?.duration),
    publishedAt: formatDate(videoDetails?.publishedAt) || video?.date,
    totalSpend: formatCurrency(videoDetails?.totalSpend),
    last30Days: formatCurrency(videoDetails?.last30Days),
    isActive: videoDetails?.isActive,
    firstSeen: formatDate(videoDetails?.firstSeen),
    lastSeen: videoDetails?.lastSeen ? formatDate(videoDetails?.lastSeen) : "Gần đây",
    spendHistory: videoDetails?.spend || [],
    ytVideoId: videoDetails?.ytVideoId || video?.ytVideoId,
  } : {
    title: video?.title || "Video Quảng Cáo",
    channel: video?.channel || "Thương hiệu",
    thumbnail: video?.thumbnail || "",
    description: video?.description || "",
    duration: video?.duration || "N/A",
    publishedAt: video?.date || "Chưa xác định",
    totalSpend: "N/A",
    last30Days: "N/A",
    isActive: false,
    firstSeen: "",
    lastSeen: "",
    spendHistory: [],
    ytVideoId: video?.ytVideoId || "",
  }

  const videoUrl = displayData.ytVideoId 
    ? `https://youtube.com/watch?v=${displayData.ytVideoId}` 
    : video?.url

  const handleCopyLink = () => {
    if (videoUrl) {
      navigator.clipboard.writeText(videoUrl)
      setIsCopied(true)
      toast.success("Đã sao chép link video vào clipboard!")
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleCopyDescription = () => {
    if (displayData.description) {
      navigator.clipboard.writeText(displayData.description)
      toast.success("Đã sao chép kịch bản / mô tả quảng cáo!")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        showCloseButton={false} 
        className="w-[95vw] max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl"
      >
        {/* Pinned Modal Header (Fixed, never scrolls) */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-100 text-red-600 flex-shrink-0 shadow-2xs">
              <Video className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base sm:text-lg font-black text-slate-900 truncate">
                {displayData.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700 truncate">{displayData.channel}</span>
                {videoDetails && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    displayData.isActive 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${displayData.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {displayData.isActive ? "Đang chạy" : "Tạm dừng"}
                  </span>
                )}
                {displayData.duration && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                    • <Clock className="h-3 w-3" /> {displayData.duration}
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>

          {/* Top Right Controls & PINNED CLOSE BUTTON */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <FavoriteButton
              itemType="video"
              itemId={displayData.ytVideoId || video?.ytVideoId || video?.title}
              itemData={{
                title: displayData.title,
                channel: displayData.channel,
                views: video?.views,
                ctr: video?.ctr,
                date: displayData.publishedAt,
                thumbnail: displayData.thumbnail,
                url: videoUrl,
                ytVideoId: displayData.ytVideoId,
                description: displayData.description,
                duration: displayData.duration,
                companyName: video?.companyName
              } as VideoFavoriteData}
              variant="outline"
              showText={false}
              className="h-9 w-9 rounded-full border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
            />

            {/* Permanent Sticky Close Button */}
            <DialogClose asChild>
              <button
                type="button"
                className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Đóng chi tiết quảng cáo"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="aspect-video w-full max-h-[380px] rounded-2xl" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-12 items-start">
              {/* Left Column: Video Preview & Content (7 Cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Media Showcase */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-200 shadow-md">
                  {isPlaying && displayData.ytVideoId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${displayData.ytVideoId}?autoplay=1`}
                      title={displayData.title}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div 
                      className="group relative h-full w-full cursor-pointer"
                      onClick={() => setIsPlaying(true)}
                    >
                      <YouTubeImage 
                        src={displayData.thumbnail || "/placeholder.svg"} 
                        alt={displayData.title} 
                        width={640}
                        height={360}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102" 
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xl shadow-red-900/40 backdrop-blur-sm group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                          <Play className="h-8 w-8 ml-1" fill="currentColor" />
                        </div>
                      </div>
                      {displayData.duration && (
                        <div className="absolute bottom-3 right-3 rounded-lg bg-black/80 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white shadow-md">
                          {displayData.duration}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Action Toolbar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {videoUrl && (
                    <Button 
                      asChild 
                      variant="default"
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 rounded-xl shadow-sm cursor-pointer"
                    >
                      <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Xem trên YouTube
                      </a>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyLink}
                    className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                        Đã sao chép link
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                        Sao chép link video
                      </>
                    )}
                  </Button>

                  {displayData.ytVideoId && (
                    <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/60 ml-auto">
                      ID: {displayData.ytVideoId}
                    </span>
                  )}
                </div>

                {/* Brand / Channel Info Card */}
                {displayData.channel && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-2xs">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Thương hiệu / Kênh</p>
                          <p className="font-bold text-slate-900 text-sm mt-0.5">{displayData.channel}</p>
                        </div>
                      </div>
                      {onCompanyClick && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onCompanyClick}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 cursor-pointer"
                        >
                          Xem các video của kênh →
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Video Description / Hook 3s Script */}
                {displayData.description && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                        Nội dung & Kịch bản quảng cáo
                      </h4>
                      <button
                        type="button"
                        onClick={handleCopyDescription}
                        className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        Sao chép
                      </button>
                    </div>
                    <div className={`text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line ${!descExpanded ? "line-clamp-4" : ""}`}>
                      {displayData.description}
                    </div>
                    {displayData.description.length > 200 && (
                      <button
                        type="button"
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer pt-1"
                      >
                        {descExpanded ? "Thu gọn ▲" : "Xem toàn bộ kịch bản ▼"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Performance Bento & Intelligence (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* 4 Stats Bento */}
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Card 1: Total Spend */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-emerald-50/20 border border-emerald-200/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Tổng chi tiêu</p>
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2 truncate">
                      {displayData.totalSpend}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Ước tính toàn thời gian</p>
                  </div>

                  {/* Card 2: Last 30 Days */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-blue-50/20 border border-blue-200/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">30 ngày qua</p>
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2 truncate">
                      {displayData.last30Days}
                    </p>
                    <p className="text-[10px] text-blue-700 font-medium mt-0.5">Vít ngân sách gần đây</p>
                  </div>

                  {/* Card 3: CTR / Tương tác */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-indigo-50/20 border border-indigo-200/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Tỷ lệ CTR</p>
                      <BarChart3 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2 truncate">
                      {video?.ctr || "N/A"}
                    </p>
                    <p className="text-[10px] text-indigo-700 font-medium mt-0.5">Click Through Rate</p>
                  </div>

                  {/* Card 4: Views / Thời lượng */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 to-purple-50/20 border border-purple-200/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Lượt xem</p>
                      <Eye className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2 truncate">
                      {video?.views || "N/A"}
                    </p>
                    <p className="text-[10px] text-purple-700 font-medium mt-0.5">Lượt tiếp cận video</p>
                  </div>
                </div>

                {/* Timeline Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    Dòng thời gian chiến dịch
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Ngày xuất bản video</span>
                      <span className="font-bold text-slate-800">{displayData.publishedAt}</span>
                    </div>

                    {videoDetails && displayData.firstSeen && (
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Lần đầu phát hiện chạy ads</span>
                        <span className="font-bold text-indigo-600">{displayData.firstSeen}</span>
                      </div>
                    )}

                    {videoDetails && displayData.lastSeen && (
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-slate-500 font-medium">Lần quét gần nhất</span>
                        <span className="font-bold text-slate-800">{displayData.lastSeen}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spend History (if available) */}
                {videoDetails && displayData.spendHistory.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      Lịch sử bóc tách chi tiêu gần nhất
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {displayData.spendHistory.slice(0, 6).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs">
                          <span className="text-slate-600 font-medium">
                            {formatDate(entry.date)}
                          </span>
                          <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                            {formatCurrency(entry.spend)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error alert fallback */}
                {error && !loading && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Dữ liệu mở rộng tạm thời giới hạn
                    </div>
                    <p className="text-amber-800 leading-relaxed">
                      Thông tin cơ bản vẫn hiển thị đầy đủ. Dữ liệu chi tiêu chuyên sâu sẽ được tự động đồng bộ khi quét lần tiếp theo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
