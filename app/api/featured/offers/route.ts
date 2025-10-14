import { NextRequest, NextResponse } from 'next/server'

// Mock data cho featured offers
const featuredOffers = [
  {
    id: 1,
    name: "ClickFunnels 2.0 Pro",
    payout: "$127",
    network: "ClickBank",
    category: "Software",
    conversion: "12.5%",
    thumbnail: "/placeholder.jpg",
    description: "All-in-one marketing platform for building sales funnels",
    url: "https://clickfunnels.com/affiliate",
    commission: "$127 per sale",
    cookieLife: "60 days",
    country: "US",
    language: "English",
    requirements: "Website or social media following",
    performance: {
      epc: "$3.45",
      refundRate: "8.2%",
      avgOrderValue: "$97"
    },
    materials: {
      banners: 15,
      emails: 8,
      videos: 3
    }
  },
  {
    id: 2,
    name: "Chase Sapphire Reserve Card",
    payout: "$250",
    network: "CJ Affiliate",
    category: "Finance",
    conversion: "8.3%",
    thumbnail: "/placeholder.jpg",
    description: "Premium credit card with exclusive travel rewards",
    url: "https://creditcards.chase.com/affiliate",
    commission: "$250 per approval",
    cookieLife: "30 days",
    country: "US",
    language: "English",
    requirements: "Finance content, 18+ traffic",
    performance: {
      epc: "$8.90",
      refundRate: "2.1%",
      avgOrderValue: "$95"
    },
    materials: {
      banners: 12,
      emails: 5,
      videos: 2
    }
  },
  {
    id: 3,
    name: "Shopify Plus Enterprise",
    payout: "$150",
    network: "Impact",
    category: "E-commerce",
    conversion: "15.2%",
    thumbnail: "/placeholder.jpg",
    description: "Enterprise e-commerce platform for scaling businesses",
    url: "https://shopify.com/partners",
    commission: "$150 per signup",
    cookieLife: "90 days",
    country: "Global",
    language: "Multiple",
    requirements: "E-commerce audience",
    performance: {
      epc: "$4.25",
      refundRate: "5.8%",
      avgOrderValue: "$29/month"
    },
    materials: {
      banners: 20,
      emails: 12,
      videos: 5
    }
  },
  {
    id: 4,
    name: "Wealthy Affiliate Training",
    payout: "$175",
    network: "Direct",
    category: "Education",
    conversion: "18.7%",
    thumbnail: "/placeholder.jpg",
    description: "Complete affiliate marketing training platform",
    url: "https://wealthyaffiliate.com/affiliate",
    commission: "$175 per sale",
    cookieLife: "365 days",
    country: "Global",
    language: "English",
    requirements: "Marketing/business content",
    performance: {
      epc: "$6.80",
      refundRate: "12.3%",
      avgOrderValue: "$59/month"
    },
    materials: {
      banners: 18,
      emails: 15,
      videos: 8
    }
  },
  {
    id: 5,
    name: "Semrush Pro Suite",
    payout: "$200",
    network: "BeRush",
    category: "Software",
    conversion: "22.1%",
    thumbnail: "/placeholder.jpg",
    description: "All-in-one SEO and digital marketing toolkit",
    url: "https://semrush.com/affiliate",
    commission: "$200 per subscription",
    cookieLife: "120 days",
    country: "Global",
    language: "Multiple",
    requirements: "SEO/Marketing content",
    performance: {
      epc: "$9.15",
      refundRate: "6.7%",
      avgOrderValue: "$119.95/month"
    },
    materials: {
      banners: 25,
      emails: 10,
      videos: 6
    }
  },
  {
    id: 6,
    name: "NordVPN Premium",
    payout: "$85",
    network: "CJ Affiliate",
    category: "Software",
    conversion: "28.5%",
    thumbnail: "/placeholder.jpg",
    description: "Premium VPN service with military-grade encryption",
    url: "https://nordvpn.com/affiliate",
    commission: "$85 per sale",
    cookieLife: "30 days",
    country: "Global",
    language: "Multiple",
    requirements: "Tech/privacy content",
    performance: {
      epc: "$2.95",
      refundRate: "9.8%",
      avgOrderValue: "$11.95/month"
    },
    materials: {
      banners: 22,
      emails: 8,
      videos: 4
    }
  }
]

const trendingNetworks = [
  { name: "ClickBank", count: 450, avgPayout: "$127", trend: "+8.5%" },
  { name: "CJ Affiliate", count: 380, avgPayout: "$156", trend: "+12.3%" },
  { name: "MaxBounty", count: 320, avgPayout: "$89", trend: "+6.7%" },
  { name: "Impact", count: 280, avgPayout: "$134", trend: "+15.2%" },
  { name: "ShareASale", count: 245, avgPayout: "$67", trend: "+4.1%" },
  { name: "Direct", count: 190, avgPayout: "$198", trend: "+22.8%" }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '6')
    const category = searchParams.get('category')
    const network = searchParams.get('network')
    const minPayout = parseFloat(searchParams.get('minPayout') || '0')
    const maxPayout = parseFloat(searchParams.get('maxPayout') || '999999')
    const sortBy = searchParams.get('sortBy') || 'payout' // payout, conversion, epc

    let filteredOffers = [...featuredOffers]

    // Filter by category
    if (category && category !== 'all') {
      filteredOffers = filteredOffers.filter(offer => 
        offer.category.toLowerCase().includes(category.toLowerCase())
      )
    }

    // Filter by network
    if (network && network !== 'all') {
      filteredOffers = filteredOffers.filter(offer => 
        offer.network.toLowerCase().includes(network.toLowerCase())
      )
    }

    // Filter by payout range
    filteredOffers = filteredOffers.filter(offer => {
      const payout = parseFloat(offer.payout.replace(/[$,]/g, ''))
      return payout >= minPayout && payout <= maxPayout
    })

    // Sort offers
    switch (sortBy) {
      case 'conversion':
        filteredOffers.sort((a, b) => parseFloat(b.conversion) - parseFloat(a.conversion))
        break
      case 'epc':
        filteredOffers.sort((a, b) => 
          parseFloat(b.performance.epc.replace('$', '')) - parseFloat(a.performance.epc.replace('$', ''))
        )
        break
      case 'payout':
      default:
        filteredOffers.sort((a, b) => 
          parseFloat(b.payout.replace(/[$,]/g, '')) - parseFloat(a.payout.replace(/[$,]/g, ''))
        )
        break
    }

    // Apply limit
    const limitedOffers = filteredOffers.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        offers: limitedOffers,
        networks: trendingNetworks,
        total: limitedOffers.length,
        filters: {
          category: category || 'all',
          network: network || 'all',
          minPayout,
          maxPayout,
          sortBy,
          limit
        }
      },
      meta: {
        timestamp: Date.now(),
        source: 'featured-offers'
      }
    })

  } catch (error) {
    console.error('Featured offers API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}