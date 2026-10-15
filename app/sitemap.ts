import type { MetadataRoute } from 'next'
import { getAllTours, getServices } from '@/lib/cms'
import { HTML_LANG, LANGS } from '@/lib/i18n'
import { absoluteUrl } from '@/lib/seo'

// Built on each request, so new tours and services from the CMS are listed straight away
export const dynamic = 'force-dynamic'

/** Every page in English and Chinese, each pointing to its other-language version */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, services] = await Promise.all([getAllTours(), getServices()])
  const paths = [
    '/',
    '/tours',
    // Tours whose details aren't out yet are left out until they are
    ...tours.filter((t) => !t.comingSoon).map((t) => `/tours/${t.slug}`),
    ...services.map((s) => `/services/${s.slug}`),
  ]
  return paths.flatMap((path) => {
    const languages = Object.fromEntries(LANGS.map((l) => [HTML_LANG[l], absoluteUrl(l, path)]))
    return LANGS.map((lang) => ({ url: absoluteUrl(lang, path), alternates: { languages } }))
  })
}
