import { NextResponse } from 'next/server';

function clearSession() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://path402.com').trim();
  const response = NextResponse.redirect(`${baseUrl}/exchange`);

  response.cookies.set('hc_handle', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });

  response.cookies.set('hc_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });

  return response;
}

export async function GET() {
  return clearSession();
}

export async function POST() {
  return clearSession();
}
