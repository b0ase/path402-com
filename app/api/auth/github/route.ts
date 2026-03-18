/**
 * GET /api/auth/github
 * Initiates GitHub OAuth flow for identity linking
 */

import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';

export async function GET(request: NextRequest) {
  try {
    if (!GITHUB_CLIENT_ID) {
      console.error('[github-oauth] GITHUB_CLIENT_ID not configured');
      return NextResponse.json(
        { error: 'GitHub OAuth not configured' },
        { status: 503 }
      );
    }

    const userHandle = request.cookies.get('hc_handle')?.value;

    if (!userHandle) {
      return NextResponse.json(
        { error: 'Not authenticated. Please connect HandCash first.' },
        { status: 401 }
      );
    }

    // Get return_to param from query, default to /identity
    const returnTo = request.nextUrl.searchParams.get('return_to') || '/identity';

    // Encode state with user handle and return URL
    const state = Buffer.from(
      JSON.stringify({
        handle: userHandle,
        returnTo,
        timestamp: Date.now(),
      })
    ).toString('base64');

    // Redirect to GitHub OAuth
    const githubUrl = new URL('https://github.com/login/oauth/authorize');
    githubUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
    githubUrl.searchParams.set('scope', 'read:user');
    githubUrl.searchParams.set('state', state);
    githubUrl.searchParams.set(
      'redirect_uri',
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/github`
    );

    console.log(`[github-oauth] Initiating GitHub OAuth for ${userHandle}`);

    return NextResponse.redirect(githubUrl.toString());
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to initiate GitHub OAuth';
    console.error('[github-oauth] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
