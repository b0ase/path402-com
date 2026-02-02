// BSV-20 On-Chain Transfer Implementation
// Creates and broadcasts BSV-20 transfer inscriptions

import bsv from 'bsv';
import { TOKEN_CONFIG } from './types';

const ORDINALS_API = 'https://ordinals.gorillapool.io/api';

interface TransferResult {
  success: boolean;
  txId?: string;
  error?: string;
}

// Create a BSV-20 transfer inscription
export function createTransferInscription(
  amount: number,
  toAddress: string
): { inscription: string; data: object } {
  const transferData = {
    p: 'bsv-20',
    op: 'transfer',
    tick: TOKEN_CONFIG.symbol,
    amt: amount.toString(),
  };

  return {
    inscription: JSON.stringify(transferData),
    data: transferData,
  };
}

// Build and sign a BSV-20 transfer transaction
export async function createTransferTransaction(
  amount: number,
  toAddress: string,
  privateKeyWIF: string
): Promise<{ txHex: string; txId: string }> {
  const privateKey = bsv.PrivateKey.fromWIF(privateKeyWIF);
  const fromAddress = privateKey.toAddress().toString();

  // Get UTXOs for the treasury address
  const utxos = await fetchUTXOs(fromAddress);

  if (!utxos || utxos.length === 0) {
    throw new Error('No UTXOs available for treasury');
  }

  // Create the inscription data
  const { inscription } = createTransferInscription(amount, toAddress);
  const inscriptionBuffer = Buffer.from(inscription, 'utf8');

  // Build the transaction
  const tx = new bsv.Transaction();

  // Add inputs (UTXOs)
  let totalInput = 0;
  for (const utxo of utxos) {
    tx.from({
      txId: utxo.txid,
      outputIndex: utxo.vout,
      script: bsv.Script.fromAddress(fromAddress).toHex(),
      satoshis: utxo.satoshis,
    });
    totalInput += utxo.satoshis;

    // Stop when we have enough for fees
    if (totalInput >= 1000) break;
  }

  // Calculate fee (1 sat/byte estimate)
  const estimatedSize = 300 + inscriptionBuffer.length;
  const fee = Math.max(estimatedSize, 500);

  if (totalInput < fee + 1) {
    throw new Error(`Insufficient funds: have ${totalInput}, need ${fee + 1}`);
  }

  // Output 1: Inscription (1 sat ordinal)
  // Using OP_FALSE OP_IF ... OP_ENDIF pattern for ordinals
  const inscriptionScript = bsv.Script.buildDataOut([
    'ord',
    Buffer.from([1]), // content-type marker
    Buffer.from('application/bsv-20', 'utf8'),
    Buffer.from([0]), // content marker
    inscriptionBuffer,
  ]);

  // Output to recipient with inscription
  tx.addOutput(
    new bsv.Transaction.Output({
      script: bsv.Script.fromAddress(toAddress).add(inscriptionScript),
      satoshis: 1,
    })
  );

  // Output 2: Change back to treasury
  const change = totalInput - fee - 1;
  if (change > 546) {
    tx.to(fromAddress, change);
  }

  // Sign the transaction
  tx.sign(privateKey);

  return {
    txHex: tx.serialize(),
    txId: tx.id,
  };
}

// Fetch UTXOs for an address
async function fetchUTXOs(address: string): Promise<Array<{
  txid: string;
  vout: number;
  satoshis: number;
}>> {
  try {
    // Try WhatsOnChain API
    const response = await fetch(
      `https://api.whatsonchain.com/v1/bsv/main/address/${address}/unspent`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch UTXOs: ${response.status}`);
    }

    const data = await response.json();

    return data.map((utxo: { tx_hash: string; tx_pos: number; value: number }) => ({
      txid: utxo.tx_hash,
      vout: utxo.tx_pos,
      satoshis: utxo.value,
    }));
  } catch (error) {
    console.error('Error fetching UTXOs:', error);
    return [];
  }
}

// Broadcast a transaction
async function broadcastTransaction(txHex: string): Promise<string> {
  // Try WhatsOnChain
  const response = await fetch(
    'https://api.whatsonchain.com/v1/bsv/main/tx/raw',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txhex: txHex }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Broadcast failed: ${error}`);
  }

  const txId = await response.text();
  return txId.replace(/"/g, '');
}

// Execute a full BSV-20 transfer
export async function executeTransfer(
  amount: number,
  toAddress: string
): Promise<TransferResult> {
  const privateKeyWIF = process.env.TREASURY_PRIVATE_KEY;

  if (!privateKeyWIF) {
    return {
      success: false,
      error: 'Treasury private key not configured',
    };
  }

  try {
    // Create and sign the transaction
    const { txHex, txId } = await createTransferTransaction(
      amount,
      toAddress,
      privateKeyWIF
    );

    // Broadcast to network
    const broadcastTxId = await broadcastTransaction(txHex);

    console.log(`BSV-20 transfer broadcast: ${broadcastTxId}`);

    return {
      success: true,
      txId: broadcastTxId || txId,
    };
  } catch (error) {
    console.error('BSV-20 transfer failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Check if user has a derived on-chain address
export async function getUserOnChainAddress(handle: string): Promise<string | null> {
  // This would query the database for the user's derived address
  // For now, return null to indicate no on-chain address yet
  return null;
}
