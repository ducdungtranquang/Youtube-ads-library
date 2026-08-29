"use client";

import { ReactNode, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface AdsSpyFilterPanelProps {
  title: string;
  children: ReactNode;
  onClear?: () => void;
}

function FilterContent({ title, children, onClear }: AdsSpyFilterPanelProps) {
  return <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
    <div className="mb-5 flex items-center justify-between gap-3 border-b border-border/70 pb-4">
      <h2 className="flex items-center gap-2 font-semibold"><Filter className="size-4 text-primary" />{title}</h2>
      {onClear && <Button variant="ghost" size="sm" onClick={onClear}>Xóa lọc</Button>}
    </div>
    <div className="space-y-4">{children}</div>
  </div>;
}

export function AdsSpyFilterPanel(props: AdsSpyFilterPanelProps) {
  const [open, setOpen] = useState(false);
  return <>
    <aside className="hidden lg:block lg:sticky lg:top-5 lg:self-start"><FilterContent {...props} /></aside>
    <div className="lg:hidden">
      <Button type="button" variant="outline" className="w-full justify-center" onClick={() => setOpen(true)}><Filter className="mr-2 size-4" />Bộ lọc</Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[90vw] overflow-y-auto p-0 sm:max-w-md">
          <SheetHeader><SheetTitle>{props.title}</SheetTitle></SheetHeader>
          <div className="px-4 pb-6"><FilterContent {...props} /></div>
        </SheetContent>
      </Sheet>
    </div>
  </>;
}
