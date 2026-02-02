import { NextRequest, NextResponse } from 'next/server';
import { getHolder, getPendingDividends, getTotalDividendsEarned } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const address = request.headers.get('x-wallet-address');
    const provider = request.headers.get('x-wallet-provider');
    const handle = request.headers.get('x-wallet-handle');

    const holder = getHolder(address || undefined, handle || undefined);

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
      pendingDividends: getPendingDividends(holder.id),
      totalDividendsEarned: getTotalDividendsEarned(holder.id),
    });
  } catch (error) {
    console.error('Error getting holding:', error);
    return NextResponse.json({ error: 'Failed to get holding' }, { status: 500 });
  }
}
