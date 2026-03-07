import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables not configured');
  }
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * GET /api/domain/proof/{inscriptionId}
 * Fetch a domain verification proof payload by inscription ID.
 * This is the download_url that UHRP advertisements point to.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Inscription ID required' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Look up UHRP advertisement with source_type='domain_verify' and matching source_id
    const { data: ad } = await supabase
      .from('uhrp_advertisements')
      .select('*')
      .eq('source_type', 'domain_verify')
      .eq('source_id', id)
      .single();

    if (ad) {
      return NextResponse.json({
        inscription_id: id,
        uhrp_url: ad.uhrp_url,
        content_hash: ad.content_hash,
        content_type: ad.content_type,
        advertiser: ad.advertiser_address,
        created_at: ad.created_at,
      });
    }

    // Fallback: return the inscription ID as a reference
    return NextResponse.json({
      inscription_id: id,
      note: 'Proof payload available on-chain via inscription lookup',
      lookup_url: `https://1satordinals.com/inscription/${id}`,
    });
  } catch (error) {
    console.error('[/api/domain/proof] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch domain proof' }, { status: 500 });
  }
}
