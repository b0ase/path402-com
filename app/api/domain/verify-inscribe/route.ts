import { NextRequest, NextResponse } from 'next/server';
import { createAndBroadcastInscription } from '@/lib/bsv-inscribe';
import { verifyBsvMessageSignature, isValidBsvAddress } from '@/lib/bsv-domain-proof';
import { computeHash, getURLForHash } from '@/lib/uhrp/index';
import { createClient } from '@supabase/supabase-js';

const TREASURY_ADDRESS = (process.env.X402_TREASURY_ADDRESS || process.env.TREASURY_ADDRESS || '').trim();
const TREASURY_PRIVATE_KEY = (process.env.X402_TREASURY_PRIVATE_KEY || process.env.TREASURY_PRIVATE_KEY || '').trim();

// POST /api/domain/verify-inscribe
// Broadcasts a domain-verify inscription (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { domain, issuer_address, signature, message } = body;

    if (!domain || !issuer_address || !signature) {
      return NextResponse.json({
        error: 'domain, issuer_address, and signature are required',
      }, { status: 400 });
    }

    if (!isValidBsvAddress(issuer_address)) {
      return NextResponse.json({
        error: 'Invalid issuer_address',
      }, { status: 400 });
    }

    if (!TREASURY_ADDRESS || !TREASURY_PRIVATE_KEY) {
      return NextResponse.json({
        error: 'Treasury keys not configured',
      }, { status: 500 });
    }

    const canonicalMessage = message || `path402-domain:${domain}`;
    const signatureOk = verifyBsvMessageSignature({
      message: canonicalMessage,
      signature,
      address: issuer_address,
    });

    if (!signatureOk) {
      return NextResponse.json({
        error: 'Invalid signature for issuer_address',
      }, { status: 400 });
    }

    const payload = {
      p: '$402',
      op: 'domain-verify',
      domain,
      issuer_address,
      message: canonicalMessage,
      signature,
    };

    const { txId, inscriptionId } = await createAndBroadcastInscription({
      data: payload,
      contentType: 'application/json',
      toAddress: TREASURY_ADDRESS,
      privateKeyWIF: TREASURY_PRIVATE_KEY,
    });

    // UHRP anchor: compute content hash and record advertisement
    let uhrp_url: string | null = null;
    try {
      const payloadBytes = Buffer.from(JSON.stringify(payload), 'utf-8');
      const contentHash = computeHash(payloadBytes);
      uhrp_url = getURLForHash(contentHash);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('uhrp_advertisements').insert({
          uhrp_url,
          content_hash: contentHash,
          content_type: 'application/json',
          content_size: payloadBytes.length,
          download_url: `/api/domain/proof/${inscriptionId}`,
          advertiser_address: issuer_address,
          inscription_txid: txId,
          inscription_status: 'confirmed',
          source_type: 'domain_verify',
          source_id: inscriptionId,
        });
      }
    } catch (uhrpErr) {
      console.warn('[domain/verify-inscribe] UHRP anchor failed (non-fatal):', uhrpErr);
    }

    return NextResponse.json({
      success: true,
      tx_id: txId,
      inscription_id: inscriptionId,
      uhrp_url,
      payload,
    });
  } catch (error) {
    console.error('[/api/domain/verify-inscribe] Error:', error);
    return NextResponse.json({ error: 'Failed to inscribe domain proof' }, { status: 500 });
  }
}
