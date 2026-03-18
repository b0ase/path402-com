/**
 * KYC Status Helper
 * Client-safe functions for KYC verification
 */

export interface KycStatus {
  isVerified: boolean;
  status: 'unverified' | 'verified' | 'rejected' | 'pending';
  authenticated?: boolean;
}

/**
 * Check current user's KYC status (calls /api/kyc/status)
 * Safe to call from client components
 */
export async function checkKycStatus(): Promise<KycStatus> {
  try {
    const response = await fetch('/api/kyc/status');

    if (!response.ok) {
      console.error('Failed to check KYC status:', response.statusText);
      return {
        isVerified: false,
        status: 'unverified',
      };
    }

    const data = await response.json();
    return {
      isVerified: data.isVerified,
      status: data.status,
      authenticated: data.authenticated,
    };
  } catch (error) {
    console.error('Error checking KYC status:', error);
    return {
      isVerified: false,
      status: 'unverified',
    };
  }
}

export async function initiateKyc(userHandle: string, email?: string, bsvAddress?: string) {
  try {
    const response = await fetch('/api/kyc/veriff/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_handle: userHandle,
        email,
        bsv_address: bsvAddress,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initiate KYC');
    }

    const data = await response.json();
    return data.verification_url;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to initiate KYC';
    throw new Error(msg);
  }
}
