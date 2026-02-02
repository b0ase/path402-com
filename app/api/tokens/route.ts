import { NextRequest, NextResponse } from 'next/server';
import { listTokens, registerToken, RegisterTokenRequest } from '@/lib/tokens';

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

    return NextResponse.json({
      tokens,
      count: tokens.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[/api/tokens GET] Error:', error);
    return NextResponse.json({ error: 'Failed to list tokens' }, { status: 500 });
  }
}

/**
 * POST /api/tokens
 *
 * Register a new $address token
 */
export async function POST(request: NextRequest) {
  try {
    // Get issuer from auth headers
    const issuerHandle = request.headers.get('x-wallet-handle');
    const provider = request.headers.get('x-wallet-provider');

    if (!issuerHandle || !provider) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body: RegisterTokenRequest = await request.json();

    // Validate required fields
    if (!body.address || !body.name) {
      return NextResponse.json({ error: 'address and name are required' }, { status: 400 });
    }

    // Validate $address format
    if (!body.address.startsWith('$')) {
      return NextResponse.json({ error: 'Address must start with $' }, { status: 400 });
    }

    // TODO: Verify issuer owns the domain in the $address
    // For now, allow any registration

    const token = await registerToken(issuerHandle, body);

    return NextResponse.json({
      success: true,
      token,
    }, { status: 201 });
  } catch (error) {
    console.error('[/api/tokens POST] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to register token';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
