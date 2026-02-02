import { NextRequest, NextResponse } from 'next/server';
import { getHolder, stakeTokens, unstakeTokens } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const address = request.headers.get('x-wallet-address');
    const handle = request.headers.get('x-wallet-handle');

    const holder = getHolder(address || undefined, handle || undefined);

    if (!holder) {
      return NextResponse.json({ error: 'Wallet not connected or no tokens held' }, { status: 401 });
    }

    const body = await request.json();
    const { action, amount } = body;

    if (!action || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid action or amount' }, { status: 400 });
    }

    if (action === 'stake') {
      const availableBalance = holder.balance - holder.stakedBalance;
      if (amount > availableBalance) {
        return NextResponse.json({ error: 'Insufficient available balance' }, { status: 400 });
      }

      const stake = stakeTokens(holder.id, amount);
      if (!stake) {
        return NextResponse.json({ error: 'Staking failed' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        stakeId: stake.id,
        stakedAmount: amount,
        newStakedBalance: holder.stakedBalance,
      });
    } else if (action === 'unstake') {
      if (amount > holder.stakedBalance) {
        return NextResponse.json({ error: 'Insufficient staked balance' }, { status: 400 });
      }

      const success = unstakeTokens(holder.id, amount);
      if (!success) {
        return NextResponse.json({ error: 'Unstaking failed' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        unstakedAmount: amount,
        newStakedBalance: holder.stakedBalance,
      });
    }

    return NextResponse.json({ error: 'Invalid action. Use "stake" or "unstake"' }, { status: 400 });
  } catch (error) {
    console.error('Error processing stake action:', error);
    return NextResponse.json({ error: 'Stake action failed' }, { status: 500 });
  }
}
