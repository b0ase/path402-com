import { NextRequest, NextResponse } from 'next/server';

/**
 * Ephemeral in-memory signaling relay for WebRTC.
 * Messages auto-expire after 60s. No DB needed.
 *
 * POST /api/signal  — push a signal message
 *   body: { room, senderId, type, payload }
 *
 * GET  /api/signal?room=xxx&senderId=yyy&since=ts
 *   — poll for new messages (excludes own senderId)
 */

interface SignalRecord {
  room: string;
  senderId: string;
  type: string;
  payload: unknown;
  ts: number;
}

const rooms = new Map<string, SignalRecord[]>();
const TTL = 60_000; // 60s

function gc() {
  const cutoff = Date.now() - TTL;
  for (const [room, msgs] of rooms) {
    const filtered = msgs.filter((m) => m.ts > cutoff);
    if (filtered.length === 0) rooms.delete(room);
    else rooms.set(room, filtered);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { room, senderId, type, payload } = body;

  if (!room || !senderId || !type) {
    return NextResponse.json({ error: 'room, senderId, type required' }, { status: 400 });
  }

  const record: SignalRecord = { room, senderId, type, payload, ts: Date.now() };
  const list = rooms.get(room) || [];
  list.push(record);
  rooms.set(room, list);

  // GC every write
  gc();

  return NextResponse.json({ ok: true, ts: record.ts });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const room = searchParams.get('room');
  const senderId = searchParams.get('senderId');
  const since = Number(searchParams.get('since') || '0');

  if (!room || !senderId) {
    return NextResponse.json({ error: 'room and senderId required' }, { status: 400 });
  }

  gc();

  const list = rooms.get(room) || [];
  const messages = list.filter((m) => m.senderId !== senderId && m.ts > since);

  return NextResponse.json({ messages, ts: Date.now() });
}
