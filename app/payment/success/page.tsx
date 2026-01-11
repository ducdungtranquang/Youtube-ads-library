'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/header'
import { CheckCircle, Loader2, ArrowRight, Crown } from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderCode = searchParams.get('orderCode')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!orderCode) {
      setStatus('error')
      setMessage('Không tìm thấy mã đơn hàng')
      return
    }

    // Verify payment status
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/status?orderCode=${orderCode}`)
        const data = await response.json()

        if (data.success && data.status === 'PAID') {
          setStatus('success')
          setMessage('Thanh toán thành công! Tài khoản của bạn đã được nâng cấp.')
        } else if (data.status === 'PENDING') {
          // Keep checking
          setTimeout(verifyPayment, 3000)
        } else {
          setStatus('error')
          setMessage('Không thể xác nhận thanh toán. Vui lòng liên hệ hỗ trợ.')
        }
      } catch (error) {
        console.error('Verify payment error:', error)
        setStatus('error')
        setMessage('Có lỗi xảy ra khi xác nhận thanh toán.')
      }
    }

    verifyPayment()
  }, [orderCode])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        <Card className="max-w-lg mx-auto border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            {status === 'loading' && (
              <>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                  <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Đang xác nhận thanh toán...
                </h1>
                <p className="text-muted-foreground">
                  Vui lòng đợi trong giây lát
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-sm font-medium text-white mb-4">
                  <Crown className="h-4 w-4" />
                  Thành viên Premium
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Thanh toán thành công!
                </h1>
                <p className="text-muted-foreground mb-8">
                  {message}
                </p>
                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="/dashboard">
                      Đến Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/mkt">
                      Tìm kiếm ngay
                    </Link>
                  </Button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                  <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Có lỗi xảy ra
                </h1>
                <p className="text-muted-foreground mb-8">
                  {message}
                </p>
                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="/pricing">
                      Thử lại
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      Về trang chủ
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Ads Spy Tool. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  )
}
