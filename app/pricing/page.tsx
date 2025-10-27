import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Check } from "lucide-react"


export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-20">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Bảng giá minh bạch, đơn giản</h1>
          <p className="text-lg text-muted-foreground">
            Chọn gói phù hợp với nhu cầu của bạn. Có thể nâng cấp hoặc hạ cấp bất cứ lúc nào.
          </p>
        </div>

  <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Gói Miễn phí */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Miễn phí</CardTitle>
              <CardDescription>Phù hợp để bắt đầu trải nghiệm</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">0₫</span>
                <span className="text-muted-foreground">/tháng</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">Chỉ sử dụng QuickSearch</span>
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Bắt đầu ngay
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gói Cá nhân */}
          <Card className="border-2 border-primary shadow-lg">
            <CardHeader>
              <div className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Phổ biến nhất
              </div>
              <CardTitle className="text-2xl">Cá nhân</CardTitle>
              <CardDescription>Dành cho người dùng cá nhân</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">159.000₫</span>
                <span className="text-muted-foreground">/tháng</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground font-medium">Tìm kiếm tối đa 10 lần/ngày</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground font-medium">Xem chi tiết video</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground font-medium">Lưu tối đa 20 mục yêu thích</span>
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button className="w-full">Đăng ký ngay</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gói Doanh nghiệp */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Doanh nghiệp</CardTitle>
              <CardDescription>Dành cho tổ chức, doanh nghiệp</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">999.000₫</span>
                <span className="text-muted-foreground">/tháng</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground font-medium">Tìm kiếm không giới hạn</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground font-medium">Xuất dữ liệu ra CSV</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground font-medium">Hỗ trợ 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground font-medium">Có thể cung cấp API riêng nếu cần</span>
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Liên hệ tư vấn
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Tất cả các gói đều có 14 ngày dùng thử miễn phí. Không cần thẻ tín dụng.
          </p>
        </div>
      </main>
    </div>
  )
}
