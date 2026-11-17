"use client";

import { VideoTutorialsPlayer } from "@/components/tutorials/video-tutorials-player";

export function VideoTutorialsSection() {
  return (
    <section
      className="container py-16 scroll-fade-section transition-all duration-700"
      id="tutorials-section"
    >
      <div className="rounded-[2.5rem] border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/50 to-white p-6 sm:p-10 md:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background blurs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <VideoTutorialsPlayer />
        </div>
      </div>
    </section>
  );
}

