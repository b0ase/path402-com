import { NextRequest, NextResponse } from 'next/server';
import { getHolder, getPendingDividends, getTotalDividendsEarned } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    // Check headers first (for Yours wallet)
    let address = request.headers.get('x-wallet-address');
    let handle = request.headers.get('x-wallet-handle');

    // Then check cookies (for HandCash)
    if (!address && !handle) {
      handle = request.cookies.get('hc_handle')?.value || null;
    }

    const holder = await getHolder(address || undefined, handle || undefined);

    if (!holder) {
      return NextResponse.json({
        balance: 0,
        stakedBalance: 0,
        availableBalance: 0,
        pendingDividends: 0,
        totalDividendsEarned: 0,
      });
    }

    return NextResponse.json({
      balance: holder.balance,
      stakedBalance: holder.stakedBalance,
      availableBalance: holder.balance - holder.stakedBalance,
      pendingDividends: await getPendingDividends(holder.id),
      totalDividendsEarned: await getTotalDividendsEarned(holder.id),
    });
  } catch (error) {
    console.error('Error getting holding:', error);
    return NextResponse.json({ error: 'Failed to get holding' }, { status: 500 });
  }
}
