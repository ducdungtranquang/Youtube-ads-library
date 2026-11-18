"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
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

      <DialogContent className="max-w-4xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <DialogHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Play className="h-3.5 w-3.5 fill-indigo-600" />
            </span>
            <DialogTitle className="text-xl font-black text-slate-900">
              Video Hướng Dẫn Tìm Hàng WIN & Khai Thác Ads
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Xem trực tiếp chuỗi bài học thực chiến để tìm sản phẩm tiềm năng và tải creative về máy.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          <VideoTutorialsPlayer
            initialVideoId={initialVideoId}
            showTitle={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

