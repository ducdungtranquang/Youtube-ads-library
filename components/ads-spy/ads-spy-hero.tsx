import { Sparkles } from "lucide-react";

interface AdsSpyHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AdsSpyHero({ eyebrow, title, description }: AdsSpyHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-primary/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,.28),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(99,102,241,.34),_transparent_36%),linear-gradient(125deg,#111827,#1e1b4b_55%,#172554)] py-12 text-white md:py-16">
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="container relative">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur">
            <Sparkles className="size-4 text-cyan-200" />
            {eyebrow}
          </div>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">{description}</p>
        </div>
      </div>
    </section>
  );
}
