import { NextRequest, NextResponse } from 'next/server';
import { getHolder } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const address = request.headers.get('x-wallet-address');
    const handle = request.headers.get('x-wallet-handle');
    const provider = request.headers.get('x-wallet-provider');

    const holder = getHolder(address || undefined, handle || undefined);

    if (!holder) {
      return NextResponse.json({ error: 'Wallet not connected or no tokens held' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, destinationAddress } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!destinationAddress) {
      return NextResponse.json({ error: 'Destination address required' }, { status: 400 });
    }

    const availableBalance = holder.balance - holder.stakedBalance;
    if (amount > availableBalance) {
      return NextResponse.json({
        error: 'Insufficient available balance. Unstake tokens first if needed.',
        availableBalance,
        requestedAmount: amount,
      }, { status: 400 });
    }

    // TODO: Implement actual BSV-20 token transfer
    // This would involve:
    // 1. Creating a BSV transaction
    // 2. Transferring the ordinals/inscriptions to the destination address
    // 3. Updating the holder's balance in our database
    // 4. Recording the withdrawal transaction

    // For now, return a placeholder response
    return NextResponse.json({
      success: false,
      message: 'Token withdrawals are coming soon. Your tokens are safe in your account.',
      note: 'On-chain BSV-20 token transfers require inscription-based transfers which are being implemented.',
      availableBalance,
      requestedAmount: amount,
      destinationAddress,
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json({ error: 'Withdrawal failed' }, { status: 500 });
  }
}
