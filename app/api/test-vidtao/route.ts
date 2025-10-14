import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing VidTao integration...')
    
    // Get accounts status first
    const accountsStatus = vidTaoManager.getAccountsStatus()
    console.log('Accounts status:', accountsStatus)
    
    // Try a simple API call to test authentication
    const result = await vidTaoManager.makeRequest('/ads/search', {
      keyword: 'test',
      limit: 1
    })
    
    return NextResponse.json({
      success: true,
      accountsStatus,
      apiTest: result,
      message: 'VidTao integration test completed'
    })
    
  } catch (error) {
    console.error('VidTao test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      accountsStatus: vidTaoManager.getAccountsStatus()
    }, { 
      status: 500 
    })
  }
}