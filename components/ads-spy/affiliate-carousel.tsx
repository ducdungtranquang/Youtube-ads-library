"use client";

import Link from "next/link";
import { ArrowUpRight, Megaphone } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export interface AffiliateSlide {
  title: string;
  description: string;
  href: string;
  label?: string;
}

const defaultSlides: AffiliateSlide[] = [
  { title: "Đặt banner affiliate của bạn tại đây", description: "Một vị trí nổi bật giữa hành trình nghiên cứu quảng cáo.", href: "#", label: "Affiliate placement" },
  { title: "Khám phá công cụ tăng trưởng mới", description: "Dễ dàng thay bằng ưu đãi, landing page hoặc link đối tác của bạn.", href: "#", label: "Featured partner" },
  { title: "Tối ưu creative nhanh hơn", description: "Đưa đúng lời mời hành động đến đúng nhóm người dùng.", href: "#", label: "Growth toolkit" },
];

export function AffiliateCarousel({ slides = defaultSlides }: { slides?: AffiliateSlide[] }) {
  return (
    <section aria-label="Ưu đãi đối tác" className="relative rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-4 shadow-sm dark:border-indigo-900/60 dark:from-indigo-950/40 dark:via-card dark:to-cyan-950/20 md:px-12">
      <Carousel opts={{ align: "start", loop: slides.length > 1 }} className="w-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.title} className="md:basis-1/2 xl:basis-1/3">
              <Link href={slide.href} className="group block rounded-xl p-2 transition-colors hover:bg-white/70 dark:hover:bg-white/5">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm"><Megaphone className="size-4" /></span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">{slide.label}</p>
                    <h2 className="mt-1 font-semibold text-foreground">{slide.title} <ArrowUpRight className="inline size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></h2>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">{slide.description}</p>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 border-indigo-100 bg-background shadow-sm" />
        <CarouselNext className="-right-3 border-indigo-100 bg-background shadow-sm" />
      </Carousel>
    </section>
  );
}
