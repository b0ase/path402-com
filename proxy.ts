import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * X Protocol Proxy
 *
 * Handles host-based routing AND x402 subdomain tenant extraction.
 *
 * CNAME pattern: x402.npgx.website → path402.com
 * Host header will be: x402.npgx.website
 * Extracted domain: npgx.website
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''

  // Extract tenant domain from x-protocol subdomains
  const xMatch = host.match(/^x40[123]\.(.+)$/)
  if (xMatch) {
    const response = pathname === '/'
      ? NextResponse.rewrite(new URL('/402', request.url))
      : NextResponse.next()

    response.headers.set('x-tenant-domain', xMatch[1])
    response.headers.set('x-protocol-layer', host.startsWith('x402') ? 'x402' : host.startsWith('x401') ? 'x401' : 'x403')
    return response
  }

  // Legacy host-based routing (root path only)
  if (pathname === '/') {
    if (host.includes('path401')) {
      return NextResponse.rewrite(new URL('/401', request.url))
    }
    if (host.includes('path403')) {
      return NextResponse.rewrite(new URL('/403', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/api/:path*', '/.well-known/:path*'],
}
