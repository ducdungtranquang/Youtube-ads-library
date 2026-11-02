export interface IndustryOption {
  value: string;
  label: string;
  iconName?: string;
}

export const INDUSTRIES: IndustryOption[] = [
  { value: "beauty_health", label: "Làm đẹp & Sức khỏe", iconName: "Sparkles" },
  { value: "electronics", label: "Điện tử & Công nghệ", iconName: "Laptop" },
  { value: "fashion", label: "Thời trang", iconName: "Shirt" },
  { value: "home_living", label: "Nhà cửa & Đời sống", iconName: "Home" },
  { value: "food_beverage", label: "Ẩm thực & Đồ uống", iconName: "Utensils" },
  { value: "real_estate", label: "Bất động sản", iconName: "Building2" },
  { value: "finance", label: "Tài chính & Đầu tư", iconName: "Landmark" },
  { value: "education", label: "Giáo dục & Khóa học", iconName: "GraduationCap" },
  { value: "automotive", label: "Ô tô & Xe cộ", iconName: "Car" },
  { value: "pets", label: "Thú cưng", iconName: "Dog" },
  { value: "travel", label: "Du lịch & Nghỉ dưỡng", iconName: "Plane" },
  { value: "entertainment", label: "Giải trí & Game", iconName: "Gamepad2" },
  { value: "gambling", label: "Cá cược & Casino", iconName: "Dices" },
  { value: "other", label: "Khác", iconName: "MoreHorizontal" },
];

export const INDUSTRY_MAP = new Map<string, string>(
  INDUSTRIES.map((ind) => [ind.value, ind.label])
);

export function getIndustryLabel(value?: string | null): string | null {
  if (!value) return null;
  const key = String(value).trim().toLowerCase();
  return INDUSTRY_MAP.get(key) || value;
}
