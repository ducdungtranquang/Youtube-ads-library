import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'

export async function GET(request: NextRequest) {
  try {
    // Get accounts status
    const accountsStatus = vidTaoManager.getAccountsStatus()
    
    return NextResponse.json({
      success: true,
      data: {
        accounts: accountsStatus,
        summary: {
          total: accountsStatus.length,
          available: accountsStatus.filter(acc => !acc.isBlocked).length,
          blocked: accountsStatus.filter(acc => acc.isBlocked).length,
          withTokens: accountsStatus.filter(acc => acc.hasToken).length
        }
      }
    })
  } catch (error) {
    console.error('VidTao status API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}