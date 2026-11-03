import type { Metadata } from 'next'
import { CONTACT } from './contact'
import { HTML_LANG, LANGS, OG_LOCALE, localePath, translate, type Lang } from './i18n'
import type { Tour } from './tours'
import type { CmsPage } from './cms'

/** The site's public address. Read on each request: on Cloudflare, environment variables are only available while handling one. */
export function siteUrl() {
  return (process.env.SITE_URL || 'https://wanderasia.tw').replace(/\/+$/, '')
}

/** Absolute URL of a site path in the given language */
export function absoluteUrl(lang: Lang, path: string) {
  return `${siteUrl()}${localePath(lang, path)}`
}

/** hreflang links for a page: each language's address, with English as the default for everyone else */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const l of LANGS) languages[HTML_LANG[l]] = localePath(l, path)
  languages['x-default'] = localePath('EN', path)
  return languages
}

/** Social preview picture for pages without one of their own (1920×1280) */
const DEFAULT_SHARE_IMAGE = '/images/hero-jiufen.jpg'

/** Title, description, canonical address, other-language address and social preview for one page */
export function pageMetadata(
  lang: Lang,
  path: string,
  { title, description, image, noindex }: { title: string; description?: string; image?: string; noindex?: boolean },
): Metadata {
  const other = LANGS.filter((l) => l !== lang)
  // Pages without their own picture share the Jiufen hero photo, so links shared on WhatsApp, Facebook or LINE always show an image
  const shareImage = image || DEFAULT_SHARE_IMAGE
  return {
    title,
    description,
    alternates: { canonical: localePath(lang, path), languages: languageAlternates(path) },
    openGraph: {
      title,
      description,
      type: 'website',
      url: localePath(lang, path),
      siteName: translate(lang, 'siteName'),
      locale: OG_LOCALE[lang],
      alternateLocale: other.map((l) => OG_LOCALE[l]),
      images: [shareImage],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

/**
 * Metadata for a fixed page that can be edited in CMS Page text. The English page uses the CMS SEO title and
 * description when they are filled in; every language otherwise uses the page's own heading and intro in that
 * language. Until the page is published in the CMS, the built-in title and description are used.
 */
export function cmsPageMetadata(
  lang: Lang,
  path: string,
  page: CmsPage | null,
  fallback: { title: string; description?: string; noindex?: boolean },
): Metadata {
  if (!page) return pageMetadata(lang, path, fallback)
  const heading = `${page.title[lang]} | ${translate(lang, 'siteName')}`
  const title = lang === 'EN' ? (page.seoTitle ?? heading) : heading
  const description = (lang === 'EN' ? page.seoDescription : undefined) ?? page.intro?.[lang] ?? fallback.description
  return pageMetadata(lang, path, { title, description, image: page.image, noindex: fallback.noindex })
}

/** The website itself: tells Google to show "Wander Asia" as the site name in results instead of the bare domain */
export function websiteJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl()}/#website`,
    name: 'Wander Asia',
    alternateName: ['漫遊亞洲', 'wanderasia.tw'],
    url: `${siteUrl()}/`,
    inLanguage: HTML_LANG[lang],
    publisher: { '@id': `${siteUrl()}/#organization` },
  }
}

/** The business itself, as schema.org data for search engines */
export function organizationJsonLd(lang: Lang) {
  // Links that tell Google the website and the Google Business Profile are the same business
  const sameAs = [CONTACT.googleMapsUrl, ...CONTACT.socialProfiles].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${siteUrl()}/#organization`,
    name: 'Wander Asia',
    alternateName: '漫遊亞洲',
    url: absoluteUrl(lang, '/'),
    // Google needs a raster logo (PNG/JPG, at least 112×112); the SVG isn't accepted for this
    logo: `${siteUrl()}/icon.png`,
    image: `${siteUrl()}${DEFAULT_SHARE_IMAGE}`,
    description: translate(lang, 'metaDesc'),
    email: CONTACT.email,
    telephone: CONTACT.whatsapp.replace(/\s+/g, ''),
    areaServed: { '@type': 'Country', name: 'Taiwan' },
    ...(CONTACT.googleMapsUrl ? { hasMap: CONTACT.googleMapsUrl } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

/**
 * Schema.org aggregate rating for a tour, from its real CMS platform scores only:
 * the row with the most reviews represents the tour. Missing when no row has
 * both a score and a review count — never estimated or invented.
 */
export function tourAggregateRating(tour: Tour): object | undefined {
  const rows = tour.ratings.filter((r) => r.rating != null && r.count != null)
  if (rows.length === 0) return undefined
  const best = rows.reduce((a, b) => ((b.count ?? 0) > (a.count ?? 0) ? b : a))
  return { '@type': 'AggregateRating', ratingValue: best.rating, reviewCount: best.count }
}

/** The provider block used inside tour and service data */
export function providerJsonLd() {
  return { '@type': 'TravelAgency', '@id': `${siteUrl()}/#organization`, name: 'Wander Asia', url: siteUrl() }
}

/** Home › … › this page, as schema.org breadcrumbs */
export function breadcrumbJsonLd(lang: Lang, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absoluteUrl(lang, item.path) })),
  }
}
