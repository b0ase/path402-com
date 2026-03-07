import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getURLForHash, buildAdvertisement } from '@/lib/uhrp/index';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables not configured');
  }
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * POST /api/uhrp/advertise
 * Create a UHRP advertisement for content you host
 *
 * Auth: x-wallet-handle header required
 * Body: { content_hash, content_type, content_size, download_url, expiry_days? }
 */
export async function POST(request: NextRequest) {
  try {
    const walletHandle = request.headers.get('x-wallet-handle');
    if (!walletHandle) {
      return NextResponse.json({ error: 'x-wallet-handle header required' }, { status: 401 });
    }

    const body = await request.json();
    const { content_hash, content_type, content_size, download_url, expiry_days } = body;

    if (!content_hash || !download_url) {
      return NextResponse.json(
        { error: 'content_hash and download_url are required' },
        { status: 400 }
      );
    }

    // Validate hash format
    if (!/^[a-f0-9]{64}$/i.test(content_hash)) {
      return NextResponse.json(
        { error: 'content_hash must be a 64-character hex SHA-256 hash' },
        { status: 400 }
      );
    }

    const uhrpUrl = getURLForHash(content_hash);
    const advertisement = buildAdvertisement({
      content_hash,
      content_type: content_type || 'application/octet-stream',
      content_size: content_size || 0,
      download_url,
      advertiser: walletHandle,
      expiry_days,
    });

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('uhrp_advertisements')
      .insert({
        uhrp_url: uhrpUrl,
        content_hash: content_hash.toLowerCase(),
        content_type: content_type || 'application/octet-stream',
        content_size: content_size || 0,
        download_url,
        advertiser_address: walletHandle,
        expiry_at: advertisement.expiry,
        inscription_status: 'pending',
        source_type: 'manual',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[/api/uhrp/advertise] DB error:', error);
      return NextResponse.json({ error: 'Failed to create advertisement' }, { status: 500 });
    }

    return NextResponse.json({
      uhrp_url: uhrpUrl,
      advertisement_id: data?.id,
      advertisement,
    });
  } catch (error) {
    console.error('[/api/uhrp/advertise] Error:', error);
    return NextResponse.json({ error: 'Failed to create advertisement' }, { status: 500 });
  }
}
