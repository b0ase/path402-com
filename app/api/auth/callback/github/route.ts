/**
 * GET /api/auth/callback/github
 * GitHub OAuth callback - exchanges code for token and writes oauth/github strand
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

interface GithubUser {
  login: string;
  id: number;
  name?: string;
  avatar_url?: string;
}

interface GithubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');

    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    // Decode state
    let stateData: { handle: string; returnTo: string; timestamp: number } = {
      handle: '',
      returnTo: '/identity',
      timestamp: 0,
    };

    if (state) {
      try {
        stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      } catch (e) {
        console.error('[github-callback] Failed to decode state:', e);
        return NextResponse.json(
          { error: 'Invalid state parameter' },
          { status: 400 }
        );
      }
    }

    const userHandle = stateData.handle;
    const returnTo = stateData.returnTo || '/identity';

    if (!userHandle) {
      return NextResponse.json(
        { error: 'Invalid state: no user handle' },
        { status: 400 }
      );
    }

    // Exchange code for access token
    console.log('[github-callback] Exchanging code for token');

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/github`,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('[github-callback] Token exchange failed:', error);
      return NextResponse.json(
        { error: 'Failed to exchange code for token' },
        { status: 500 }
      );
    }

    const tokenData: GithubTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('[github-callback] No access token in response');
      return NextResponse.json(
        { error: 'Invalid token response' },
        { status: 500 }
      );
    }

    // Fetch GitHub user profile
    console.log('[github-callback] Fetching GitHub user profile');

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      const error = await userResponse.text();
      console.error('[github-callback] Failed to fetch user profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch GitHub profile' },
        { status: 500 }
      );
    }

    const githubUser: GithubUser = await userResponse.json();

    console.log(`[github-callback] GitHub user: ${githubUser.login}`);

    // Write strand to database
    const supabase = createAdminClient();

    // Look up holder
    const { data: holder } = await supabase
      .from('path402_holders')
      .select('id')
      .eq('user_handle', userHandle)
      .maybeSingle();

    if (!holder) {
      console.error(`[github-callback] Holder not found: ${userHandle}`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Look up identity token
    const { data: identityToken } = await supabase
      .from('path402_identity_tokens')
      .select('id')
      .eq('holder_id', holder.id)
      .maybeSingle();

    if (!identityToken) {
      console.error(
        `[github-callback] No identity token found for ${userHandle}`
      );
      return NextResponse.json(
        { error: 'Identity token not found. Please create one first.' },
        { status: 404 }
      );
    }

    // Write or update oauth/github strand
    const { error: strandError } = await supabase
      .from('path401_identity_strands')
      .upsert(
        {
          identity_token_id: identityToken.id,
          provider: 'github',
          strand_type: 'oauth',
          strand_subtype: 'github',
          label: githubUser.login,
          source: 'github_oauth',
          on_chain: false,
        },
        { onConflict: 'identity_token_id,provider' }
      );

    if (strandError) {
      console.error('[github-callback] Failed to write strand:', strandError);
      return NextResponse.json(
        { error: 'Failed to link GitHub account' },
        { status: 500 }
      );
    }

    console.log(
      `[github-callback] GitHub account ${githubUser.login} linked for ${userHandle}`
    );

    // Redirect back to identity page
    return NextResponse.redirect(
      new URL(returnTo, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'GitHub OAuth callback failed';
    console.error('[github-callback] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
