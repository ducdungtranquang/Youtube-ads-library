import type { Metadata } from "next"
import { NotFoundContent } from "@/components/not-found/not-found-content"

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang | Ads Spy Tool",
  description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển trên Ads Spy Tool.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function Custom404Page() {
  return <NotFoundContent />
}
