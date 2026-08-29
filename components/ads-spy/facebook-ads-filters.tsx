"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const levels = [{ value: "🔥 WINNER", label: "🔥 WINNER Ads" }, { value: "⚡ GOOD", label: "⚡ GOOD Ads" }, { value: "LOW", label: "LOW Ads" }];
const spends = { LOW: "Thấp", MEDIUM: "Trung bình", HIGH: "Cao", VERY_HIGH: "Rất cao" };
const funnels = { TOF: "TOF - Nhận biết", MOF: "MOF - Cân nhắc", BOF: "BOF - Chuyển đổi" };
const scaling = [{ value: "LOW", label: "Scaling thấp" }, { value: "MEDIUM", label: "Scaling trung bình" }, { value: "HIGH", label: "Scaling cao" }];

export interface FacebookAdsFiltersProps {
  selectedCountry: string; setSelectedCountry: (value: string) => void; publicDateFrom: string; setPublicDateFrom: (value: string) => void; publicDateTo: string; setPublicDateTo: (value: string) => void;
  minScore: string; setMinScore: (value: string) => void; maxScore: string; setMaxScore: (value: string) => void; selectedLevel: string; setSelectedLevel: (value: string) => void;
  selectedSpends: string[]; setSelectedSpends: (value: string[]) => void; minTrendingScore: string; setMinTrendingScore: (value: string) => void; selectedFunnels: string[]; setSelectedFunnels: (value: string[]) => void; scalingLevel: string; setScalingLevel: (value: string) => void;
}

export function FacebookAdsFilters(props: FacebookAdsFiltersProps) {
  const toggle = (values: string[], value: string, checked: boolean) => checked ? [...values, value] : values.filter((item) => item !== value);
  return <div className="grid gap-4 sm:grid-cols-2">
    <Field label="Quốc gia / nền tảng"><Input placeholder="Ví dụ: VN, US, IG..." value={props.selectedCountry} onChange={(e) => props.setSelectedCountry(e.target.value)} /></Field>
    <Field label="Cấp độ quảng cáo"><Select value={props.selectedLevel} onValueChange={props.setSelectedLevel}><SelectTrigger><SelectValue placeholder="Tất cả cấp độ" /></SelectTrigger><SelectContent>{levels.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></Field>
    <Field label="Điểm thấp nhất"><Input type="number" placeholder="Ví dụ: 7" value={props.minScore} onChange={(e) => props.setMinScore(e.target.value)} /></Field>
    <Field label="Điểm cao nhất"><Input type="number" placeholder="Ví dụ: 25" value={props.maxScore} onChange={(e) => props.setMaxScore(e.target.value)} /></Field>
    <Field label="Chạy từ ngày"><Input type="date" value={props.publicDateFrom} onChange={(e) => props.setPublicDateFrom(e.target.value)} /></Field>
    <Field label="Đến ngày"><Input type="date" value={props.publicDateTo} onChange={(e) => props.setPublicDateTo(e.target.value)} /></Field>
    <Field label="Mức chi tiêu"><MultiSelect values={props.selectedSpends} options={spends} placeholder="Chọn mức chi tiêu" onChange={props.setSelectedSpends} toggle={toggle} id="spend" /></Field>
    <Field label="Điểm xu hướng từ"><Input type="number" placeholder="Ví dụ: 80" value={props.minTrendingScore} onChange={(e) => props.setMinTrendingScore(e.target.value)} /></Field>
    <Field label="Phễu marketing"><MultiSelect values={props.selectedFunnels} options={funnels} placeholder="Chọn phễu" onChange={props.setSelectedFunnels} toggle={toggle} id="funnel" /></Field>
    <Field label="Mức độ scaling"><Select value={props.scalingLevel} onValueChange={props.setScalingLevel}><SelectTrigger><SelectValue placeholder="Tất cả" /></SelectTrigger><SelectContent>{scaling.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></Field>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><label className="text-sm font-medium">{label}</label>{children}</div>; }
function MultiSelect({ values, options, placeholder, onChange, toggle, id }: { values: string[]; options: Record<string, string>; placeholder: string; onChange: (value: string[]) => void; toggle: (values: string[], value: string, checked: boolean) => string[]; id: string }) {
  return <DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="outline" className="w-full justify-start font-normal">{values.length ? values.map((value) => options[value]).join(", ") : placeholder}</Button></DropdownMenuTrigger><DropdownMenuContent className="w-64">{Object.entries(options).map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-2 p-2 text-sm"><Checkbox id={`${id}-${value}`} checked={values.includes(value)} onCheckedChange={(checked) => onChange(toggle(values, value, Boolean(checked)))} />{label}</label>)}</DropdownMenuContent></DropdownMenu>;
}
