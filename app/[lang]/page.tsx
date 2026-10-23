import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import TrustBar, { type TrustProof } from '@/components/TrustBar'
import TourRows from '@/components/TourRows'
import WhyChoose from '@/components/WhyChoose'
import HowItWorks from '@/components/HowItWorks'
import ServiceCards from '@/components/ServiceCards'
import HomeReviews, { type HomeReviewRow } from '@/components/HomeReviews'
import JsonLd from '@/components/JsonLd'
import LatestPosts from '@/components/blog/LatestPosts'
import { getPosts } from '@/lib/blog'
import { getAllTours, getFeaturedTours, getHeroSlides } from '@/lib/cms'
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
  const [tours, posts, allTours, heroSlides] = await Promise.all([getFeaturedTours(), getPosts(), getAllTours(), getHeroSlides()])
  const { ready, upcoming } = splitComingSoon(tours)
  // The hero routes a picked tour type to a booking page when the category holds
  // exactly one ready tour, so it only needs each ready tour's slug and category
  const heroTours = ready.map((tour) => ({ slug: tour.slug, category: tour.category }))

  // Real ratings only: the proof strip shows the row with the most reviews (the tour pages' rule),
  // and the reviews section lists every row. Both stay hidden while the CMS holds no ratings.
  const reviewRows: HomeReviewRow[] = allTours
    .flatMap((tour) => tour.ratings.map((rating) => ({ tour, rating })))
    .sort((a, b) => (b.rating.count ?? 0) - (a.rating.count ?? 0))
    .slice(0, 6)
  const best = reviewRows.find((r) => r.rating.rating != null && r.rating.count != null)?.rating
  const proof: TrustProof | null = best
    ? { rating: best.rating as number, count: best.count as number, source: best.source, url: best.url }
    : null

  return (
    <main>
      <JsonLd data={organizationJsonLd(lang)} />
      <Hero slides={heroSlides} tours={heroTours} />
      <TrustBar lang={lang} proof={proof} />
      <TourRows tours={ready} upcoming={upcoming} />
      <HowItWorks />
      <ServiceCards />
      <LatestPosts posts={posts} />
      <WhyChoose />
      <HomeReviews rows={reviewRows} />
    </main>
  )
}
