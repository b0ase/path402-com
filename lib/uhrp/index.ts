/**
 * UHRP (Universal Hash Resolution Protocol, BRC-26) utilities
 *
 * Content-addressed file storage on BSV overlay network.
 * Files get `uhrp://` URLs based on SHA-256 hash.
 * Any host can advertise availability via UTXO tokens.
 */

import { createHash } from 'crypto';

// BRC-26 UHRP protocol prefix (used in UTXO advertisement tokens)
export const UHRP_PROTOCOL_PREFIX = '1UHRPYnMHPuQ5Tgb3AF8JXqwKkmZVy5hG';

// $402 UHRP advertisement protocol identifier
export const UHRP_PROTOCOL_ID = '$402-uhrp';
export const UHRP_VERSION = '1.0';

// ── URL computation ──

/**
 * Compute a UHRP URL from raw data (SHA-256 hash → uhrp:// URL)
 */
export function computeUhrpUrl(data: Uint8Array | Buffer): string {
  const hash = createHash('sha256').update(data).digest('hex');
  return `uhrp://${hash}`;
}

/**
 * Compute a UHRP URL from an existing hex-encoded SHA-256 hash
 */
export function getURLForHash(hash: string): string {
  if (!/^[a-f0-9]{64}$/i.test(hash)) {
    throw new Error('Invalid SHA-256 hash: must be 64 hex characters');
  }
  return `uhrp://${hash.toLowerCase()}`;
}

/**
 * Extract the SHA-256 hash from a UHRP URL
 */
export function getHashFromURL(uhrpUrl: string): string {
  if (!isValidURL(uhrpUrl)) {
    throw new Error('Invalid UHRP URL');
  }
  return uhrpUrl.replace('uhrp://', '').toLowerCase();
}

/**
 * Validate a UHRP URL format
 */
export function isValidURL(url: string): boolean {
  if (!url.startsWith('uhrp://')) return false;
  const hash = url.slice(7);
  return /^[a-f0-9]{64}$/i.test(hash);
}

/**
 * Compute the SHA-256 hash of data and return as hex string
 */
export function computeHash(data: Uint8Array | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

// ── Advertisement structure ──

export interface UhrpAdvertisement {
  /** Protocol identifier */
  p: typeof UHRP_PROTOCOL_ID;
  /** Operation type */
  op: 'advertise';
  /** Protocol version */
  v: typeof UHRP_VERSION;
  /** UHRP URL (uhrp://sha256hex) */
  uhrp_url: string;
  /** SHA-256 content hash (hex) */
  content_hash: string;
  /** MIME type */
  content_type: string;
  /** File size in bytes */
  content_size: number;
  /** HTTP URL where content can be downloaded */
  download_url: string;
  /** Expiry timestamp (ISO 8601) or null for permanent */
  expiry: string | null;
  /** BSV address of the advertiser */
  advertiser: string;
  /** Timestamp of advertisement (ISO 8601) */
  ts: string;
}

/**
 * Build a UHRP advertisement object
 */
export function buildAdvertisement(params: {
  content_hash: string;
  content_type: string;
  content_size: number;
  download_url: string;
  advertiser: string;
  expiry_days?: number;
}): UhrpAdvertisement {
  const expiryDate = params.expiry_days
    ? new Date(Date.now() + params.expiry_days * 24 * 60 * 60 * 1000).toISOString()
    : null;

  return {
    p: UHRP_PROTOCOL_ID,
    op: 'advertise',
    v: UHRP_VERSION,
    uhrp_url: getURLForHash(params.content_hash),
    content_hash: params.content_hash.toLowerCase(),
    content_type: params.content_type,
    content_size: params.content_size,
    download_url: params.download_url,
    expiry: expiryDate,
    advertiser: params.advertiser,
    ts: new Date().toISOString(),
  };
}
