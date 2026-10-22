import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao/manager'

// CORS helper
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  return response
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 })
  return withCORS(res)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandId: string }> | { brandId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const { brandId } = resolvedParams

    if (!brandId) {
      return withCORS(NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      ))
    }

    // Call VidTao API for brand details
    const brandDetails = await vidTaoManager.getBrandDetails(brandId)

    return withCORS(NextResponse.json(brandDetails))
  } catch (error: any) {
    console.error('Error fetching brand details:', error)
    
    return withCORS(NextResponse.json(
      { 
        error: 'Failed to fetch brand details',
        details: error.message 
      },
      { status: 500 }
    ))
  }
}