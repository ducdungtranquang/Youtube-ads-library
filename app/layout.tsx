import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from 'sonner'
import './globals.css'


export const metadata: Metadata = {
  title: 'Youtube Ads Library',
  description: 'Youtube Ads Library - Tìm kiếm, phân tích quảng cáo Youtube, affiliate offers, brands, companies. Công cụ marketing mạnh mẽ cho nhà quảng cáo và affiliate marketer.',
  generator: 'Youtube ads library',
  keywords: [
    'Youtube Ads',
    'Ads Library',
    'Affiliate Marketing',
    'Quảng cáo Youtube',
    'Offers',
    'Brands',
    'Companies',
    'Phân tích quảng cáo',
    'Marketing Tool',
  ],
  openGraph: {
    title: 'Youtube Ads Library',
    description: 'Tìm kiếm, phân tích quảng cáo Youtube, affiliate offers, brands, companies. Công cụ marketing mạnh mẽ cho nhà quảng cáo và affiliate marketer.',
    url: 'https://your-domain.com/',
    type: 'website',
    images: [
      {
        url: '/marketing-video-thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Youtube Ads Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youtube Ads Library',
    description: 'Tìm kiếm, phân tích quảng cáo Youtube, affiliate offers, brands, companies. Công cụ marketing mạnh mẽ cho nhà quảng cáo và affiliate marketer.',
    images: ['/marketing-video-thumbnail.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Youtube Ads Library - Tìm kiếm, phân tích quảng cáo Youtube, affiliate offers, brands, companies. Công cụ marketing mạnh mẽ cho nhà quảng cáo và affiliate marketer." />
        <meta name="keywords" content="Youtube Ads, Ads Library, Affiliate Marketing, Quảng cáo Youtube, Offers, Brands, Companies, Phân tích quảng cáo, Marketing Tool" />
        <meta property="og:title" content="Youtube Ads Library" />
        <meta property="og:description" content="Tìm kiếm, phân tích quảng cáo Youtube, affiliate offers, brands, companies. Công cụ marketing mạnh mẽ cho nhà quảng cáo và affiliate marketer." />
        <meta property="og:image" content="/marketing-video-thumbnail.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Youtube Ads Library" />
        <meta name="twitter:description" content="Tìm kiếm, phân tích quảng cáo Youtube, affiliate offers, brands, companies. Công cụ marketing mạnh mẽ cho nhà quảng cáo và affiliate marketer." />
        <meta name="twitter:image" content="/marketing-video-thumbnail.png" />
      </head>
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
