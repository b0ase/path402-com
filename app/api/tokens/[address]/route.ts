import { NextRequest, NextResponse } from 'next/server';
import { getToken, acquireTokens, generatePriceSchedule, PricingModel } from '@/lib/tokens';

/**
 * GET /api/tokens/[address]
 *
 * Get token details including price schedule
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address: encodedAddress } = await params;
    // Decode the address ($ becomes %24 in URLs)
    const address = decodeURIComponent(encodedAddress);

    const token = await getToken(address);

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    // Generate price schedule
    const priceSchedule = generatePriceSchedule(
      token.pricing_model as PricingModel,
      token.base_price_sats,
      500_000_000 // Initial treasury
    );

    return NextResponse.json({
      token,
      price_schedule: priceSchedule,
    });
  } catch (error) {
    console.error('[/api/tokens/[address] GET] Error:', error);
    return NextResponse.json({ error: 'Failed to get token' }, { status: 500 });
  }
}

/**
 * POST /api/tokens/[address]
 *
 * Acquire tokens
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address: encodedAddress } = await params;
    const address = decodeURIComponent(encodedAddress);

    // Get buyer from auth headers
    const buyerHandle = request.headers.get('x-wallet-handle');
    const provider = request.headers.get('x-wallet-provider');

    if (!buyerHandle || !provider) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, spend_sats } = body;

    if (!amount && !spend_sats) {
      return NextResponse.json({ error: 'Specify amount or spend_sats' }, { status: 400 });
    }

    // TODO: Process actual payment via HandCash
    // For now, just update the database

    const result = await acquireTokens(address, buyerHandle, {
      amount: amount ? parseInt(amount) : undefined,
      spendSats: spend_sats ? parseInt(spend_sats) : undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[/api/tokens/[address] POST] Error:', error);
    return NextResponse.json({ error: 'Failed to acquire tokens' }, { status: 500 });
  }
}
