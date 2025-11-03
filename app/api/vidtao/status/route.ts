import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'

// Hàm thêm CORS headers
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  return response
}

// OPTIONS handler cho preflight request
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 })
  return withCORS(res)
}

export async function GET(request: NextRequest) {
  try {
    // Get accounts status
    const accountsStatus = vidTaoManager.getAccountsStatus()
    
    return withCORS(NextResponse.json({
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
    }))
  } catch (error) {
    console.error('VidTao status API error:', error)
    return withCORS(NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    ))
  }
}