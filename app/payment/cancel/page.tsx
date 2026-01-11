'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/header'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        <Card className="max-w-lg mx-auto border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 mb-6">
              <XCircle className="h-10 w-10 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Thanh toán đã bị hủy
            </h1>
            <p className="text-muted-foreground mb-8">
              Bạn đã hủy quá trình thanh toán. Nếu gặp vấn đề, vui lòng liên hệ hỗ trợ.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/pricing">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Thử lại
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Về trang chủ
                </Link>
              </Button>
            </div>
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
