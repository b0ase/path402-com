/**
 * GET /api/kyc/status
 * Check current user's KYC verification status
 *
 * Returns: { status: 'unverified'|'verified'|'rejected'|'pending', isVerified: bool }
 * Auth: Reads hc_handle cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const userHandle = request.cookies.get('hc_handle')?.value;

    if (!userHandle) {
      return NextResponse.json(
        { status: 'unverified', isVerified: false, authenticated: false },
        { status: 200 }
      );
    }

    const supabase = createAdminClient();

    // Check kyc_subjects table
    const { data: subject } = await supabase
      .from('kyc_subjects')
      .select('kyc_status')
      .eq('user_handle', userHandle)
      .maybeSingle();

    const status = subject?.kyc_status || 'unverified';
    const isVerified = status === 'verified';

    console.log(`[kyc-status] User ${userHandle}: ${status}`);

    return NextResponse.json({
      status,
      isVerified,
      authenticated: true,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to check KYC status';
    console.error('[kyc-status] Error:', msg);
    return NextResponse.json({ status: 'unverified', isVerified: false }, { status: 500 });
  }
}
