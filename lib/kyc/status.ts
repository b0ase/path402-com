/**
 * KYC Status Helper
 * Checks if a user is verified for high-value token purchases
 */

import { createAdminClient } from '@/lib/supabase/admin';

export interface KycStatus {
  isVerified: boolean;
  status: 'unverified' | 'verified' | 'rejected' | 'pending';
  verifiedAt?: string;
}

export async function checkKycStatus(userHandle: string): Promise<KycStatus> {
  try {
    const supabase = createAdminClient();

    const { data: subject } = await supabase
      .from('kyc_subjects')
      .select('kyc_status, kyc_verified_at')
      .eq('user_handle', userHandle)
      .maybeSingle();

    if (!subject) {
      return {
        isVerified: false,
        status: 'unverified',
      };
    }

    return {
      isVerified: subject.kyc_status === 'verified',
      status: subject.kyc_status || 'unverified',
      verifiedAt: subject.kyc_verified_at,
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
