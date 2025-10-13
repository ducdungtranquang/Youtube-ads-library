import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'YouTube ADS Libraries - Marketing & Affiliate Intelligence',
  description: 'Discover winning video ads, analyze competitor campaigns, and research profitable affiliate offers',
  generator: 'Youtube ads library',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          {children}
          <Toaster />
          <Sonner />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
