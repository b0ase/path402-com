import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateHolder } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authToken = searchParams.get('authToken');
    const redirect = searchParams.get('redirect') || '/token';

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://path402.com').trim();

    if (!authToken) {
      return NextResponse.redirect(`${baseUrl}/token?error=no_token`);
    }

    // Fetch user profile from HandCash
    const profileResponse = await fetch('https://cloud.handcash.io/v2/users/currentUserProfile', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!profileResponse.ok) {
      console.error('Failed to fetch HandCash profile');
      return NextResponse.redirect(`${baseUrl}/token?error=profile_fetch_failed`);
    }

    const profile = await profileResponse.json();
    const handle = profile.publicProfile?.handle;
    const paymail = profile.publicProfile?.paymail;

    if (!handle) {
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
