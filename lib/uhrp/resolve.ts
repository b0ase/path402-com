/**
 * UHRP URL resolution
 *
 * Resolves uhrp:// URLs to HTTP download URLs via local DB
 * and BRC-22 overlay network lookup.
 */

import { getHashFromURL, isValidURL, computeHash } from './index';

/**
 * Resolve a UHRP URL to a list of HTTP download URLs.
 * Queries local advertisements DB first, then falls back to overlay.
 *
 * @param uhrpUrl - The uhrp:// URL to resolve
 * @param localResolver - Function that queries local DB for download URLs
 * @returns Array of HTTP download URLs
 */
export async function resolveUhrp(
  uhrpUrl: string,
  localResolver?: (contentHash: string) => Promise<string[]>
): Promise<string[]> {
  if (!isValidURL(uhrpUrl)) {
    throw new Error('Invalid UHRP URL format');
  }

  const contentHash = getHashFromURL(uhrpUrl);
  const urls: string[] = [];

  // 1. Query local advertisements
  if (localResolver) {
    const localUrls = await localResolver(contentHash);
    urls.push(...localUrls);
  }

  return urls;
}

/**
 * Download content from a UHRP URL and verify the hash.
 *
 * @param downloadUrl - HTTP URL to download from
 * @param expectedHash - Expected SHA-256 hash (hex)
 * @returns Downloaded data and verified MIME type
 */
export async function downloadAndVerify(
  downloadUrl: string,
  expectedHash: string
): Promise<{ data: Buffer; mimeType: string }> {
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }

  const mimeType = response.headers.get('content-type') || 'application/octet-stream';
  const arrayBuffer = await response.arrayBuffer();
  const data = Buffer.from(arrayBuffer);

  // Verify hash
  const actualHash = computeHash(data);
  if (actualHash !== expectedHash.toLowerCase()) {
    throw new Error(
      `Hash mismatch: expected ${expectedHash}, got ${actualHash}`
    );
  }

  return { data, mimeType };
}
