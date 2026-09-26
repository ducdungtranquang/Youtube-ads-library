import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from 'sonner'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

/* =========================
   SEO & GEO METADATA (Next.js 14)
========================= */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://ads-spy-tool.tech'),
  title: {
    default: 'Ads Spy Tool - Tối Ưu & Phân Tích Quảng Cáo Facebook, YouTube',
    template: '%s | Ads Spy Tool',
  },
  description:
    'Công cụ Ads Intelligence mạnh mẽ giúp theo dõi, phân tích Ngân sách chi tiêu (Spend), Lượt tiếp cận (Reach) và chiến lược quảng cáo toàn cầu cho Marketer & Dropshipper.',
  applicationName: 'Ads Spy Tool',
  generator: 'Next.js',
  authors: [{ name: 'QUICKBLACK DIGITAL TECHNOLOGY' }],
  keywords: [
    // Từ khóa chính
    'Ads Spy Tool',
    'Facebook Ads Spy',
    'Youtube Ads Spy',
    'Ads Intelligence Tool',
    // Từ khóa ngách dựa trên tính năng thuật toán & giao diện
    'Ước tính ngân sách quảng cáo',
    'Ads Spend Estimator',
    'Ads Reach Tracker',
    'Kiểm tra CPM quảng cáo',
    'Công cụ Dropshipping',
    'Spy Affiliate Ads',
    'Facebook Ads Library Alternative',
    'Theo dõi nhân nhóm quảng cáo',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Ads Spy Tool - Phân Tích Spend & Reach Quảng Cáo Chuẩn Xác',
    description:
      'Khám phá ngân sách (Spend), lượt tiếp cận (Reach), thời gian chạy (Duration) và nhân nhóm (Duplicates) của bất kỳ quảng cáo nào trên toàn cầu.',
    url: 'https://ads-spy-tool.tech/',
    siteName: 'Ads Spy Tool',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/marketing-video-thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Dashboard phân tích quảng cáo chuyên sâu của Ads Spy Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ads Spy Tool - Phân Tích Ngân Sách & Quảng Cáo Đối Thủ',
    description:
      'Công cụ Ads Spy mạnh mẽ giúp bạn phân tích Spend, Reach và tỷ lệ CPM của đối thủ.',
    images: ['/marketing-video-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://ads-spy-tool.tech/',
    // Cấu hình GEO SEO (Hreflang) để rank tốt trên nhiều khu vực
    languages: {
      'vi-VN': 'https://ads-spy-tool.tech/',
      'en-US': 'https://ads-spy-tool.tech/en',
      'x-default': 'https://ads-spy-tool.tech/',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Cấu trúc Schema.org được nâng cấp (SoftwareApplication + Organization)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://ads-spy-tool.tech/#website",
        "url": "https://ads-spy-tool.tech",
        "name": "Ads Spy Tool",
        "description": "Nền tảng phân tích dữ liệu quảng cáo đa kênh.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://ads-spy-tool.tech/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ads-spy-tool.tech/#software",
        "name": "Ads Spy Tool",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Công cụ phân tích quảng cáo, ước tính Ngân sách chi tiêu (Spend), Lượt tiếp cận (Reach) dựa trên hệ số ngành hàng và khu vực quốc gia.",
        "publisher": {
          "@type": "Organization",
          "name": "CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK",
          "location": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Hanoi",
              "addressCountry": "VN"
            }
          }
        }
      }
    ]
  };

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* =========================
            FACEBOOK META PIXEL
        ========================= */}
        {/* <Script id="facebook-pixel" strategy="afterInteractive"> ... </Script> */}
      </head>

      <body className={`font-sans ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
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