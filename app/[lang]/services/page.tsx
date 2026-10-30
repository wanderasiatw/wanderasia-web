import type { Metadata } from 'next'
import { getPage, getReviews, getServices } from '@/lib/cms'
import { langFromParam, translate } from '@/lib/i18n'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'
import ServicesHub from '@/components/ServicesHub'
import JsonLd from '@/components/JsonLd'

// Rendered on each request so CMS changes show up without a rebuild
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return pageMetadata(lang, '/services', { title: translate(lang, 'metaServicesTitle'), description: translate(lang, 'servicesBlurb') })
}

export default async function ServicesPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  const [services, page, reviews] = await Promise.all([getServices(), getPage('services'), getReviews()])
  const privateTour = services.find((s) => s.kind === 'private-tour') ?? null
  const crumbs = breadcrumbJsonLd(lang, [
    { name: translate(lang, 'home'), path: '/' },
    { name: translate(lang, 'navServices'), path: '/services' },
  ])

  return (
    <>
      <JsonLd data={crumbs} />
      <ServicesHub services={services} privateTour={privateTour} page={page} reviews={reviews} />
    </>
  )
}
