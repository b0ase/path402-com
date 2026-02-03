import { NextRequest, NextResponse } from 'next/server';
import {
  decryptWif,
  verifySignatureOwnership,
  SIGN_MESSAGES,
} from '@/lib/address-derivation';
import { supabase, isDbConnected } from '@/lib/supabase';

// POST /api/wallet/export
// Exports the user's private key (WIF) by decrypting with their signature
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
      const timestamp = new Date().toISOString();
      return NextResponse.json(
        {
          error: 'Signature required',
          message: SIGN_MESSAGES.export(timestamp),
          timestamp,
          instructions: [
            '1. Sign the message above with HandCash',
            '2. Send the signature to this endpoint',
            '3. Your WIF private key will be returned',
            '4. You can import this WIF into any BSV wallet',
          ],
        },
        { status: 400 }
      );
    }

    if (!isDbConnected() || !supabase) {
      return NextResponse.json(
        { error: 'Database not connected' },
        { status: 503 }
      );
    }

    // Get the user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('address, encrypted_wif, encryption_salt')
      .eq('handle', handle)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json(
        {
          error: 'Wallet not found',
          details: 'You need to derive an address first. Go to Account and click "Derive Address".',
        },
        { status: 404 }
      );
    }

    // Verify the signature produces the correct address
    // This is a security check to ensure only the owner can export
    if (!verifySignatureOwnership(signature, handle, wallet.address)) {
      return NextResponse.json(
        {
          error: 'Invalid signature',
          details: 'The signature does not match your wallet. Make sure you sign with the correct HandCash account.',
        },
        { status: 403 }
      );
    }

    // Decrypt the WIF
    let wif: string;
    try {
      wif = decryptWif(wallet.encrypted_wif, signature, wallet.encryption_salt);
    } catch (decryptError) {
      console.error('WIF decryption failed:', decryptError);
      return NextResponse.json(
        {
          error: 'Decryption failed',
          details: 'Could not decrypt your private key. This may indicate a signature mismatch.',
        },
        { status: 500 }
      );
    }

    // Update last accessed
    await supabase
      .from('user_wallets')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('handle', handle);

    return NextResponse.json({
      success: true,
      wif,
      address: wallet.address,
      warning: 'Keep your private key secure! Anyone with this WIF can spend your tokens.',
      instructions: [
        '1. Copy the WIF above and store it securely',
        '2. You can import this into any BSV wallet that supports WIF',
        '3. Never share your private key with anyone',
        '4. You can re-export anytime by signing another message',
      ],
    });
  } catch (error) {
    console.error('Error exporting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to export wallet', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/wallet/export
// Returns the message to sign for exporting private key
export async function GET(request: NextRequest) {
  const handle = request.headers.get('x-wallet-handle');

  if (!handle) {
    return NextResponse.json(
      { error: 'Handle required' },
      { status: 400 }
    );
  }

  const timestamp = new Date().toISOString();
  const message = SIGN_MESSAGES.export(timestamp);

  // Check if user has a wallet
  let hasWallet = false;
  let address: string | null = null;

  if (isDbConnected() && supabase) {
    const { data: wallet } = await supabase
      .from('user_wallets')
      .select('address')
      .eq('handle', handle)
      .single();

    if (wallet) {
      hasWallet = true;
      address = wallet.address;
    }
  }

  if (!hasWallet) {
    return NextResponse.json({
      error: 'No wallet found',
      details: 'You need to derive an address first.',
      deriveUrl: '/api/account/derive',
    }, { status: 404 });
  }

  return NextResponse.json({
    message,
    timestamp,
    address,
    instructions: [
      '1. Sign this message with your HandCash wallet',
      '2. POST the signature to this endpoint',
      '3. Your WIF private key will be returned',
      '4. You can import this WIF into any BSV wallet',
    ],
    warning: 'Only export your private key on a secure device you control.',
  });
}
