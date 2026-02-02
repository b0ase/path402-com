import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateHolder, createPurchase, processPurchaseImmediate, getTokenStats, PAYMENT_ADDRESS } from '@/lib/store';

// sqrt_decay pricing: price = BASE / sqrt(supply_sold + 1)
// Early buyers pay more, price decreases as more tokens are sold
const BASE_PRICE_SATS = 100_000_000; // 1 BSV for first token (~$17)
const INITIAL_TREASURY = 500_000_000; // 500M for sale

function calculateSqrtDecayPrice(supplySold: number): number {
  // price = base / sqrt(supply_sold + 1)
  return Math.ceil(BASE_PRICE_SATS / Math.sqrt(supplySold + 1));
}

function calculateTotalCost(currentSupplySold: number, amount: number): { totalSats: number; avgPrice: number } {
  // For bulk purchases, integrate the price curve
  // Sum of prices from supply_sold to supply_sold + amount
  let totalSats = 0;
  for (let i = 0; i < amount; i++) {
    totalSats += calculateSqrtDecayPrice(currentSupplySold + i);
  }
  return {
    totalSats,
    avgPrice: Math.ceil(totalSats / amount),
  };
}

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
    const stats = await getTokenStats();
    if (stats.treasuryBalance < amount) {
      return NextResponse.json({ error: 'Insufficient tokens available' }, { status: 400 });
    }

    // Calculate supply sold and price using sqrt_decay
    const supplySold = INITIAL_TREASURY - stats.treasuryBalance;
    const currentPrice = calculateSqrtDecayPrice(supplySold);
    const { totalSats, avgPrice } = calculateTotalCost(supplySold, amount);

    // Get or create holder
    const holder = await getOrCreateHolder(
      address || '',
      provider,
      address || undefined,
      handle || undefined
    );

    if (provider === 'yours') {
      // For Yours Wallet, create pending purchase and return payment details
      const purchase = await createPurchase(holder.id, amount, avgPrice);

      return NextResponse.json({
        purchaseId: purchase.id,
        amount,
        pricingModel: 'sqrt_decay',
        currentPrice,
        avgPrice,
        totalSats,
        supplySold,
        paymentAddress: PAYMENT_ADDRESS,
        status: 'pending_payment',
      });
    } else if (provider === 'handcash') {
      // For HandCash, the payment was already made via their flow
      // This is called after successful HandCash payment
      const purchase = await processPurchaseImmediate(holder.id, amount, avgPrice);

      return NextResponse.json({
        purchaseId: purchase.id,
        amount,
        pricingModel: 'sqrt_decay',
        currentPrice,
        avgPrice,
        totalSats,
        supplySold,
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
