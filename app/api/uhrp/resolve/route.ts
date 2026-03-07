import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isValidURL, getHashFromURL } from '@/lib/uhrp/index';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables not configured');
  }
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * GET /api/uhrp/resolve?url=uhrp://...
 * Resolve a UHRP URL to HTTP download URLs
 */
export async function GET(request: NextRequest) {
  try {
    const uhrpUrl = request.nextUrl.searchParams.get('url');
    if (!uhrpUrl || !isValidURL(uhrpUrl)) {
      return NextResponse.json(
        { error: 'Valid uhrp:// URL required as ?url= parameter' },
        { status: 400 }
      );
    }

    const contentHash = getHashFromURL(uhrpUrl);
    const supabase = getSupabase();

    // Query local advertisements for matching content hash
    const { data: ads } = await supabase
      .from('uhrp_advertisements')
      .select('download_url, content_type, content_size, advertiser_address, expiry_at, created_at')
      .eq('content_hash', contentHash)
      .or('expiry_at.is.null,expiry_at.gt.now()')
      .order('created_at', { ascending: false })
      .limit(20);

    const urls = (ads || []).map((ad: { download_url: string }) => ad.download_url);
    const hasLocal = urls.length > 0;

    return NextResponse.json({
      uhrp_url: uhrpUrl,
      content_hash: contentHash,
      urls,
      local: hasLocal,
      advertisements: ads || [],
    });
  } catch (error) {
    console.error('[/api/uhrp/resolve] Error:', error);
    return NextResponse.json({ error: 'Failed to resolve UHRP URL' }, { status: 500 });
  }
}
