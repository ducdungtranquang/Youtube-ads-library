import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { TrendingUp, Search, Heart, LayoutDashboard, Video, Target, DollarSign, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="container py-20 tablet:py-32 mobile:py-16">
          <div className="mx-auto text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Video className="h-4 w-4" />
              Nền tảng thông tin quảng cáo YouTube
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground tablet:text-5xl desktop:text-6xl mobile:text-3xl text-balance">
              Khám phá quảng cáo video thành công & chiến dịch Affiliate
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-pretty tablet:text-xl mobile:text-base">
              Phân tích quảng cáo đối thủ, tìm offers có lợi nhuận và nghiên cứu chiến dịch thành công. Công cụ tối ưu cho
              marketers và affiliate marketers.
            </p>
            <div className="flex flex-col gap-4 xl:flex-row xl:justify-center">
              <Link href="/quicksearch">
                <Button size="lg" className="w-full xl:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Tìm kiếm nhanh
                </Button>
              </Link>
              <Link href="/mkt">
                <Button size="lg" variant="outline" className="w-full xl:w-auto bg-transparent">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Chế độ Marketing
                </Button>
              </Link>
              <Link href="/aff">
                <Button size="lg" variant="outline" className="w-full xl:w-auto bg-transparent">
                  <Video className="mr-2 h-5 w-5" />
                  Chế độ Affiliate
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Ba chế độ mạnh mẽ</h2>
            <p className="text-lg text-muted-foreground">
              Được xây dựng cho marketers và affiliate marketers với công cụ tìm kiếm nhanh và chuyên dụng
            </p>
          </div>

          <div className="grid gap-8 tablet:grid-cols-2 desktop:grid-cols-3 mobile:grid-cols-1">
            <Card className="border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Search className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Tìm kiếm nhanh</CardTitle>
                <CardDescription className="text-base">
                  Tìm kiếm nhanh trên tất cả quảng cáo và offers với nội dung nổi bật
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Search className="mt-1 h-5 w-5 text-accent-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Tìm kiếm toàn diện</p>
                    <p className="text-sm text-muted-foreground">Tìm kiếm cả quảng cáo marketing và affiliate offers ngay lập tức</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Video className="mt-1 h-5 w-5 text-accent-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Nội dung nổi bật</p>
                    <p className="text-sm text-muted-foreground">Khám phá quảng cáo xu hướng và offers hiệu suất cao</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-1 h-5 w-5 text-accent-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Thông tin chi tiết nhanh</p>
                    <p className="text-sm text-muted-foreground">Nhận thống kê tức thì và thông tin chi tiết nền tảng</p>
                  </div>
                </div>
                <Link href="/quicksearch" className="block pt-4">
                  <Button className="w-full" variant="outline">
                    Thử tìm kiếm nhanh
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Chế độ Marketing</CardTitle>
                <CardDescription className="text-base">
                  Nghiên cứu quảng cáo đối thủ, phân tích thương hiệu và theo dõi chiến dịch công ty
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Tìm kiếm quảng cáo</p>
                    <p className="text-sm text-muted-foreground">Tìm quảng cáo theo từ khóa, URL hoặc tên miền landing page</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Video className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Phân tích thương hiệu</p>
                    <p className="text-sm text-muted-foreground">Theo dõi quảng cáo hiệu suất cao từ bất kỳ thương hiệu hoặc kênh nào</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Thông tin chi tiết công ty</p>
                    <p className="text-sm text-muted-foreground">
                      Phân tích chiến lược quảng cáo trên nhiều thương hiệu
                    </p>
                  </div>
                </div>
                <Link href="/mkt" className="block pt-4">
                  <Button className="w-full">Khám phá công cụ Marketing</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Chế độ Affiliate</CardTitle>
                <CardDescription className="text-base">
                  Khám phá offers có lợi nhuận, affiliates thành công và chiến dịch thắng lợi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Search className="mt-1 h-5 w-5 text-secondary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Video Affiliate</p>
                    <p className="text-sm text-muted-foreground">
                      Tìm video có link affiliate và phân tích hiệu suất
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-1 h-5 w-5 text-secondary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Top Affiliates</p>
                    <p className="text-sm text-muted-foreground">
                      Nghiên cứu affiliate marketers thành công và chiến lược của họ
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="mt-1 h-5 w-5 text-secondary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Cơ sở dữ liệu Offer</p>
                    <p className="text-sm text-muted-foreground">
                      Duyệt offers theo mạng lưới, lĩnh vực và chỉ số hiệu suất
                    </p>
                  </div>
                </div>
                <Link href="/aff" className="block pt-4">
                  <Button className="w-full" variant="secondary">
                    Khám phá công cụ Affiliate
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Features */}
        <section className="container py-20">
          <div className="grid gap-6 tablet:grid-cols-3 mobile:grid-cols-1">
            <Card>
              <CardHeader>
                <Heart className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Yêu thích & Danh sách theo dõi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Lưu quảng cáo, offers và affiliates để theo dõi hiệu suất theo thời gian</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <LayoutDashboard className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Bảng điều khiển phân tích</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Xem quảng cáo xu hướng, top quốc gia và thông tin chi tiết hiệu suất</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Xuất dữ liệu & Báo cáo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Xuất dữ liệu ra CSV và tạo báo cáo chi tiết (gói Pro)</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-20">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground text-balance">
                Sẵn sàng tìm chiến dịch thành công tiếp theo?
              </h2>
              <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
                Tham gia cùng hàng nghìn marketers và affiliates sử dụng YouTube ADS Libraries để nghiên cứu, phân tích và
                khám phá cơ hội có lợi nhuận.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/pricing">
                  <Button size="lg">Xem gói giá</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 YouTube ADS Libraries. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  )
}
