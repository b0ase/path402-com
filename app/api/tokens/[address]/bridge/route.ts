import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/tokens';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

/**
 * POST /api/tokens/[address]/bridge
 *
 * Record revenue from an external source (e.g., DNS-DEX dividend).
 * Creates a token_transaction with tx_type = 'acquire' and from_handle = bridge source.
 *
 * Body: { source: "dns-dex", amount_sats: 5000, tx_id?: "abc123", metadata?: {} }
 * Auth: x-bridge-secret header must match BRIDGE_SECRET env var
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const decodedAddress = decodeURIComponent(address);

  // Auth: require bridge secret
  const secret = request.headers.get('x-bridge-secret');
  if (!secret || secret !== process.env.BRIDGE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { source, amount_sats, tx_id, metadata } = body;

  if (!source || !amount_sats || amount_sats <= 0) {
    return NextResponse.json({ error: 'source and positive amount_sats required' }, { status: 400 });
  }

  // Verify token exists and has this linked source
  const token = await getToken(decodedAddress);
  if (!token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 });
  }

  // Record bridge revenue as a transaction
  const { error } = await getSupabase()
    .from('token_transactions')
    .insert({
      token_address: decodedAddress,
      from_handle: `bridge:${source}`,
      to_handle: token.issuer_handle,
      tx_type: 'acquire',
      amount: 0,
      price_sats: amount_sats,
      unit_price_sats: 0,
      issuer_revenue_sats: amount_sats,
      facilitator_revenue_sats: 0,
      payment_tx_id: tx_id || null,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If token has a parent, cascade revenue up
  if (token.parent_address) {
    const parentShareBps = token.parent_share_bps ?? 5000;
    const parentRevenue = Math.floor(amount_sats * parentShareBps / 10000);
    if (parentRevenue > 0) {
      const parent = await getToken(token.parent_address);
      if (parent) {
        await getSupabase()
          .from('token_transactions')
          .insert({
            token_address: token.parent_address,
            from_handle: `bridge:${source}:${decodedAddress}`,
            to_handle: parent.issuer_handle,
            tx_type: 'acquire',
            amount: 0,
            price_sats: parentRevenue,
            unit_price_sats: 0,
            issuer_revenue_sats: parentRevenue,
            facilitator_revenue_sats: 0,
          });
      }
    }
  }

  return NextResponse.json({
    success: true,
    token_address: decodedAddress,
    source,
    amount_sats,
    cascaded: !!token.parent_address,
  });
}
