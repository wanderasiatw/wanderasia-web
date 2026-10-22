import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import TourRows from '@/components/TourRows'
import WhyChoose from '@/components/WhyChoose'
import HowItWorks from '@/components/HowItWorks'
import ServiceCards from '@/components/ServiceCards'
import JsonLd from '@/components/JsonLd'
import LatestPosts from '@/components/blog/LatestPosts'
import { getPosts } from '@/lib/blog'
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
  const [tours, posts] = await Promise.all([getFeaturedTours(), getPosts()])
  const { ready, upcoming } = splitComingSoon(tours)

  return (
    <main>
      <JsonLd data={organizationJsonLd(lang)} />
      <Hero tours={ready} />
      <TrustBar lang={lang} />
      <TourRows tours={ready} upcoming={upcoming} />
      <HowItWorks />
      <ServiceCards />
      <LatestPosts posts={posts} />
      <WhyChoose />
    </main>
  )
}
