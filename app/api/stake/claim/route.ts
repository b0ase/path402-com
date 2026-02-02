import { NextRequest, NextResponse } from 'next/server';
import { getHolder, claimDividends, getPendingDividends } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const address = request.headers.get('x-wallet-address');
    const handle = request.headers.get('x-wallet-handle');

    const holder = await getHolder(address || undefined, handle || undefined);

    if (!holder) {
      return NextResponse.json({ error: 'Wallet not connected or no tokens held' }, { status: 401 });
    }

    const pendingAmount = await getPendingDividends(holder.id);

    if (pendingAmount === 0) {
      return NextResponse.json({ error: 'No pending dividends to claim' }, { status: 400 });
    }

    const claimedAmount = await claimDividends(holder.id);

    return NextResponse.json({
      success: true,
      claimedAmount,
      message: `Successfully claimed ${claimedAmount} sats in dividends`,
    });
  } catch (error) {
    console.error('Error claiming dividends:', error);
    return NextResponse.json({ error: 'Claim failed' }, { status: 500 });
  }
}
