import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllTours, getTourBySlug } from '@/lib/cms'
import { currencyOf, type Tour } from '@/lib/tours'
import { HTML_LANG, langFromParam, translate } from '@/lib/i18n'
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, providerJsonLd, tourAggregateRating } from '@/lib/seo'
import TourDetail from '@/components/TourDetail'
import JsonLd from '@/components/JsonLd'
import { getDepartures, nextAvailable } from '@/lib/booking/server'

// Pages are rendered on each request so CMS changes show up without a rebuild
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: param, slug } = await params
  const lang = langFromParam(param) ?? 'EN'
  const tour = await getTourBySlug(slug)
  if (!tour) return {}
  // The CMS SEO fields are in English, so the other languages use their own title and summary
  const title = lang === 'EN' ? (tour.seoTitle ?? `${tour.title.EN} | Wander Asia`) : `${tour.title[lang]} | ${translate(lang, 'siteName')}`
  const description = lang === 'EN' ? (tour.seoDescription ?? tour.desc.EN) : tour.desc[lang]
  // Tours whose details aren't out yet stay out of search results until they are
  return pageMetadata(lang, `/tours/${tour.slug}`, { title, description, image: tour.image, noindex: tour.comingSoon })
}

export default async function TourDetailPage({ params }: Props) {
  const { lang: param, slug } = await params
  const lang = langFromParam(param) ?? 'EN'
  const tour = await getTourBySlug(slug)
  if (!tour) notFound()

  // Tours this one suggests at the end of its page, resolved from the CMS related list
  const allTours = tour.relatedTours.length > 0 ? await getAllTours() : []
  const related = tour.relatedTours.map((slug) => allTours.find((x) => x.slug === slug)).filter((x): x is Tour => Boolean(x))

  // Online booking shows when the CMS has dates for this tour; otherwise the WhatsApp booking form does
  const departures = await getDepartures(tour)
  const first = departures?.[0]
  const booking = first ? { price: first.price, currency: first.currency, nextDate: nextAvailable(departures)?.date ?? null } : null

  const path = `/tours/${tour.slug}`
  const trip = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title[lang],
    description: tour.desc[lang],
    url: absoluteUrl(lang, path),
    image: tour.image ? [tour.image] : undefined,
    inLanguage: HTML_LANG[lang],
    provider: providerJsonLd(),
    aggregateRating: tourAggregateRating(tour),
    offers:
      tour.price == null
        ? undefined
        : { '@type': 'Offer', price: tour.price, priceCurrency: currencyOf(tour), url: absoluteUrl(lang, path), availability: 'https://schema.org/InStock' },
  }
  const crumbs = breadcrumbJsonLd(lang, [
    { name: translate(lang, 'home'), path: '/' },
    { name: translate(lang, 'tours'), path: '/tours' },
    { name: tour.title[lang], path },
  ])

  return (
    <>
      {!tour.comingSoon && <JsonLd data={[trip, crumbs]} />}
      <TourDetail tour={tour} booking={booking} related={related} />
    </>
  )
}
