import { NextResponse, type NextRequest } from 'next/server'

/**
 * Language in the address: English pages have no prefix (/tours); the other languages start with their prefix
 * (/zh Traditional Chinese, /zh-cn Simplified Chinese, /ja Japanese, /ko Korean).
 * Every page lives under app/[lang], so English addresses are served from /en internally, and /en/... addresses
 * redirect to the prefix-free ones so each page has a single English address.
 */
const PREFIXED = ['/zh-cn', '/zh', '/ja', '/ko']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PREFIXED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next()

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }

  const url = req.nextUrl.clone()
  url.pathname = pathname === '/' ? '/en' : `/en${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Pages only: skip Next.js internals, API routes (/api/inquire) and files such as /logo.svg, /sitemap.xml and /robots.txt
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
}
