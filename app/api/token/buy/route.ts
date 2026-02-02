import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateHolder, createPurchase, processPurchaseImmediate, getTokenStats, PAYMENT_ADDRESS } from '@/lib/store';

const TOKEN_PRICE_SATS = 1; // 1 sat per token

export async function POST(request: NextRequest) {
  try {
    const address = request.headers.get('x-wallet-address');
    const provider = request.headers.get('x-wallet-provider') as 'yours' | 'handcash';
    const handle = request.headers.get('x-wallet-handle');

    if (!provider) {
      return NextResponse.json({ error: 'Wallet not connected' }, { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Check treasury has enough tokens
    const stats = getTokenStats();
    if (stats.treasuryBalance < amount) {
      return NextResponse.json({ error: 'Insufficient tokens available' }, { status: 400 });
    }

    const totalSats = amount * TOKEN_PRICE_SATS;

    // Get or create holder
    const holder = getOrCreateHolder(
      address || '',
      provider,
      address || undefined,
      handle || undefined
    );

    if (provider === 'yours') {
      // For Yours Wallet, create pending purchase and return payment details
      const purchase = createPurchase(holder.id, amount, TOKEN_PRICE_SATS);

      return NextResponse.json({
        purchaseId: purchase.id,
        amount,
        priceSats: TOKEN_PRICE_SATS,
        totalSats,
        paymentAddress: PAYMENT_ADDRESS,
        status: 'pending_payment',
      });
    } else if (provider === 'handcash') {
      // For HandCash, the payment was already made via their flow
      // This is called after successful HandCash payment
      const purchase = processPurchaseImmediate(holder.id, amount, TOKEN_PRICE_SATS);

      return NextResponse.json({
        purchaseId: purchase.id,
        amount,
        totalSats,
        status: 'confirmed',
        newBalance: holder.balance,
      });
    }

    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  } catch (error) {
    console.error('Error processing purchase:', error);
    return NextResponse.json({ error: 'Purchase failed' }, { status: 500 });
  }
}
