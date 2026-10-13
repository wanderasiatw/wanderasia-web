import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTourBySlug } from '@/lib/cms'
import TourDetail from '@/components/TourDetail'

// Pages are rendered on each request so CMS changes show up without a rebuild
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tour = await getTourBySlug(slug)
  if (!tour) return {}
  const title = tour.seoTitle ?? `${tour.title.EN} | Wander Asia`
  const description = tour.seoDescription ?? tour.desc.EN
  return {
    title,
    description,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: { title, description, type: 'website', images: tour.image ? [tour.image] : undefined },
  }
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params
  const tour = await getTourBySlug(slug)
  if (!tour) notFound()
  return <TourDetail tour={tour} />
}
