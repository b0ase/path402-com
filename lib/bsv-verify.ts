// BSV transaction verification helpers (Whatsonchain)

const WOC_API = 'https://api.whatsonchain.com/v1/bsv/main';

export interface BsvTxOutput {
  value: number; // BSV
  scriptPubKey?: {
    addresses?: string[];
    hex?: string;
  };
}

export interface BsvTx {
  txid: string;
  blockheight?: number;
  confirmations?: number;
  vout: BsvTxOutput[];
}

export async function fetchBsvTx(txId: string): Promise<BsvTx | null> {
  try {
    const res = await fetch(`${WOC_API}/tx/${txId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('[bsv-verify] fetch tx error:', error);
    return null;
  }
}

export type BsvTxStatus = 'mempool' | 'mined';

/**
 * Check a BSV payment from the tx's real outputs (not the payer's claim).
 * A tx WhatsOnChain returns has been accepted by the network, so it is at least in the
 * mempool; with confirmations it is mined. paidSats is the verified sum to expectedAddress.
 */
export async function verifyBsvPaymentTx(
  params: { txId: string; expectedAddress: string; minSats: number },
  fetchTx: (txId: string) => Promise<BsvTx | null> = fetchBsvTx,
): Promise<{ valid: boolean; paidSats: number; seen: boolean; status?: BsvTxStatus }> {
  const { txId, expectedAddress, minSats } = params;
  const tx = await fetchTx(txId);
  if (!tx || !Array.isArray(tx.vout) || (tx.txid && tx.txid !== txId)) {
    return { valid: false, paidSats: 0, seen: false };
  }

  let paidSats = 0;
  for (const vout of tx.vout) {
    const addresses = vout.scriptPubKey?.addresses || [];
    if (addresses.includes(expectedAddress)) {
      paidSats += Math.round(vout.value * 1e8);
    }
  }

  const status: BsvTxStatus = (tx.confirmations ?? 0) > 0 || (tx.blockheight ?? 0) > 0 ? 'mined' : 'mempool';
  return { valid: minSats > 0 && paidSats >= minSats, paidSats, seen: true, status };
}
