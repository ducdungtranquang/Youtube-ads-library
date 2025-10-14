import { NextRequest, NextResponse } from 'next/server'

// Mock data cho featured content
const featuredAds = [
  {
    id: 1,
    title: "Revolutionary Weight Loss Method That Actually Works",
    thumbnail: "/marketing-video-thumbnail.png",
    views: "2.1M",
    duration: "15:23",
    category: "Health & Fitness",
    ctr: "8.5%",
    description: "Discover the secret weight loss method that helped thousands lose 20+ pounds",
    url: "https://youtube.com/watch?v=example1",
    advertiser: "HealthTech Pro",
    country: "US",
    language: "English",
    dateFirst: "2024-10-01",
    performance: {
      engagement: "12.3%",
      shares: "2.4K",
      comments: "1.8K"
    }
  },
  {
    id: 2,
    title: "Make $5000/Month Online - Step by Step Course",
    thumbnail: "/email-marketing-concept.png",
    views: "1.8M",
    duration: "12:45",
    category: "Finance",
    ctr: "7.2%",
    description: "Complete online course showing how to make money from home",
    url: "https://youtube.com/watch?v=example2",
    advertiser: "MoneyMaker Academy",
    country: "US",
    language: "English",
    dateFirst: "2024-09-15",
    performance: {
      engagement: "10.8%",
      shares: "1.9K",
      comments: "3.2K"
    }
  },
  {
    id: 3,
    title: "Instagram Marketing Strategy 2025 - Get 100K Followers",
    thumbnail: "/instagram-marketing-concept.png",
    views: "950K",
    duration: "18:30",
    category: "Marketing",
    ctr: "6.8%",
    description: "Latest Instagram growth strategies that actually work in 2025",
    url: "https://youtube.com/watch?v=example3",
    advertiser: "Social Growth Co",
    country: "US",
    language: "English",
    dateFirst: "2024-09-28",
    performance: {
      engagement: "9.5%",
      shares: "890",
      comments: "2.1K"
    }
  },
  {
    id: 4,
    title: "Crypto Trading Masterclass - Turn $100 into $10,000",
    thumbnail: "/placeholder.jpg",
    views: "1.2M",
    duration: "22:15",
    category: "Finance",
    ctr: "9.1%",
    description: "Professional crypto trading course with proven strategies",
    url: "https://youtube.com/watch?v=example4",
    advertiser: "CryptoMaster Pro",
    country: "US",
    language: "English",
    dateFirst: "2024-10-05",
    performance: {
      engagement: "14.2%",
      shares: "3.1K",
      comments: "4.5K"
    }
  },
  {
    id: 5,
    title: "Amazon FBA Business - Start Your Empire Today",
    thumbnail: "/amazon-logo.png",
    views: "780K",
    duration: "16:40",
    category: "E-commerce",
    ctr: "5.9%",
    description: "Complete guide to starting a profitable Amazon FBA business",
    url: "https://youtube.com/watch?v=example5",
    advertiser: "FBA Success",
    country: "US",
    language: "English",
    dateFirst: "2024-09-20",
    performance: {
      engagement: "8.7%",
      shares: "650",
      comments: "1.3K"
    }
  }
]

const trendingCategories = [
  { name: "Health & Fitness", count: 3420, trend: "+15.2%" },
  { name: "Finance", count: 2890, trend: "+12.8%" },
  { name: "Marketing", count: 2156, trend: "+8.9%" },
  { name: "E-commerce", count: 1987, trend: "+6.3%" },
  { name: "Software", count: 1654, trend: "+4.1%" },
  { name: "Education", count: 1432, trend: "+9.7%" }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '6')
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'views' // views, ctr, recent

    let filteredAds = [...featuredAds]

    // Filter by category if specified
    if (category && category !== 'all') {
      filteredAds = filteredAds.filter(ad => 
        ad.category.toLowerCase().includes(category.toLowerCase())
      )
    }

    // Sort ads
    switch (sortBy) {
      case 'ctr':
        filteredAds.sort((a, b) => parseFloat(b.ctr) - parseFloat(a.ctr))
        break
      case 'recent':
        filteredAds.sort((a, b) => new Date(b.dateFirst).getTime() - new Date(a.dateFirst).getTime())
        break
      case 'views':
      default:
        filteredAds.sort((a, b) => {
          const aViews = parseFloat(a.views.replace(/[MK]/g, '')) * (a.views.includes('M') ? 1000000 : 1000)
          const bViews = parseFloat(b.views.replace(/[MK]/g, '')) * (b.views.includes('M') ? 1000000 : 1000)
          return bViews - aViews
        })
        break
    }

    // Apply limit
    const limitedAds = filteredAds.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        ads: limitedAds,
        categories: trendingCategories,
        total: limitedAds.length,
        filters: {
          category: category || 'all',
          sortBy,
          limit
        }
      },
      meta: {
        timestamp: Date.now(),
        source: 'featured-ads'
      }
    })

  } catch (error) {
    console.error('Featured ads API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}