import { NextRequest, NextResponse } from 'next/server';
import { getHoldings } from '@/lib/tokens';

/**
 * POST /api/rooms/join — Token gate check for broadcast viewers.
 *
 * Requires x-wallet-handle + x-wallet-provider headers.
 * Returns 402 if viewer doesn't hold the required token.
 */

// Access the rooms map from the parent route module.
// Since Next.js serverless functions may share memory within the same instance,
// we re-fetch the room list via internal fetch to stay consistent.

export async function POST(req: NextRequest) {
  const handle = req.headers.get('x-wallet-handle');
  const provider = req.headers.get('x-wallet-provider');

  if (!handle || !provider) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await req.json();
  const { roomId } = body;

  if (!roomId) {
    return NextResponse.json({ error: 'roomId required' }, { status: 400 });
  }

  // Fetch current rooms from the rooms endpoint
  const origin = req.headers.get('x-forwarded-host')
    ? `${req.headers.get('x-forwarded-proto') || 'https'}://${req.headers.get('x-forwarded-host')}`
    : req.nextUrl.origin;

  const roomsRes = await fetch(`${origin}/api/rooms`, { cache: 'no-store' });
  const roomsData = await roomsRes.json();
  const room = roomsData.rooms?.find((r: { id: string }) => r.id === roomId);

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  // Check if viewer holds the required token
  const holdings = await getHoldings(handle);
  const holding = holdings.find((h) => h.token_address === room.tokenAddress);

  if (!holding || holding.balance <= 0) {
    return NextResponse.json(
      {
        error: 'Token required',
        tokenAddress: room.tokenAddress,
        tokenName: room.tokenName,
        message: `You need to hold ${room.tokenName} tokens to watch this broadcast`,
      },
      { status: 402 }
    );
  }

  return NextResponse.json({
    allowed: true,
    room,
    balance: holding.balance,
  });
}
