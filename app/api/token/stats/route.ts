import { NextResponse } from 'next/server';
import { getTokenStats } from '@/lib/store';

export async function GET() {
  try {
    const stats = await getTokenStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting token stats:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}
