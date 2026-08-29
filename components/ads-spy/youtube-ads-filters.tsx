"use client";

import { Input } from "@/components/ui/input";
import { SimpleAsyncCategorySelect, SimpleAsyncCountrySelect, SimpleStaticLanguageSelect } from "@/components/simple-async-select";

export function YoutubeAdsFilters({ country, setCountry, language, setLanguage, category, setCategory, showVideos, setShowVideos, dateFrom, setDateFrom, dateTo, setDateTo }: { country: string; setCountry: (value: string) => void; language: string; setLanguage: (value: string) => void; category: string; setCategory: (value: string) => void; showVideos: string; setShowVideos: (value: string) => void; dateFrom: string; setDateFrom: (value: string) => void; dateTo: string; setDateTo: (value: string) => void }) {
  return <div className="space-y-4">
    <Field label="Quốc gia"><SimpleAsyncCountrySelect value={country} onValueChange={setCountry} className="w-full" /></Field>
    <Field label="Ngôn ngữ"><SimpleStaticLanguageSelect value={language} onValueChange={setLanguage} className="w-full" /></Field>
    <Field label="Danh mục"><SimpleAsyncCategorySelect value={category} onValueChange={setCategory} className="w-full" /></Field>
    <Field label="Loại video"><select value={showVideos} onChange={(event) => setShowVideos(event.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="unlisted">Chỉ video ẩn</option><option value="all">Tất cả video</option><option value="public">Chỉ video công khai</option></select></Field>
    <Field label="Từ ngày"><Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></Field>
    <Field label="Đến ngày"><Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></Field>
  </div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><label className="text-sm font-medium">{label}</label>{children}</div>; }
