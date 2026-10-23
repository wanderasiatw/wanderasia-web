import type { Metadata } from 'next'
import { CONTACT } from './contact'
import { HTML_LANG, LANGS, OG_LOCALE, localePath, translate, type Lang } from './i18n'
import type { Tour } from './tours'

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

/** Title, description, canonical address, other-language address and social preview for one page */
export function pageMetadata(
  lang: Lang,
  path: string,
  { title, description, image, noindex }: { title: string; description?: string; image?: string; noindex?: boolean },
): Metadata {
  const other = LANGS.filter((l) => l !== lang)
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
      images: image ? [image] : undefined,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

/** The business itself, as schema.org data for search engines */
export function organizationJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${siteUrl()}/#organization`,
    name: 'Wander Asia',
    alternateName: '漫遊亞洲',
    url: absoluteUrl(lang, '/'),
    logo: `${siteUrl()}/logo.svg`,
    image: `${siteUrl()}/logo.svg`,
    description: translate(lang, 'metaDesc'),
    email: CONTACT.email,
    areaServed: { '@type': 'Country', name: 'Taiwan' },
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
