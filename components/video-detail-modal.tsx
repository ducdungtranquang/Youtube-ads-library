"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { FavoriteButton } from "@/components/favorite-button"
import { YouTubeImage } from "@/components/youtube-image"
import { Eye, Calendar, TrendingUp, ExternalLink, Building2, Play, DollarSign, Clock, AlertTriangle } from "lucide-react"
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
    ytVideoId?: string // Add YouTube video ID for API call
    brandId?: string
  }
  onCompanyClick?: () => void
  onClose?: (videoId: string) => void // Callback when modal closes to refresh favorite status
}

export function VideoDetailModal({ open, onOpenChange, video, onCompanyClick, onClose }: VideoDetailModalProps) {
  const { videoDetails, loading, error, fetchVideoDetails } = useVideoDetails()

  // Fetch video details when modal opens and video ID is available
  useEffect(() => {
    if (open && video?.ytVideoId) {
      fetchVideoDetails(video.ytVideoId)
    }
  }, [open, video.ytVideoId, fetchVideoDetails])

  // Handle modal close with callback
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    // If modal is closing and we have a close callback, trigger it
    if (!newOpen && onClose && video.ytVideoId) {
      onClose(video.ytVideoId)
    }
  }

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error(`Không thể tải chi tiết video: ${error}`)
    }
  }, [error])

  // Helper functions
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Use API data if available, fallback to props
  const displayData = videoDetails ? {
    title: videoDetails?.title || video?.title,
    channel: videoDetails?.brandName || video?.channel,
    thumbnail: videoDetails?.thumbnail || video?.thumbnail,
    description: videoDetails?.description || video?.description || "",
    duration: formatDuration(videoDetails?.duration),
    publishedAt: formatDate(videoDetails?.publishedAt),
    totalSpend: formatCurrency(videoDetails?.totalSpend),
    last30Days: formatCurrency(videoDetails?.last30Days),
    isActive: videoDetails?.isActive,
    firstSeen: formatDate(videoDetails?.firstSeen),
    lastSeen: videoDetails?.lastSeen ? formatDate(videoDetails?.lastSeen) : "Chưa xác định",
    spendHistory: videoDetails?.spend || [],
    ytVideoId: videoDetails?.ytVideoId
  } : {
    title: video.title,
    channel: video.channel,
    thumbnail: video.thumbnail,
    description: video.description || "",
    duration: video.duration || "",
    publishedAt: video.date,
    totalSpend: "N/A",
    last30Days: "N/A",
    isActive: false,
    firstSeen: "",
    lastSeen: "",
    spendHistory: [],
    ytVideoId: video.ytVideoId || ""
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="lg:w-[80vw] lg:h-[80vh] max-w-none overflow-y-auto w-[95vw] h-[90vh] m-2">
        <DialogHeader>
          <DialogTitle className="text-2xl">{displayData.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {displayData.channel}
            {videoDetails && (
              <Badge variant={displayData.isActive ? "default" : "secondary"} className="ml-2">
                {displayData.isActive ? "Đang hoạt động" : "Không hoạt động"}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          )}

          {!loading && (
            <>
              <div className="max-w-[300px] max-h-[300px] relative w-2/3 mx-auto aspect-video overflow-hidden rounded-lg bg-muted">
                <YouTubeImage 
                  src={displayData.thumbnail || "/placeholder.svg"} 
                  alt={displayData.title} 
                  width={300}
                  height={300}
                  className="h-full w-full object-cover rounded-lg" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 backdrop-blur">
                    <Play className="h-8 w-8 text-primary-foreground" fill="currentColor" />
                  </div>
                </div>
                {displayData.duration && (
                  <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                    {displayData.duration}
                  </div>
                )}
              </div>

              {/* Badges Section */}
              <div className="flex flex-wrap gap-2">
                {videoDetails && (
                  <>
                    <Badge variant="secondary" className="text-sm">
                      <DollarSign className="mr-1.5 h-4 w-4" />
                      Chi tiêu: {displayData.totalSpend}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      <DollarSign className="mr-1.5 h-4 w-4" />
                      30 ngày: {displayData.last30Days}
                    </Badge>
                  </>
                )}
                <Badge variant="outline" className="text-sm">
                  <Calendar className="mr-1.5 h-4 w-4" />
                  {displayData.publishedAt}
                </Badge>
                {videoDetails && displayData.firstSeen && (
                  <Badge variant="outline" className="text-sm">
                    <Eye className="mr-1.5 h-4 w-4" />
                    Phát hiện: {displayData.firstSeen}
                  </Badge>
                )}
              </div>

              {/* Company/Brand Section */}
              {displayData.channel && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Thương hiệu</h3>
                  <button
                    onClick={onCompanyClick}
                    className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                  >
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{displayData.channel}</span>
                  </button>
                </div>
              )}

              <Separator />

              {/* Stats Grid */}
              {videoDetails ? (
                <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1">
                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{displayData.totalSpend}</p>
                  </div>
                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-sm text-muted-foreground">Chi tiêu 30 ngày</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{displayData.last30Days}</p>
                  </div>
                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <p className={`mt-1 text-2xl font-bold ${displayData.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                      {displayData.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1">
                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-sm text-muted-foreground">Tỷ lệ tương tác</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{video.engagement || "N/A"}</p>
                  </div>
                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-sm text-muted-foreground">Thời lượng xem TB</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{video.avgViewDuration || "N/A"}</p>
                  </div>
                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-sm text-muted-foreground">Tỷ lệ nhấp chuột</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{video.ctr}</p>
                  </div>
                </div>
              )}

              {/* Spend History */}
              {videoDetails && displayData.spendHistory.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Lịch sử chi tiêu</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {displayData.spendHistory.slice(0, 5).map((entry, index) => (
                      <div key={index} className="flex items-center justify-between rounded border border-border p-2 text-sm">
                        <span className="text-muted-foreground">
                          {formatDate(entry.date)}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(entry.spend)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {displayData.description && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Mô tả</h3>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3">{displayData.description}</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Không thể tải chi tiết</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex-col md:flex-row gap-2">
                <FavoriteButton
                  itemType="video"
                  itemId={displayData.ytVideoId || video.ytVideoId || video.title}
                  itemData={{
                    title: displayData.title,
                    channel: displayData.channel,
                    views: video.views,
                    ctr: video.ctr,
                    date: displayData.publishedAt,
                    thumbnail: displayData.thumbnail,
                    url: video.url,
                    ytVideoId: displayData.ytVideoId,
                    description: displayData.description,
                    duration: displayData.duration,
                    companyName: video.companyName
                  } as VideoFavoriteData}
                  variant="outline"
                  showText
                  className="flex-1"
                />
                {displayData.ytVideoId && (
                  <Button variant="secondary" asChild className="ml-2">
                    <a href={`https://youtube.com/watch?v=${displayData.ytVideoId}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Xem trên YouTube
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
