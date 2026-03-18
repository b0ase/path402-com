/**
 * POST /api/kyc/veriff/start
 * Initiates a Veriff KYC session for token purchases over $10K
 *
 * Required: user_handle (from HandCash auth)
 * Returns: verification_url (redirect user to Veriff)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const VERIFF_API_KEY = process.env.VERIFF_API_KEY || '';
const VERIFF_API_URL = 'https://stationapi.veriff.com/v1/sessions';
const VERIFF_CALLBACK_URL = process.env.VERIFF_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'https://path402.com'}/api/kyc/veriff/webhook`;

interface StartKycRequest {
  user_handle: string;
  bsv_address?: string;
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: StartKycRequest = await request.json();
    const { user_handle, bsv_address, email } = body;

    if (!user_handle) {
      return NextResponse.json({ error: 'user_handle is required' }, { status: 400 });
    }

    if (!VERIFF_API_KEY) {
      console.error('[kyc-start] VERIFF_API_KEY not configured');
      return NextResponse.json({ error: 'KYC service not configured' }, { status: 503 });
    }

    const supabase = createAdminClient();

    // Get or create KYC subject (user)
    const { data: subject } = await supabase
      .from('kyc_subjects')
      .select('id')
      .eq('user_handle', user_handle)
      .maybeSingle();

    if (!subject) {
      await supabase.from('kyc_subjects').insert({
        user_handle,
        kyc_status: 'unverified',
        bsv_address,
        email,
      });
    } else {
      // Update fields if provided
      const updateData: any = {};
      if (bsv_address) updateData.bsv_address = bsv_address;
      if (email) updateData.email = email;

      if (Object.keys(updateData).length > 0) {
        await supabase
          .from('kyc_subjects')
          .update(updateData)
          .eq('user_handle', user_handle);
      }
    }

    // Initiate Veriff session
    const veriffPayload = {
      verification: {
        callback: VERIFF_CALLBACK_URL,
        vendorData: JSON.stringify({
          user_handle,
          email,
          purpose: 'path402_token_purchase_kyc',
          timestamp: new Date().toISOString(),
        }),
      },
    };

    console.log('[kyc-start] Calling Veriff API:', {
      url: VERIFF_API_URL,
      apiKeySet: !!VERIFF_API_KEY,
    });

    let veriffResponse;
    try {
      veriffResponse = await fetch(VERIFF_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-CLIENT': VERIFF_API_KEY,
        },
        body: JSON.stringify(veriffPayload),
      });
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : 'Unknown fetch error';
      console.error('[kyc-start] Fetch exception:', msg);
      return NextResponse.json(
        { error: 'Failed to connect to Veriff', details: msg },
        { status: 503 }
      );
    }

    if (!veriffResponse.ok) {
      const errData = await veriffResponse.text();
      console.error('[kyc-start] Veriff API error:', {
        status: veriffResponse.status,
        statusText: veriffResponse.statusText,
        body: errData,
      });
      return NextResponse.json(
        { error: 'Failed to initiate KYC session', details: errData },
        { status: 500 }
      );
    }

    const veriffData: any = await veriffResponse.json();
    const veriff_session_id = veriffData.verification?.id;
    const verification_url = veriffData.verification?.url;

    if (!veriff_session_id || !verification_url) {
      console.error('[kyc-start] Invalid Veriff response:', veriffData);
      return NextResponse.json(
        { error: 'Invalid KYC session response' },
        { status: 500 }
      );
    }

    // Store session in database
    const { error: insertError } = await supabase
      .from('kyc_sessions')
      .insert({
        user_handle,
        veriff_session_id,
        status: 'pending',
        veriff_response: veriffData,
      });

    if (insertError) {
      console.error('[kyc-start] Failed to store session:', insertError);
      return NextResponse.json(
        { error: 'Failed to store KYC session' },
        { status: 500 }
      );
    }

    console.log(
      `[kyc-start] KYC session initiated: ${veriff_session_id} for ${user_handle}`
    );

    return NextResponse.json({
      success: true,
      verification_url,
      session_id: veriff_session_id,
      message: 'Redirecting to Veriff for identity verification...',
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to start KYC session';
    console.error('[kyc-start] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
