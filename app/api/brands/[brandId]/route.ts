import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const brandId = params.brandId

    if (!brandId) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      )
    }

    // Call VidTao API for brand details
    const brandDetails = await vidTaoManager.getBrandDetails(brandId)

    return NextResponse.json(brandDetails)
  } catch (error: any) {
    console.error('Error fetching brand details:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch brand details',
        details: error.message 
      },
      { status: 500 }
    )
  }
}