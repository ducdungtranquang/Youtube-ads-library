import { NextRequest, NextResponse } from 'next/server';
import { vidTaoManager } from '@/lib/vidtao-manager';

export async function GET(req: NextRequest, { params }: { params: { brandId: string } }) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  try {
    const result = await vidTaoManager.makeRequest(
      `/api/brands/${params.brandId}/videos`,
      {
        page,
        limit,
        sort: 'total',
        orderAsc: false,
        keyword: '',
        encryptedId: ''
      }
    );
    return NextResponse.json(result.data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch from VidTao', details: e instanceof Error ? e.message : e }, { status: 500 });
  }
}
