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
  metadataBase: new URL('https://your-domain.com'),
  title: {
    default: 'Ads Spy Tool – Advanced Ads Intelligence Platform',
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
    title: 'Ads Spy Tool – Advanced Ads Intelligence Platform',
    description:
      'Spy & phân tích quảng cáo Youtube, Affiliate Offers, Brands, Companies. Công cụ Ads Spy mạnh mẽ cho Marketer và Affiliate.',
    url: 'https://your-domain.com/',
    siteName: 'Ads Spy Tool',
    type: 'website',
    images: [
      {
        url: '/marketing-video-thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Ads Spy Tool – Ads Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ads Spy Tool – Advanced Ads Intelligence Platform',
    description:
      'Spy & phân tích quảng cáo Youtube, Affiliate Offers, Brands. Ads Spy Tool dành cho Marketer & Affiliate.',
    images: ['/marketing-video-thumbnail.png'],
  },
  alternates: {
    canonical: 'https://your-domain.com/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        {/* =========================
            FACEBOOK META PIXEL
        ========================= */}
        <Script id="facebook-pixel" strategy="afterInteractive">
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
        </noscript>
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
