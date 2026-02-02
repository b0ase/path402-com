import { NextResponse } from 'next/server';

// Temporary debug endpoint - DELETE after fixing
export async function GET() {
  const appId = process.env.HANDCASH_APP_ID?.trim();
  const appSecret = process.env.HANDCASH_APP_SECRET?.trim();

  return NextResponse.json({
    appId: appId ? {
      length: appId.length,
      first4: appId.slice(0, 4),
      last4: appId.slice(-4),
    } : 'NOT SET',
    appSecret: appSecret ? {
      length: appSecret.length,
      first4: appSecret.slice(0, 4),
      last4: appSecret.slice(-4),
    } : 'NOT SET',
    env: process.env.NODE_ENV,
  });
}
