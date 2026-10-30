import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllTours, getForm, getGuides, getReviews, getServiceBySlug } from '@/lib/cms'
import { currencyOf, fromPrice } from '@/lib/tours'
import { HTML_LANG, langFromParam, translate } from '@/lib/i18n'
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, providerJsonLd } from '@/lib/seo'
import ServiceDetail from '@/components/ServiceDetail'
import PrivateTourPage from '@/components/PrivateTourPage'
import { DEFAULT_FAQS } from '@/lib/private-tour'
import JsonLd from '@/components/JsonLd'

// Pages are rendered on each request so CMS changes show up without a rebuild
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: param, slug } = await params
  const lang = langFromParam(param) ?? 'EN'
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  // The CMS SEO fields are in English, so the other languages use their own title and summary
  const title = lang === 'EN' ? (service.seoTitle ?? `${service.title.EN} | Wander Asia`) : `${service.title[lang]} | ${translate(lang, 'siteName')}`
  const description = lang === 'EN' ? (service.seoDescription ?? service.summary.EN) : service.summary[lang]
  return pageMetadata(lang, `/services/${service.slug}`, { title, description, image: service.image })
}

export default async function ServicePage({ params }: Props) {
  const { lang: param, slug } = await params
  const lang = langFromParam(param) ?? 'EN'
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  const path = `/services/${service.slug}`
  const price = fromPrice(service)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title[lang],
    description: service.summary[lang],
    url: absoluteUrl(lang, path),
    image: service.image ? [service.image] : undefined,
    inLanguage: HTML_LANG[lang],
    provider: providerJsonLd(),
    areaServed: { '@type': 'Country', name: 'Taiwan' },
    offers: price == null ? undefined : { '@type': 'Offer', price, priceCurrency: currencyOf(service), url: absoluteUrl(lang, path) },
  }
  const crumbs = breadcrumbJsonLd(lang, [
    { name: translate(lang, 'home'), path: '/' },
    { name: service.title[lang], path },
  ])

  if (service.kind === 'private-tour') {
    const [tours, reviews, guides, form] = await Promise.all([getAllTours(), getReviews(), getGuides(), getForm('inquiry')])
    const faqs = service.faqs.length > 0 ? service.faqs : DEFAULT_FAQS
    const faqData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: HTML_LANG[lang],
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question[lang], acceptedAnswer: { '@type': 'Answer', text: f.answer[lang] } })),
    }
    return (
      <>
        <JsonLd data={[data, crumbs, faqData]} />
        <PrivateTourPage service={service} tours={tours} reviews={reviews} guides={guides} form={form} />
      </>
    )
  }

  return (
    <>
      <JsonLd data={[data, crumbs]} />
      <ServiceDetail service={service} />
    </>
  )
}
