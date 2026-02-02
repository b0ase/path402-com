import { NextRequest, NextResponse } from 'next/server';
import { getInstance, Connect } from '@handcash/sdk';
import { getOrCreateHolder } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authToken = searchParams.get('authToken');
    const redirect = searchParams.get('redirect') || '/token';

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://path402.com').trim();
    const appId = process.env.HANDCASH_APP_ID?.trim();
    const appSecret = process.env.HANDCASH_APP_SECRET?.trim();

    if (!authToken) {
      return NextResponse.redirect(`${baseUrl}/token?error=no_token`);
    }

    if (!appId || !appSecret) {
      console.error('HANDCASH_APP_ID or HANDCASH_APP_SECRET not configured');
      return NextResponse.redirect(`${baseUrl}/token?error=config_error`);
    }

    // Initialize HandCash SDK
    const sdk = getInstance({
      appId,
      appSecret,
    });

    // Get account client for this user
    const client = sdk.getAccountClient(authToken);

    // Fetch user profile using SDK
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result;
    try {
      result = await Connect.getCurrentUserProfile({ client: client as any });
      console.log('HandCash profile result:', JSON.stringify(result, null, 2));
    } catch (profileError) {
      console.error('HandCash profile fetch exception:', profileError);
      return NextResponse.redirect(`${baseUrl}/token?error=profile_fetch_failed&reason=exception`);
    }

    if (result.error) {
      console.error('Failed to fetch HandCash profile - error:', result.error);
      return NextResponse.redirect(`${baseUrl}/token?error=profile_fetch_failed&reason=api_error`);
    }

    if (!result.data) {
      console.error('Failed to fetch HandCash profile - no data:', result);
      return NextResponse.redirect(`${baseUrl}/token?error=profile_fetch_failed&reason=no_data`);
    }

    const profile = result.data;
    const handle = profile?.publicProfile?.handle;
    const paymail = profile?.publicProfile?.paymail;

    if (!handle) {
      console.error('No handle in profile:', profile);
      return NextResponse.redirect(`${baseUrl}/token?error=no_handle`);
    }

    // Register/get the holder
    await getOrCreateHolder(
      paymail || `${handle}@handcash.io`,
      'handcash',
      undefined,
      handle
    );

    // Create response with redirect and set cookie for session
    const response = NextResponse.redirect(`${baseUrl}${redirect}`);

    // Set session cookies
    response.cookies.set('hc_handle', handle, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set('hc_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('HandCash callback error:', error);
    const errorUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://path402.com').trim();
    return NextResponse.redirect(`${errorUrl}/token?error=callback_failed`);
  }
}
