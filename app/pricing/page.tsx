'use client'

import Link from "next/link"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Check, CheckCircle, X } from "lucide-react"


export default function PricingPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<null | 'personal' | 'business'>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

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

  const openModal = (plan: 'personal' | 'business') => {
    setSelectedPlan(plan);
    setShowModal(true);
    // Set subject and message based on plan
    if (plan === 'personal') {
      setFormData(f => ({
        ...f,
        subject: 'Đăng ký gói Cá nhân',
        message: 'Tôi muốn đăng ký gói Cá nhân. Vui lòng liên hệ tư vấn.'
      }));
    } else {
      setFormData(f => ({
        ...f,
        subject: 'Đăng ký gói Doanh nghiệp',
        message: 'Tôi muốn đăng ký gói Doanh nghiệp. Vui lòng liên hệ tư vấn.'
      }));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setSubmitStatus('');
  };

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
              <Button className="w-full" onClick={() => openModal('personal')}>Đăng ký ngay</Button>
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
              <Button variant="outline" className="w-full bg-transparent" onClick={() => openModal('business')}>
                Liên hệ tư vấn
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Tất cả các gói đều có 14 ngày dùng thử miễn phí. Không cần thẻ tín dụng.
          </p>
        </div>
      </main>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-lg shadow-lg max-w-lg w-full mx-4 relative animate-fadeInUp">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={closeModal}
              aria-label="Đóng"
            >
              <X className="w-6 h-6" />
            </button>
            <Card className="shadow-none border-none">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {selectedPlan === 'personal' ? 'Đăng ký gói Cá nhân' : 'Đăng ký gói Doanh nghiệp'}
                </CardTitle>
                <CardDescription className="text-center">
                  {selectedPlan === 'personal'
                    ? 'Điền thông tin để đăng ký gói Cá nhân. Chúng tôi sẽ liên hệ tư vấn và kích hoạt tài khoản cho bạn.'
                    : 'Điền thông tin để đăng ký gói Doanh nghiệp. Chúng tôi sẽ liên hệ tư vấn và hỗ trợ triển khai cho doanh nghiệp của bạn.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    placeholder="Chủ đề"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors"
                  />
                  <textarea
                    rows={5}
                    name="message"
                    disabled={true}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Nội dung cần tư vấn..."
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors resize-none"
                  ></textarea>
                  {submitStatus === 'success' && (
                    <div className="p-3 rounded bg-green-100 text-green-800 flex items-center gap-2 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-600" /> Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="p-3 rounded bg-red-100 text-red-800 flex items-center gap-2 text-sm">
                      Đã có lỗi xảy ra, vui lòng thử lại sau.
                    </div>
                  )}
                  <Button type="submit" size="lg" className="w-full font-bold text-lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
