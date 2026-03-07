/**
 * UHRP advertisement inscription on BSV
 *
 * Creates on-chain ordinals-style inscriptions for UHRP advertisements.
 * Reuses the existing createAndBroadcastInscription() from lib/bsv-inscribe.ts.
 */

import { createAndBroadcastInscription } from '../bsv-inscribe';
import type { UhrpAdvertisement } from './index';

/**
 * Inscribe a UHRP advertisement on-chain
 *
 * @returns Transaction ID and inscription ID
 */
export async function inscribeUhrpAdvertisement(params: {
  advertisement: UhrpAdvertisement;
  privateKeyWIF: string;
  toAddress: string;
}): Promise<{ txId: string; inscriptionId: string }> {
  const { advertisement, privateKeyWIF, toAddress } = params;

  const { txId, inscriptionId } = await createAndBroadcastInscription({
    data: advertisement,
    contentType: 'application/json',
    toAddress,
    privateKeyWIF,
  });

  return { txId, inscriptionId };
}

/**
 * Inscribe a UHRP advertisement and return the full result
 * including the advertisement data for DB storage.
 */
export async function inscribeAndTrack(params: {
  advertisement: UhrpAdvertisement;
  privateKeyWIF: string;
  toAddress: string;
}): Promise<{
  txId: string;
  inscriptionId: string;
  advertisement: UhrpAdvertisement;
}> {
  const { txId, inscriptionId } = await inscribeUhrpAdvertisement(params);
  return {
    txId,
    inscriptionId,
    advertisement: params.advertisement,
  };
}
