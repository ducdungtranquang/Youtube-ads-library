import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Winning Products - Sản phẩm Win & Bán chạy | Ads Spy Tool",
  description:
    "Khám phá các sản phẩm thương mại điện tử chiến thắng (Winning Products) hàng đầu từ Facebook Ads. Phân tích Product Score, số lượng ads scaling và top ads hiệu quả nhất.",
  keywords: [
    "winning products",
    "sản phẩm win",
    "facebook ads spy",
    "ecommerce products",
    "dropshipping winning products",
    "ads spy tool",
  ],
  openGraph: {
    title: "Winning Products - Sản phẩm Win & Bán chạy | Ads Spy Tool",
    description:
      "Khám phá các sản phẩm thương mại điện tử chiến thắng hàng đầu từ Facebook Ads với Product Score và Winning Ads.",
    type: "website",
  },
};

export default function WinningProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

