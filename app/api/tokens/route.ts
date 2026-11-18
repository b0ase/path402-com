import { retired } from '@/lib/retired';
import { NextRequest, NextResponse } from 'next/server';
import { listTokens, getToken, registerToken, RegisterTokenRequest } from '@/lib/tokens';
import { verifyDomainOwnership } from '@/lib/domain-verification';

/** CORS preflight */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-wallet-handle, x-wallet-provider',
    },
  });
}

/**
 * GET /api/tokens
 *
 * List all active tokens with current prices
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const issuer = searchParams.get('issuer') || undefined;
    const content_type = searchParams.get('type') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    const tokens = await listTokens({ issuer, content_type, limit, offset });

    const res = NextResponse.json({
      tokens,
      count: tokens.length,
      limit,
      offset,
    });
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res;
  } catch (error) {
    console.error('[/api/tokens GET] Error:', error);
    return NextResponse.json({ error: 'Failed to list tokens' }, { status: 500 });
  }
}

function extractRoot(address: string): string {
  const parts = address.split('/').filter(Boolean);
  if (!parts.length) return '';
  const root = parts[0];
  return root.startsWith('$') ? root.slice(1) : root;
}

// RETIRED 18 Nov 2026 (security): POST trusted an unauthenticated x-wallet-handle header. 410 only.
export const POST = retired;
