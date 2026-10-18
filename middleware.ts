import { NextResponse, type NextRequest } from 'next/server'

/**
 * Language in the address: English pages have no prefix (/tours), Chinese pages start with /zh (/zh/tours).
 * Every page lives under app/[lang], so English addresses are served from /en internally, and /en/... addresses
 * redirect to the prefix-free ones so each page has a single English address.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/zh' || pathname.startsWith('/zh/')) return NextResponse.next()

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
