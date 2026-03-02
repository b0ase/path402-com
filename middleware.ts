import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const host = request.headers.get('host') || '';

  // Rewrite /$402 to /token-402 ($ in folder names breaks Vercel deploys)
  if (pathname === '/$402' || pathname === '/%24402') {
    return NextResponse.rewrite(new URL('/token-402', request.url));
  }

  // Only rewrite the root path for host-based routing
  if (pathname !== '/') return NextResponse.next();

  if (host.includes('path401')) {
    return NextResponse.rewrite(new URL('/401', request.url));
  }

  if (host.includes('path403')) {
    return NextResponse.rewrite(new URL('/403', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/$402', '/%24402'],
};
