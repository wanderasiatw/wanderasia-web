import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceBySlug } from '@/lib/cms'
import ServiceDetail from '@/components/ServiceDetail'

export const revalidate = 60

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)
  if (!service) return {}
  const title = service.seoTitle ?? `${service.title.EN} | Wander Asia`
  const description = service.seoDescription ?? service.summary.EN
  return {
    title,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title, description, type: 'website', images: service.image ? [service.image] : undefined },
  }
}

export default async function ServicePage({ params }: Props) {
  const service = await getServiceBySlug(params.slug)
  if (!service) notFound()
  return <ServiceDetail service={service} />
}
