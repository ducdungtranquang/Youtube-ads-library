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
    default: 'Ads Spy Tool - Bóc Tách Ngân Sách, Lượt Reach & Spy Quảng Cáo YouTube, Facebook',
    template: '%s | Ads Spy Tool',
  },
  description:
    'Nền tảng Ads Intelligence số #1: Xem ngân sách chi tiêu (Spend), lượt tiếp cận (Reach), số ngày chạy (Duration) và nhân nhóm (Duplicates) quảng cáo YouTube, Facebook toàn cầu.',
  applicationName: 'Ads Spy Tool',
  generator: 'Next.js',
  category: 'Marketing Technology',
  authors: [{ name: 'QUICKBLACK DIGITAL TECHNOLOGY', url: 'https://ads-spy-tool.tech' }],
  creator: 'QUICKBLACK DIGITAL TECHNOLOGY',
  publisher: 'QUICKBLACK DIGITAL TECHNOLOGY',
  keywords: [
    // Brand & Cốt lõi
    'Ads Spy Tool',
    'Facebook Ads Spy',
    'Youtube Ads Spy',
    'Ads Intelligence Tool',
    'Thư viện quảng cáo YouTube',
    'YouTube Ad Library',
    // Tính năng thuật toán & chuyên sâu
    'Bóc tách ngân sách quảng cáo',
    'Ước tính Spend và Reach',
    'Ads Spend Estimator',
    'Ads Reach Tracker',
    'Phát hiện quảng cáo Scaling',
    'Theo dõi nhân nhóm quảng cáo',
    'Adset Duplicates Tracker',
    'Kiểm tra CPM quảng cáo',
    // Ngách thị trường & Use cases
    'Săn Winning Ads Dropshipping',
    'Spy Affiliate Ads',
    'Facebook Ads Library Alternative',
    'Tìm video ads unlisted YouTube',
    'Phân tích đối thủ thương mại điện tử',
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
    title: 'Ads Spy Tool - Bóc Tách Ngân Sách, Lượt Reach & Spy Quảng Cáo YouTube, Facebook',
    description:
      'Nền tảng Ads Intelligence chuyên sâu: Khám phá ngân sách chi tiêu (Spend), lượt tiếp cận (Reach), thời gian chạy và số nhóm nhân bản của đối thủ trên toàn cầu.',
    url: 'https://ads-spy-tool.tech/',
    siteName: 'Ads Spy Tool',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/marketing-video-thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Bảng điều khiển phân tích quảng cáo chuyên sâu của Ads Spy Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ads Spy Tool - Bóc Tách Ngân Sách & Spy Quảng Cáo Đối Thủ',
    description:
      'Công cụ Ads Intelligence giúp theo dõi chi tiêu (Spend), lượt reach và mẫu video winning đang vít mạnh.',
    images: ['/marketing-video-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://ads-spy-tool.tech/',
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
  // Cấu trúc Schema.org nâng cao chuẩn GEO & Knowledge Graph (WebSite + SoftwareApplication + Organization)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://ads-spy-tool.tech/#website",
        "url": "https://ads-spy-tool.tech",
        "name": "Ads Spy Tool",
        "alternateName": "YouTube & Facebook Ads Spy Intelligence",
        "description": "Nền tảng phân tích dữ liệu quảng cáo đa kênh, bóc tách ngân sách chi tiêu, lượt reach và chiến lược đối thủ.",
        "inLanguage": ["vi", "en"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://ads-spy-tool.tech/quicksearch?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ads-spy-tool.tech/#software",
        "name": "Ads Spy Tool",
        "applicationCategory": "BusinessApplication",
        "applicationSubCategory": "Ad Intelligence & Competitive Intelligence Platform",
        "operatingSystem": "Web Browser, Windows, macOS, Linux, iOS, Android",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "description": "Công cụ phân tích quảng cáo toàn cầu: ước tính Ngân sách chi tiêu (Spend), Lượt tiếp cận (Reach), thời gian chạy (Duration) và số lượng nhóm nhân bản (Duplicates) cho YouTube Ads và Facebook Ads.",
        "featureList": [
          "YouTube Ads Library & Video Creative Analyzer",
          "Facebook Ads Spend & Reach Estimator",
          "Adset Duplicates & Scaling Speed Detector",
          "Multi-Geo CPM & Market Breakdown (US, EU, VN, SEA)",
          "E-commerce & Dropshipping Winning Product Discovery"
        ],
        "publisher": {
          "@id": "https://ads-spy-tool.tech/#organization"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://ads-spy-tool.tech/#organization",
        "name": "CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK",
        "alternateName": "QUICKBLACK DIGITAL TECHNOLOGY",
        "url": "https://ads-spy-tool.tech",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ads-spy-tool.tech/ava_ads-spy_tool.png"
        },
        "description": "Đơn vị nghiên cứu và phát triển công nghệ dữ liệu số, giải pháp phân tích Big Data Marketing và Ads Intelligence.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Hà Nội",
          "addressCountry": "VN"
        },
        "knowsAbout": [
          "YouTube Advertising",
          "Facebook Advertising",
          "Performance Marketing",
          "Competitive Intelligence",
          "Dropshipping & E-commerce"
        ],
        "areaServed": ["VN", "US", "GB", "EU", "SG", "MY", "Global"]
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