import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTourBySlug } from '@/lib/cms'
import TourDetail from '@/components/TourDetail'

export const revalidate = 60

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tour = await getTourBySlug(params.slug)
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
  const tour = await getTourBySlug(params.slug)
  if (!tour) notFound()
  return <TourDetail tour={tour} />
}
