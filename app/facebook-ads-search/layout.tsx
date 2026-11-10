import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thư Viện Quảng Cáo Facebook - Facebook Ads Library",
  description:
    "Khám phá và nghiên cứu hàng triệu chiến dịch quảng cáo Facebook, Instagram bùng nổ doanh số. Theo dõi ngân sách (Spend), lượt tiếp cận (Reach), số ngày chạy (Duration) và nhân nhóm (Duplicates).",
  keywords: [
    "facebook ads library",
    "thư viện quảng cáo facebook",
    "facebook ads spy",
    "quảng cáo facebook",
    "spy facebook ads",
    "facebook ad search",
    "ads spy tool",
  ],
  openGraph: {
    title: "Thư Viện Quảng Cáo Facebook - Facebook Ads Library | Ads Spy Tool",
    description:
      "Khám phá và nghiên cứu hàng triệu chiến dịch quảng cáo Facebook, Instagram bùng nổ doanh số với Ads Spy Tool.",
    type: "website",
  },
};

export default function FacebookAdsSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

