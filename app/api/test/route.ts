import { NextRequest, NextResponse } from 'next/server'

// Simple public test endpoint (no auth).
// - GET: returns { success: true, message: 'pong' }
// - POST: echoes back a short summary of the body
// - OPTIONS: returns 204 for preflight

function jsonResponse(payload: any, status = 200) {
  const res = NextResponse.json(payload, { status })
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return res
}

export async function OPTIONS() {
  return jsonResponse(null, 204)
}

export async function GET(request: NextRequest) {
  try {
    // Log some request info for debugging
    const headers = Object.fromEntries(request.headers.entries())
    console.log('[api/test] GET ping', { time: new Date().toISOString(), headers })

    return jsonResponse({ success: true, message: 'pong', method: 'GET', timestamp: Date.now() })
  } catch (err) {
    console.error('[api/test] GET error', err)
    return jsonResponse({ success: false, error: 'Internal error' }, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const headers = Object.fromEntries(request.headers.entries())
    let body: any = null
    try {
      body = await request.json()
    } catch (e) {
      // not a JSON body
      body = null
    }

    console.log('[api/test] POST received', {
      time: new Date().toISOString(),
      headers,
      bodyPreview: body && typeof body === 'object' ? Object.keys(body).slice(0,10) : body
    })

    return jsonResponse({ success: true, message: 'pong', method: 'POST', received: !!body })
  } catch (err) {
    console.error('[api/test] POST error', err)
    return jsonResponse({ success: false, error: 'Internal error' }, 500)
  }
}
