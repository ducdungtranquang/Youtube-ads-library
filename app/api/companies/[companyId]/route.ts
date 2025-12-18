import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const { companyId } = await params;

  try {

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Call VidTao API for company details
    const companyDetails = await vidTaoManager.getCompanyDetails(companyId)

    return NextResponse.json(companyDetails)
  } catch (error: any) {
    console.error('Error fetching company details:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch company details',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
