/**
 * POST /api/kyc/veriff/webhook
 * Receives Veriff decision webhook
 * Updates user KYC status and flags eligibility for high-value token purchases
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

const VERIFF_WEBHOOK_SECRET = process.env.VERIFF_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Verify HMAC signature
    if (VERIFF_WEBHOOK_SECRET) {
      const signature = request.headers.get('x-hmac-signature') || '';
      const expected = createHmac('sha256', VERIFF_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (signature.toLowerCase() !== expected.toLowerCase()) {
        console.error('[kyc-webhook] HMAC mismatch');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const verification = payload.verification;

    if (!verification?.id || !verification?.status) {
      console.warn('[kyc-webhook] Missing verification data');
      return NextResponse.json({ ok: true });
    }

    const sessionId = verification.id;
    const status = verification.status;

    console.log(`[kyc-webhook] Decision: session=${sessionId} status=${status}`);

    const supabase = createAdminClient();

    // Look up our session record
    const { data: session } = await supabase
      .from('kyc_sessions')
      .select('id, user_handle, status')
      .eq('veriff_session_id', sessionId)
      .maybeSingle();

    if (!session) {
      console.warn(`[kyc-webhook] Unknown session: ${sessionId}`);
      return NextResponse.json({ ok: true });
    }

    // Already processed
    if (session.status === 'approved') {
      return NextResponse.json({ ok: true });
    }

    // Scrub sensitive data
    const safePayload = {
      status,
      person: verification.person
        ? {
            firstName: verification.person.firstName,
            lastName: verification.person.lastName,
            dateOfBirth: verification.person.dateOfBirth,
          }
        : null,
      document: verification.document
        ? {
            type: verification.document.type,
            country: verification.document.country,
            numberSuffix: verification.document.number
              ? verification.document.number.slice(-4)
              : null,
          }
        : null,
      decisionTime: new Date().toISOString(),
    };

    // Update session
    await supabase
      .from('kyc_sessions')
      .update({
        status,
        decision_payload: safePayload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id);

    if (status === 'approved') {
      // Update subject KYC status
      const { error: updateError } = await supabase
        .from('kyc_subjects')
        .update({
          kyc_status: 'verified',
          kyc_provider: 'veriff',
          kyc_session_id: sessionId,
          kyc_verified_at: new Date().toISOString(),
          first_name: safePayload.person?.firstName,
          last_name: safePayload.person?.lastName,
          date_of_birth: safePayload.person?.dateOfBirth,
          document_type: safePayload.document?.type,
          document_country: safePayload.document?.country,
        })
        .eq('user_handle', session.user_handle);

      if (updateError) {
        console.error('[kyc-webhook] Failed to update subject:', updateError);
      } else {
        console.log(
          `[kyc-webhook] KYC approved for ${session.user_handle} — now eligible for high-value token purchases`
        );

        // Write kyc/veriff strand to identity strands table
        try {
          const { data: holder } = await supabase
            .from('path402_holders')
            .select('id')
            .eq('user_handle', session.user_handle)
            .maybeSingle();

          if (holder) {
            const { data: identityToken } = await supabase
              .from('path402_identity_tokens')
              .select('id')
              .eq('holder_id', holder.id)
              .maybeSingle();

            if (identityToken) {
              const { error: strandError } = await supabase
                .from('path401_identity_strands')
                .upsert(
                  {
                    identity_token_id: identityToken.id,
                    provider: 'veriff',
                    strand_type: 'kyc',
                    strand_subtype: 'veriff',
                    label: 'Veriff KYC',
                    source: 'veriff',
                    on_chain: false,
                  },
                  { onConflict: 'identity_token_id,provider' }
                );

              if (strandError) {
                console.error('[kyc-webhook] Failed to write strand:', strandError);
              } else {
                console.log(
                  `[kyc-webhook] Strand kyc/veriff written for ${session.user_handle} — identity now Sovereign Lv.4`
                );
              }
            }
          }
        } catch (strandErr) {
          console.error('[kyc-webhook] Error writing strand:', strandErr);
        }
      }
    } else if (status === 'declined') {
      await supabase
        .from('kyc_subjects')
        .update({
          kyc_status: 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('user_handle', session.user_handle);

      console.log(`[kyc-webhook] KYC declined for ${session.user_handle}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Webhook processing failed';
    console.error('[kyc-webhook] Error:', msg);
    // Always return 200 to prevent Veriff retries on our errors
    return NextResponse.json({ ok: true });
  }
}
