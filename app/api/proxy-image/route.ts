import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache to avoid repeated requests
const imageCache = new Map<string, { data: ArrayBuffer; contentType: string; timestamp: number }>()
const CACHE_DURATION = 3600000 // 1 hour in milliseconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return new NextResponse('Missing image URL', { status: 400 })
    }

    // Validate that it's a YouTube image URL
    if (!imageUrl.includes('yt3.ggpht.com') && !imageUrl.includes('i.ytimg.com')) {
      return new NextResponse('Invalid image source', { status: 400 })
    }

    // Check cache first
    const cached = imageCache.get(imageUrl)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return new NextResponse(cached.data, {
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'Cross-Origin-Resource-Policy': 'cross-origin',
        },
      })
    }

    // Add delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50))

    // Fetch the image with proper headers and retry logic
    let response: Response
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        response = await fetch(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.youtube.com/',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Sec-Fetch-Dest': 'image',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site',
          },
          // Add timeout
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (response.ok) break

        if (response.status === 429) {
          // Rate limited, wait longer
          const waitTime = Math.pow(2, attempts) * 1000 + Math.random() * 1000
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
      } catch (error) {
        if (attempts === maxAttempts - 1) throw error
      }
      
      attempts++
    }

    if (!response!.ok) {
      console.warn(`Failed to fetch image: ${response!.status} for URL: ${imageUrl}`)
      return new NextResponse('Failed to fetch image', { status: response!.status })
    }

    const imageBuffer = await response!.arrayBuffer()
    const contentType = response!.headers.get('content-type') || 'image/jpeg'

    // Cache the result
    imageCache.set(imageUrl, {
      data: imageBuffer,
      contentType,
      timestamp: Date.now()
    })

    // Clean old cache entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean
      const now = Date.now()
      for (const [key, value] of imageCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          imageCache.delete(key)
        }
      }
    }

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    // Return a placeholder image instead of error
    return Response.redirect('/placeholder.svg')
  }
}