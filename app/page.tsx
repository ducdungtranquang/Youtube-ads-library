'use client'

import Link from "next/link"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { TrendingUp, Search, Heart, LayoutDashboard, Video, Target, DollarSign, BarChart3, CheckCircle, ArrowRight, Sparkles, Users, Zap } from "lucide-react"

export default function HomePage() {
  const contactFormRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxlZrmJH2N_9b4MK5LVtZc6OCQ6lT4CV8nmd4FTtHWvnrPoXCNywMZV0mvaDjrlGoZ6/exec';
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('timestamp', new Date().toISOString());
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formDataToSend,
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToContact = () => {
    if (contactFormRef.current) {
      contactFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Redesigned */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-20 md:py-28 lg:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white">
              <Sparkles className="h-4 w-4" />
              #1 Nền tảng Spy Ads cho Marketers Việt Nam
            </div>

            {/* Main heading */}
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Khám Phá Bí Mật
              <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                Quảng Cáo Thành Công
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mb-8 text-lg text-white/90 md:text-xl max-w-2xl mx-auto">
              Phân tích hàng triệu quảng cáo YouTube & Facebook. Tìm insight đối thủ,
              chiến lược winning ads chỉ trong vài click.
            </p>

            {/* Stats */}
            <div className="mb-10 flex flex-wrap justify-center gap-8 text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Video className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold">10M+</p>
                  <p className="text-sm text-white/70">Quảng cáo</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold">5,000+</p>
                  <p className="text-sm text-white/70">Marketers</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm text-white/70">Cập nhật</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={scrollToContact}
                className="h-14 px-8 text-lg font-bold bg-white text-blue-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                Nhận tư vấn miễn phí
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/quicksearch">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg font-semibold border-2 border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm hover:text-white cursor-pointer"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Dùng thử ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main>
        {/* Quick Access Section */}
        <section className="container py-12 -mt-8 relative z-20">
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/quicksearch" className="group">
              <Card className="h-full border-2 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Tìm kiếm nhanh</h3>
                    <p className="text-sm text-muted-foreground">Tìm ads theo từ khóa</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/mkt" className="group">
              <Card className="h-full border-2 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">YouTube Ads</h3>
                    <p className="text-sm text-muted-foreground">Spy ads YouTube</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/facebook-ads-search" className="group">
              <Card className="h-full border-2 hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                    <DollarSign className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Facebook Ads</h3>
                    <p className="text-sm text-muted-foreground">Spy ads Facebook</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Tính năng nổi bật</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Công cụ spy ads mạnh mẽ được thiết kế riêng cho marketers và affiliate Việt Nam
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group border hover:shadow-lg transition-all">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Search className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Tìm kiếm thông minh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Tìm kiếm theo từ khóa, URL, tên miền landing page hoặc tên thương hiệu với độ chính xác cao.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Tìm theo từ khóa & URL
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Lọc theo ngày, quốc gia
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Kết quả realtime
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group border hover:shadow-lg transition-all">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Phân tích chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Xem thống kê chi tiết về ngân sách, thời gian chạy ads và hiệu suất của từng quảng cáo.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Ước tính chi tiêu ads
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Tracking thời gian chạy
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    So sánh đối thủ
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group border hover:shadow-lg transition-all">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <Target className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Spy đối thủ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Theo dõi chiến lược quảng cáo của đối thủ, phân tích winning ads và tìm cơ hội mới.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Theo dõi thương hiệu
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Phát hiện trends mới
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Lịch sử quảng cáo
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group border hover:shadow-lg transition-all">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <Video className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">YouTube Ads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Database hàng triệu video ads YouTube với đầy đủ thông tin về advertiser và performance.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    10M+ video ads
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Xem trực tiếp video
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Download landing page
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="group border hover:shadow-lg transition-all">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                  <DollarSign className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Facebook Ads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Spy ads Facebook với bộ lọc nâng cao: format, platform e-commerce, niche market.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Image, Video, Carousel
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Shopify, WooCommerce
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Engagement metrics
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="group border hover:shadow-lg transition-all">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <Heart className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Lưu & Theo dõi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Lưu ads yêu thích, tạo collection và theo dõi hiệu suất theo thời gian.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Bookmark ads
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Tạo collections
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Export báo cáo
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Sẵn sàng tìm winning ads?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Đăng ký ngay để nhận tư vấn miễn phí và trải nghiệm nền tảng spy ads mạnh mẽ nhất cho marketers Việt Nam.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={scrollToContact}
                  className="h-12 px-8 text-base font-bold bg-white text-blue-600 hover:bg-white/90 cursor-pointer"
                >
                  Nhận tư vấn miễn phí
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/quicksearch">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base font-semibold border-2 border-white/50 text-white bg-transparent hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    Dùng thử ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container py-16" id="contact-form-section">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left side - Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Liên hệ tư vấn</h2>
                <p className="text-muted-foreground">
                  Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn tìm hiểu và sử dụng nền tảng một cách hiệu quả nhất.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phản hồi nhanh</h3>
                    <p className="text-sm text-muted-foreground">Chúng tôi sẽ liên hệ trong vòng 24h</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Demo 1-1</h3>
                    <p className="text-sm text-muted-foreground">Hướng dẫn chi tiết theo nhu cầu của bạn</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Hỗ trợ tận tâm</h3>
                    <p className="text-sm text-muted-foreground">Đồng hành cùng bạn trong quá trình sử dụng</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <Card className="shadow-lg border-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Đăng ký tư vấn miễn phí</CardTitle>
                <CardDescription>Điền thông tin để nhận tư vấn và demo nền tảng</CardDescription>
              </CardHeader>
              <CardContent>
                <form ref={contactFormRef} className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Họ và tên"
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors"
                    />
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Chủ đề (VD: Tư vấn gói Pro)"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors"
                  />
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Nội dung cần tư vấn..."
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors resize-none"
                  ></textarea>
                  {submitStatus === 'success' && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 flex items-center gap-2 text-sm">
                      <CheckCircle className="w-5 h-5" /> Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 flex items-center gap-2 text-sm">
                      Đã có lỗi xảy ra, vui lòng thử lại sau.
                    </div>
                  )}
                  <Button type="submit" size="lg" className="w-full font-semibold cursor-pointer" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký tư vấn'}
                    {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 YouTube ADS Library. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  )
}
