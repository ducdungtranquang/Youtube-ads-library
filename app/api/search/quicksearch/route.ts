export const runtime = "nodejs";
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { vidTaoManager } from '@/lib/vidtao-manager';
import { supabaseCacheManager, SearchPayload } from '@/lib/supabase-cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      page = 1,
      limit = 500,
      ...otherParams
    } = body;

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const searchPayload: SearchPayload = {
      query: query.trim(),
      page,
      limit,
      ...otherParams
    };

    console.log('QuickSearch API: Checking cache for payload:', searchPayload);

    // Check cache
    const cacheEntry = await supabaseCacheManager.getCacheEntry('quicksearch', searchPayload);

    if (cacheEntry && cacheEntry.status === 'completed') {
      console.log('QuickSearch API: Returning cached result');
      return NextResponse.json(cacheEntry.result_data);
    }

    console.log('QuickSearch API: No cache or not completed, running search...');

    // Direct execution with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // timeout 2 minutes

    try {
      const result = await vidTaoManager.quickSearch(searchPayload);
      clearTimeout(timeoutId);

      if (!result.success) {
        console.error('QuickSearch error:', result.error);
        await supabaseCacheManager.updateCacheEntry(
          cacheEntry?.id || '',
          'error',
          null,
          result.error || 'VidTao quick search failed'
        );
        return NextResponse.json(
          { error: result.error || 'VidTao quick search failed' },
          { status: 500 }
        );
      }

      console.log('QuickSearch API: Search successful, caching result...');

      const transformedResponse = {
        success: true,
        data: result.data,
        account: result.account
      };

      await supabaseCacheManager.updateCacheEntry(
        cacheEntry?.id || '',
        'completed',
        transformedResponse
      );

      console.log('QuickSearch API: Completed and cached');
      return NextResponse.json(transformedResponse);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('QuickSearch execution error:', error);
      return NextResponse.json(
        {
          error: 'Search execution failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('QuickSearch API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  );
}