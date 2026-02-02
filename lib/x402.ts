/**
 * x402 Facilitator Library
 *
 * Provides payment verification, settlement, and inscription services
 * for the $402 protocol. Compatible with Coinbase x402 specification.
 */

// Types
export type SupportedNetwork = 'bsv' | 'base' | 'solana' | 'ethereum';

export interface VerifyRequest {
  x402Version: number;
  scheme: 'exact' | 'upto';
  network: SupportedNetwork;
  payload: {
    signature: string;
    authorization: {
      from: string;
      to: string;
      value: string;
      nonce: string;
      validAfter?: string;
      validBefore?: string;
    };
  };
}

export interface SettleRequest extends VerifyRequest {
  paymentRequirements?: {
    asset: string;
    amount: string;
    recipient: string;
  };
}

export interface VerificationResult {
  valid: boolean;
  invalidReason?: string;
  txId?: string;
  amount?: number;
}

export interface InscriptionResult {
  success: boolean;
  inscriptionId?: string;
  txId?: string;
  error?: string;
}

// Fee configuration
export const FEES = {
  verification: 200,      // sats per verification
  inscription: 500,       // sats per inscription
  settlementPercent: 0.001, // 0.1% settlement fee
};

// Network configuration
export const NETWORK_CONFIG: Record<SupportedNetwork, {
  name: string;
  chainId: number | string;
  explorerUrl: string;
  rpcUrl?: string;
}> = {
  bsv: {
    name: 'Bitcoin SV',
    chainId: 'mainnet',
    explorerUrl: 'https://whatsonchain.com',
  },
  base: {
    name: 'Base (Coinbase L2)',
    chainId: 8453,
    explorerUrl: 'https://basescan.org',
  },
  solana: {
    name: 'Solana',
    chainId: 'mainnet-beta',
    explorerUrl: 'https://solscan.io',
  },
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    explorerUrl: 'https://etherscan.io',
  },
};

// Supported assets per network
export const SUPPORTED_ASSETS: Record<SupportedNetwork, string[]> = {
  bsv: ['BSV', 'BSV-20'],
  base: ['USDC', 'ETH'],
  solana: ['USDC', 'SOL'],
  ethereum: ['USDC', 'ETH', 'USDT'],
};

// Nonce tracking (in-memory, replace with Redis/DB in production)
const usedNonces = new Map<string, Set<string>>();

/**
 * Check if a nonce has already been used (replay protection)
 */
export function checkNonce(network: SupportedNetwork, nonce: string): boolean {
  const key = `${network}`;
  if (!usedNonces.has(key)) {
    usedNonces.set(key, new Set());
  }

  const networkNonces = usedNonces.get(key)!;
  if (networkNonces.has(nonce)) {
    return false; // Already used
  }

  networkNonces.add(nonce);
  return true;
}

/**
 * Verify a payment signature on the origin chain
 */
export async function verifyPayment(
  network: SupportedNetwork,
  payload: VerifyRequest['payload']
): Promise<VerificationResult> {
  try {
    switch (network) {
      case 'bsv':
        return await verifyBSVPayment(payload);
      case 'base':
        return await verifyBasePayment(payload);
      case 'solana':
        return await verifySolanaPayment(payload);
      case 'ethereum':
        return await verifyEthereumPayment(payload);
      default:
        return { valid: false, invalidReason: 'Unsupported network' };
    }
  } catch (error) {
    console.error(`[x402] Verification error on ${network}:`, error);
    return { valid: false, invalidReason: 'Verification failed' };
  }
}

/**
 * Create a BSV inscription for payment proof
 */
export async function createInscription(
  originNetwork: SupportedNetwork,
  originTxId: string,
  payment: {
    from: string;
    to: string;
    amount: string;
    asset: string;
  },
  signature: string,
  settledOn?: SupportedNetwork,
  settlementTxId?: string
): Promise<InscriptionResult> {
  try {
    // Create inscription content
    const content = {
      type: 'x402_payment_proof',
      version: '1.0.0',
      origin: {
        network: originNetwork,
        txId: originTxId,
      },
      payment,
      signature,
      settlement: settledOn ? {
        network: settledOn,
        txId: settlementTxId,
      } : undefined,
      timestamp: new Date().toISOString(),
      facilitator: 'path402.com',
    };

    // TODO: Implement actual BSV inscription
    // 1. Create OP_RETURN transaction with JSON content
    // 2. Broadcast to BSV network
    // 3. Return inscription ID

    // Mock implementation for development
    const inscriptionId = `insc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const txId = `bsv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    console.log('[x402] Created inscription:', inscriptionId);
    console.log('[x402] Content:', JSON.stringify(content, null, 2));

    return {
      success: true,
      inscriptionId,
      txId,
    };
  } catch (error) {
    console.error('[x402] Inscription error:', error);
    return {
      success: false,
      error: 'Failed to create inscription',
    };
  }
}

/**
 * Get inscription statistics
 */
export async function getInscriptionStats() {
  // TODO: Query database for real stats
  return {
    totalInscriptions: 0,
    totalFees: 0,
    byChain: {
      bsv: 0,
      base: 0,
      solana: 0,
      ethereum: 0,
    },
  };
}

/**
 * Get a single inscription by ID
 */
export async function getInscription(id: string): Promise<{
  id: string;
  txId: string;
  blockHeight: number | null;
  timestamp: string;
  fee: number;
  inscription: string;
} | null> {
  // TODO: Query database for real inscription
  // For now return null (not found)
  console.log('[x402] getInscription called with id:', id);
  return null;
}

// Network-specific verification functions

async function verifyBSVPayment(payload: VerifyRequest['payload']): Promise<VerificationResult> {
  // TODO: Verify BSV transaction via WhatsOnChain API
  // For development, accept all valid-looking signatures
  if (payload.signature && payload.signature.length > 20) {
    return {
      valid: true,
      amount: parseInt(payload.authorization.value),
    };
  }
  return { valid: false, invalidReason: 'Invalid BSV signature' };
}

async function verifyBasePayment(payload: VerifyRequest['payload']): Promise<VerificationResult> {
  // TODO: Verify Base transaction via their RPC
  // Check EIP-712 signature for USDC transfer authorization
  if (payload.signature && payload.signature.startsWith('0x')) {
    return {
      valid: true,
      amount: parseInt(payload.authorization.value),
    };
  }
  return { valid: false, invalidReason: 'Invalid Base signature' };
}

async function verifySolanaPayment(payload: VerifyRequest['payload']): Promise<VerificationResult> {
  // TODO: Verify Solana transaction via Helius or similar
  if (payload.signature && payload.signature.length > 40) {
    return {
      valid: true,
      amount: parseInt(payload.authorization.value),
    };
  }
  return { valid: false, invalidReason: 'Invalid Solana signature' };
}

async function verifyEthereumPayment(payload: VerifyRequest['payload']): Promise<VerificationResult> {
  // TODO: Verify Ethereum transaction via Alchemy or Infura
  if (payload.signature && payload.signature.startsWith('0x')) {
    return {
      valid: true,
      amount: parseInt(payload.authorization.value),
    };
  }
  return { valid: false, invalidReason: 'Invalid Ethereum signature' };
}
