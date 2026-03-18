import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import type { ChatMessage } from '../../../../lib/types';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase credentials missing');
  }

  return createClient(url, key);
}

function getHandleFromRequest(req: NextRequest): string {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/hc_handle=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : 'anonymous';
}

export async function POST(req: NextRequest) {
  try {
    const handle = getHandleFromRequest(req);
    if (!handle || handle === 'anonymous') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { room_id, messages } = body as {
      room_id: string;
      messages: ChatMessage[];
    };

    if (!room_id || !messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Insert messages into database
    const rows = messages.map((msg) => ({
      room_id,
      sender_handle: msg.sender,
      content: msg.text,
    }));

    const { error } = await supabase
      .from('chat_messages')
      .insert(rows);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, count: messages.length });
  } catch (error) {
    console.error('POST /api/chat/messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const handle = getHandleFromRequest(req);
    if (!handle || handle === 'anonymous') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const room_id = searchParams.get('room_id');

    if (!room_id) {
      return NextResponse.json(
        { error: 'room_id parameter required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, room_id, sender_handle, content, created_at')
      .eq('room_id', room_id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: data || [] });
  } catch (error) {
    console.error('GET /api/chat/messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
