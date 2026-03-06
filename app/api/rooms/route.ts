import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/tokens';

/**
 * Broadcast room management — in-memory (same pattern as signal relay).
 *
 * GET    /api/rooms          — list active rooms (public)
 * POST   /api/rooms          — create room (auth required)
 * PATCH  /api/rooms          — keepalive + viewer count update
 * DELETE /api/rooms          — end room
 */

interface BroadcastRoom {
  id: string;
  creatorId: string;
  creatorHandle: string;
  tokenAddress: string;
  tokenName: string;
  viewerCount: number;
  createdAt: number;
  lastPing: number;
}

const rooms = new Map<string, BroadcastRoom>();
const ROOM_TTL = 120_000; // 120s — no ping = auto-remove

function gc() {
  const cutoff = Date.now() - ROOM_TTL;
  for (const [id, room] of rooms) {
    if (room.lastPing < cutoff) rooms.delete(id);
  }
}

export async function GET() {
  gc();

  const list = Array.from(rooms.values()).map((r) => ({
    id: r.id,
    creatorHandle: r.creatorHandle,
    tokenAddress: r.tokenAddress,
    tokenName: r.tokenName,
    viewerCount: r.viewerCount,
    createdAt: r.createdAt,
  }));

  return NextResponse.json({ rooms: list, ts: Date.now() });
}

export async function POST(req: NextRequest) {
  const handle = req.headers.get('x-wallet-handle');
  if (!handle) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await req.json();
  const { roomId, creatorId, tokenAddress, tokenName } = body;

  if (!roomId || !creatorId || !tokenAddress) {
    return NextResponse.json({ error: 'roomId, creatorId, tokenAddress required' }, { status: 400 });
  }

  // Validate token exists
  const token = await getToken(tokenAddress);
  if (!token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 });
  }

  const room: BroadcastRoom = {
    id: roomId,
    creatorId,
    creatorHandle: handle,
    tokenAddress,
    tokenName: tokenName || token.name || tokenAddress,
    viewerCount: 0,
    createdAt: Date.now(),
    lastPing: Date.now(),
  };

  rooms.set(roomId, room);
  gc();

  return NextResponse.json({ ok: true, room });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { roomId, creatorId, viewerCount } = body;

  if (!roomId || !creatorId) {
    return NextResponse.json({ error: 'roomId, creatorId required' }, { status: 400 });
  }

  const room = rooms.get(roomId);
  if (!room || room.creatorId !== creatorId) {
    return NextResponse.json({ error: 'Room not found or not owner' }, { status: 404 });
  }

  room.lastPing = Date.now();
  if (typeof viewerCount === 'number') {
    room.viewerCount = viewerCount;
  }

  gc();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { roomId, creatorId } = body;

  if (!roomId || !creatorId) {
    return NextResponse.json({ error: 'roomId, creatorId required' }, { status: 400 });
  }

  const room = rooms.get(roomId);
  if (room && room.creatorId === creatorId) {
    rooms.delete(roomId);
  }

  gc();
  return NextResponse.json({ ok: true });
}
