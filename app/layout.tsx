import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from 'sonner'
import './globals.css'

/* =========================
   SEO METADATA (Next.js 14)
========================= */
export const metadata: Metadata = {
  metadataBase: new URL('https://ads-spy-tool.tech'),
  title: {
    default: 'Ads Spy Tool - Spy Quảng Cáo Facebook, YouTube & Affiliate',
    template: '%s | Ads Spy Tool',
  },
  description:
    'Ads Spy Tool giúp bạn spy, phân tích và theo dõi quảng cáo Youtube, Affiliate Offers, Brands & Companies. Công cụ Ads Intelligence mạnh mẽ cho Marketer và Affiliate.',
  applicationName: 'Ads Spy Tool',
  generator: 'Ads Spy Tool',
  keywords: [
    'Ads Spy Tool',
    'Ads Spy',
    'Youtube Ads Spy',
    'Ads Intelligence Tool',
    'Affiliate Ads Spy',
    'Ads Library',
    'Spy Youtube Ads',
    'Affiliate Marketing Tool',
    'Quảng cáo Youtube',
    'Phân tích quảng cáo',
    'Marketing Tool',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Ads Spy Tool - Spy Quảng Cáo Facebook, YouTube & Affiliate',
    description:
      'Công cụ Ads Spy mạnh mẽ giúp bạn tìm, phân tích và theo dõi quảng cáo Youtube, Facebook & Affiliate. Tối ưu chiến dịch nhanh chóng.',
    url: 'https://ads-spy-tool.tech/',
    siteName: 'Ads Spy Tool',
    type: 'website',
    images: [
      {
        url: '/marketing-video-thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Ads Spy Tool - Spy Quảng Cáo Facebook, YouTube & Affiliate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ads Spy Tool - Spy Quảng Cáo Facebook, YouTube & Affiliate',
    description:
      'Công cụ Ads Spy mạnh mẽ giúp bạn tìm, phân tích và theo dõi quảng cáo Youtube, Facebook & Affiliate. Tối ưu chiến dịch nhanh chóng.',
    images: ['/marketing-video-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://ads-spy-tool.tech/',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Ads Spy Tool",
              url: "https://ads-spy-tool.tech",
              description:
                "Ads Spy Tool giúp bạn phân tích quảng cáo Youtube, Facebook, Affiliate.",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://ads-spy-tool.tech/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* =========================
            FACEBOOK META PIXEL
        ========================= */}
        {/* <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2402506086846191');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2402506086846191&ev=PageView&noscript=1"
          />
        </noscript> */}
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
