"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { FAQ_ITEMS } from "@/components/home/faq-data";

export { FAQ_ITEMS };

export function FaqSection() {
  return (
    <section className="container py-24 scroll-fade-section transition-all duration-700" id="faq-section">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            Giải Đáp Thắc Mắc & Kiến Thức Cốt Lõi
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Những Câu Hỏi Thường Gặp Về Ads Spy Tool
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Hiểu rõ cơ chế bóc tách dữ liệu, thuật toán ước tính ngân sách và cách khai thác tối đa công cụ để nhân đôi hiệu quả chiến dịch quảng cáo của bạn.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="border border-slate-800/80 rounded-2xl px-6 bg-slate-950/60 data-[state=open]:border-indigo-500/40 data-[state=open]:bg-slate-950/90 transition-all"
              >
                <AccordionTrigger className="text-left font-bold text-white text-base md:text-lg hover:text-indigo-400 hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 text-sm md:text-base leading-relaxed pb-5 text-slate-300 font-normal">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
