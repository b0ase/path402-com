import { NextResponse } from 'next/server';
import { getCapTable, getTokenStats } from '@/lib/store';

export async function GET() {
  try {
    const capTable = getCapTable();
    const stats = getTokenStats();

    return NextResponse.json({
      holders: capTable,
      stats: {
        totalHolders: stats.totalHolders,
        totalCirculating: stats.totalCirculating,
        totalStaked: stats.totalStaked,
        treasuryBalance: stats.treasuryBalance,
      },
    });
  } catch (error) {
    console.error('Error getting cap table:', error);
    return NextResponse.json({ error: 'Failed to get cap table' }, { status: 500 });
  }
}
