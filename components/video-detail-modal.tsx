"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Calendar, TrendingUp, Heart, ExternalLink, Building2, Play } from "lucide-react"

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
  }
  onCompanyClick?: () => void
}

export function VideoDetailModal({ open, onOpenChange, video, onCompanyClick }: VideoDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] desktop:max-w-7xl max-h-[95vh] overflow-y-auto mobile:max-w-[calc(100vw-1rem)] mobile:max-h-[95vh] mobile:m-2">
        <DialogHeader>
          <DialogTitle className="text-2xl">{video.title}</DialogTitle>
          <DialogDescription>{video.channel}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 backdrop-blur">
                <Play className="h-8 w-8 text-primary-foreground" fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              <Eye className="mr-1.5 h-4 w-4" />
              {video.views} lượt xem
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <TrendingUp className="mr-1.5 h-4 w-4" />
              CTR: {video.ctr}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Calendar className="mr-1.5 h-4 w-4" />
              {video.date}
            </Badge>
            {video.duration && (
              <Badge variant="outline" className="text-sm">
                Thời lượng: {video.duration}
              </Badge>
            )}
          </div>

          {video.companyName && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Doanh nghiệp</h3>
              <button
                onClick={onCompanyClick}
                className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
              >
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{video.companyName}</span>
              </button>
            </div>
          )}

          <Separator />

          <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1">
            <div className="rounded-lg bg-accent p-4">
              <p className="text-sm text-muted-foreground">Tỷ lệ tương tác</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{video.engagement || "12.5%"}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <p className="text-sm text-muted-foreground">Thời lượng xem trung bình</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{video.avgViewDuration || "3:45"}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <p className="text-sm text-muted-foreground">Tỷ lệ nhấp chuột</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{video.ctr}</p>
            </div>
          </div>

          {video.description && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Mô tả</h3>
              <p className="text-sm text-foreground leading-relaxed">{video.description}</p>
            </div>
          )}

          <div className="flex gap-3 mobile:flex-col">
            <Button className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Thêm vào yêu thích
            </Button>
            {video.url && (
              <Button variant="secondary" asChild className="mobile:w-full">
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Xem trên YouTube
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
