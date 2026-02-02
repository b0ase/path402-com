import { NextRequest, NextResponse } from 'next/server';
import { createInscription } from '@/lib/x402';

/**
 * GET /api/x402/inscription
 * GET /api/x402/inscription?id=xxx
 *
 * Retrieve inscription details by ID
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({
      service: 'PATH402.com x402 Inscription',
      version: '1.0.0',
      usage: {
        get: '/api/x402/inscription?id=xxx',
        create: 'POST /api/x402/inscription',
      },
      explorer: 'https://whatsonchain.com',
    });
  }

  // TODO: Look up inscription in database
  // For now, return mock data
  return NextResponse.json({
    inscription_id: id,
    txId: `bsv_mock_${id}`,
    content_type: 'application/json',
    content: {
      type: 'x402_payment_proof',
      version: '1.0.0',
      origin: {
        network: 'base',
        txId: '0x...',
      },
      timestamp: new Date().toISOString(),
      facilitator: 'path402.com',
    },
    explorer_url: `https://whatsonchain.com/tx/bsv_mock_${id}`,
    created_at: new Date().toISOString(),
  });
}

/**
 * POST /api/x402/inscription
 *
 * Create a new BSV inscription for a payment proof
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      network,
      txId,
      payment,
      signature,
    } = body;

    if (!network || !txId) {
      return NextResponse.json({
        error: 'network and txId are required'
      }, { status: 400 });
    }

    const result = await createInscription(
      network,
      txId,
      payment || {
        from: 'unknown',
        to: 'unknown',
        amount: '0',
        asset: 'unknown',
      },
      signature || ''
    );

    if (!result.success) {
      return NextResponse.json({
        error: result.error || 'Failed to create inscription'
      }, { status: 500 });
    }

    return NextResponse.json({
      inscription_id: result.inscriptionId,
      txId: result.txId,
      explorer_url: `https://whatsonchain.com/tx/${result.txId}`,
      created_at: new Date().toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('[x402/inscription] Error:', error);
    return NextResponse.json({
      error: 'Failed to create inscription'
    }, { status: 500 });
  }
}
