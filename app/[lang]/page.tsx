import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import TourRows from '@/components/TourRows'
import WhyChoose from '@/components/WhyChoose'
import ServiceCards from '@/components/ServiceCards'
import JsonLd from '@/components/JsonLd'
import { getFeaturedTours } from '@/lib/cms'
import { splitComingSoon } from '@/lib/tours'
import { langFromParam, translate } from '@/lib/i18n'
import { organizationJsonLd, pageMetadata } from '@/lib/seo'

// Rendered on each request so CMS changes show up without a rebuild
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return pageMetadata(lang, '/', { title: translate(lang, 'metaTitle'), description: translate(lang, 'metaDesc') })
}

export default async function HomePage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  const { ready, upcoming } = splitComingSoon(await getFeaturedTours())

  return (
    <main>
      <JsonLd data={organizationJsonLd(lang)} />
      <Hero />
      <TrustBar lang={lang} />
      <TourRows tours={ready} upcoming={upcoming} />
      <ServiceCards />
      <WhyChoose />
    </main>
  )
}
