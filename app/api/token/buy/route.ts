import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateHolder, createPurchase, processPurchaseImmediate, getTokenStats, TREASURY_PAYMAIL, PAYMENT_ADDRESS } from '@/lib/store';
import { getInstance, Connect } from '@handcash/sdk';

// sqrt_decay pricing: price = BASE / sqrt(remaining + 1)
// Price INCREASES as treasury depletes - rewards early buyers
const BASE_PRICE_SATS = 223_610; // ~10 sats/token at 500M treasury, 1 BSV = 1% of supply
const INITIAL_TREASURY = 500_000_000; // 500M for sale

function calculateSqrtDecayPrice(treasuryRemaining: number): number {
  // price = base / sqrt(remaining + 1)
  // When 500M remain: price = 100M / sqrt(500M) ≈ 141 sats (cheap!)
  // When 1 remains: price = 100M / sqrt(2) ≈ 70M sats (expensive!)
  return Math.ceil(BASE_PRICE_SATS / Math.sqrt(treasuryRemaining + 1));
}

function calculateTotalCost(treasuryRemaining: number, amount: number): { totalSats: number; avgPrice: number } {
  // For bulk purchases, integrate the price curve
  // Each token purchased reduces treasury, increasing price for next
  let totalSats = 0;
  for (let i = 0; i < amount; i++) {
    // Treasury shrinks by 1 for each token bought
    totalSats += calculateSqrtDecayPrice(treasuryRemaining - i);
  }
  return {
    totalSats,
    avgPrice: Math.ceil(totalSats / amount),
  };
}

// Reverse calculation: given spend amount, calculate how many tokens you get
// Buys cheapest tokens first (highest treasury remaining = lowest price)
function calculateTokensForSpend(treasuryRemaining: number, spendSats: number): {
  tokenCount: number;
  totalCost: number;
  avgPrice: number;
  remainingSats: number;
} {
  let tokenCount = 0;
  let totalCost = 0;

  while (treasuryRemaining - tokenCount > 0) {
    const nextTokenPrice = calculateSqrtDecayPrice(treasuryRemaining - tokenCount);
    if (totalCost + nextTokenPrice > spendSats) {
      break; // Can't afford the next token
    }
    totalCost += nextTokenPrice;
    tokenCount++;
  }

  return {
    tokenCount,
    totalCost,
    avgPrice: tokenCount > 0 ? Math.ceil(totalCost / tokenCount) : 0,
    remainingSats: spendSats - totalCost,
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
    const { amount, spendSats } = body;

    // Get current treasury state
    const stats = await getTokenStats();
    const treasuryRemaining = stats.treasuryBalance;
    const currentPrice = calculateSqrtDecayPrice(treasuryRemaining);

    let tokenAmount: number;
    let totalSats: number;
    let avgPrice: number;

    if (spendSats && spendSats > 0) {
      // New mode: user specifies how much to spend, we calculate tokens
      const result = calculateTokensForSpend(treasuryRemaining, spendSats);
      if (result.tokenCount === 0) {
        return NextResponse.json({
          error: 'Insufficient funds',
          details: `Minimum purchase at current price is ${currentPrice.toLocaleString()} sats for 1 token`,
          currentPrice,
        }, { status: 400 });
      }
      tokenAmount = result.tokenCount;
      totalSats = result.totalCost;
      avgPrice = result.avgPrice;
    } else if (amount && amount > 0) {
      // Old mode: user specifies token count, we calculate cost
      tokenAmount = amount;
      const costResult = calculateTotalCost(treasuryRemaining, amount);
      totalSats = costResult.totalSats;
      avgPrice = costResult.avgPrice;
    } else {
      return NextResponse.json({ error: 'Specify either amount (tokens) or spendSats' }, { status: 400 });
    }

    // Check treasury has enough tokens
    if (stats.treasuryBalance < tokenAmount) {
      return NextResponse.json({ error: 'Insufficient tokens available' }, { status: 400 });
    }

    // Get or create holder
    const holder = await getOrCreateHolder(
      address || '',
      provider,
      address || undefined,
      handle || undefined
    );

    if (provider === 'yours') {
      // For Yours Wallet, create pending purchase and return payment details
      const purchase = await createPurchase(holder.id, tokenAmount, avgPrice);

      return NextResponse.json({
        purchaseId: purchase.id,
        amount: tokenAmount,
        pricingModel: 'sqrt_decay',
        currentPrice,
        avgPrice,
        totalSats,
        treasuryRemaining,
        paymentAddress: PAYMENT_ADDRESS,
        status: 'pending_payment',
      });
    } else if (provider === 'handcash') {
      // For HandCash, we need to initiate payment using the SDK
      const authToken = request.cookies.get('hc_token')?.value;

      if (!authToken) {
        return NextResponse.json({ error: 'HandCash session expired, please reconnect' }, { status: 401 });
      }

      const appId = process.env.HANDCASH_APP_ID?.trim();
      const appSecret = process.env.HANDCASH_APP_SECRET?.trim();

      if (!appId || !appSecret) {
        return NextResponse.json({ error: 'HandCash not configured' }, { status: 500 });
      }

      // Initialize HandCash SDK and make payment
      const sdk = getInstance({ appId, appSecret });
      const client = sdk.getAccountClient(authToken);

      // Convert sats to USD for HandCash payment
      // BSV ~= $17, so sats to USD = sats * 17 / 100_000_000
      // Round to 2 decimal places (cents) for clean payment
      const BSV_PRICE_USD = 17;
      const usdAmount = Math.max(0.01, Math.round((totalSats * BSV_PRICE_USD) / 1_000_000) / 100);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const paymentResult = await Connect.pay({
          client: client as any,
          body: {
            instrumentCurrencyCode: 'BSV',
            denominationCurrencyCode: 'USD',
            receivers: [{
              sendAmount: usdAmount,
              destination: TREASURY_PAYMAIL, // HandCash paymail, not raw address
            }],
            note: `PATH402 token purchase: ${tokenAmount} tokens`,
          }
        });

        if (paymentResult.error) {
          console.error('HandCash payment failed:', paymentResult.error);
          return NextResponse.json({
            error: 'Payment failed',
            details: typeof paymentResult.error === 'string' ? paymentResult.error : JSON.stringify(paymentResult.error)
          }, { status: 400 });
        }

        // Payment succeeded, credit tokens in database
        const purchase = await processPurchaseImmediate(holder.id, tokenAmount, avgPrice);

        // Tokens are credited to database immediately
        // On-chain BSV-20 transfer happens via separate withdrawal flow
        // User must first derive their ordinals address in Account settings

        return NextResponse.json({
          purchaseId: purchase.id,
          amount: tokenAmount,
          pricingModel: 'sqrt_decay',
          currentPrice,
          avgPrice,
          totalSats,
          treasuryRemaining,
          status: 'confirmed',
          txId: paymentResult.data?.transactionId,
          newBalance: holder.balance + tokenAmount,
          note: 'Tokens credited to your account. Withdraw to your ordinals address from Account page.',
        });
      } catch (paymentError) {
        console.error('HandCash payment exception:', paymentError);
        return NextResponse.json({
          error: 'Payment failed',
          details: paymentError instanceof Error ? paymentError.message : 'Unknown error'
        }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  } catch (error) {
    console.error('Error processing purchase:', error);
    return NextResponse.json({ error: 'Purchase failed' }, { status: 500 });
  }
}
