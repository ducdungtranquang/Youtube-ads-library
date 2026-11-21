"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MonitorPlay, Sparkles, X, Play } from "lucide-react";
import { VideoTutorialsPlayer } from "./video-tutorials-player";

interface VideoTutorialModalProps {
  initialVideoId?: string;
  triggerButton?: React.ReactNode;
  triggerClassName?: string;
}

export function VideoTutorialModal({
  initialVideoId,
  triggerButton,
  triggerClassName,
}: VideoTutorialModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button
            type="button"
            className={
              triggerClassName ||
              "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs transition-all cursor-pointer"
            }
          >
            <MonitorPlay className="h-3.5 w-3.5 text-indigo-600" />
            <span>Video Hướng Dẫn</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-[96vw] max-w-4xl h-[90vh] max-h-[calc(100vh-3.5rem)] p-0 overflow-hidden flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl z-[100]"
      >
        {/* Pinned Header */}
        <div className="sticky top-0 z-30 flex items-start justify-between border-b border-slate-100 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 shrink-0">
          <div className="space-y-1 pr-4 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Play className="h-3.5 w-3.5 fill-indigo-600" />
              </span>
              <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 truncate">
                Video Hướng Dẫn Tìm Hàng WIN & Khai Thác Ads
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Xem trực tiếp chuỗi bài học thực chiến để tìm sản phẩm tiềm năng và tải creative về máy.
            </DialogDescription>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 shadow-2xs hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Đóng video hướng dẫn"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </DialogClose>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <VideoTutorialsPlayer
            initialVideoId={initialVideoId}
            showTitle={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

