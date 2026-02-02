import { NextRequest, NextResponse } from 'next/server';
import { deriveAddressFromSignature, getDerivationMessage } from '@/lib/address-derivation';
import { supabase, isDbConnected } from '@/lib/supabase';

// POST /api/account/derive
// Derives a user's on-chain address from their HandCash signature
export async function POST(request: NextRequest) {
  try {
    const handle = request.headers.get('x-wallet-handle');
    const provider = request.headers.get('x-wallet-provider');

    if (!handle || provider !== 'handcash') {
      return NextResponse.json(
        { error: 'HandCash connection required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { signature } = body;

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature required', message: getDerivationMessage(handle) },
        { status: 400 }
      );
    }

    // Derive address from signature
    const { address, publicKey } = deriveAddressFromSignature(signature, handle);

    // Store/update in database
    if (isDbConnected() && supabase) {
      // Check if user already has a derived address
      const { data: existing } = await supabase
        .from('path402_holders')
        .select('id, ordinals_address')
        .eq('handle', handle)
        .single();

      if (existing) {
        // Update with derived address
        await supabase
          .from('path402_holders')
          .update({
            ordinals_address: address,
            address: address, // Use derived address as primary
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        // Create new holder with derived address
        await supabase
          .from('path402_holders')
          .insert({
            handle,
            provider: 'handcash',
            address: address,
            ordinals_address: address,
          });
      }
    }

    return NextResponse.json({
      success: true,
      address,
      publicKey,
      handle,
      tier: 1, // All new accounts are Tier 1 (no KYC)
      message: 'Address derived successfully. You control this address.',
      capabilities: {
        receive: true,
        hold: true,
        transfer: true,
        stake: false, // Coming soon - requires KYC
        dividends: false, // Coming soon - requires KYC
        voting: false, // Coming soon - requires KYC
      },
    });
  } catch (error) {
    console.error('Error deriving address:', error);
    return NextResponse.json(
      { error: 'Failed to derive address' },
      { status: 500 }
    );
  }
}

// GET /api/account/derive
// Returns the message to sign for address derivation
export async function GET(request: NextRequest) {
  const handle = request.headers.get('x-wallet-handle');

  if (!handle) {
    return NextResponse.json(
      { error: 'Handle required' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: getDerivationMessage(handle),
    instructions: [
      '1. Sign this message with your HandCash wallet',
      '2. Send the signature to POST /api/account/derive',
      '3. Your unique PATH402 address will be derived',
      '4. You control this address - PATH402 never has your keys',
    ],
  });
}
