import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getTourBySlug } from '@/lib/cms'
import { fill, langFromParam, localePath, translate } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { getDepartures, isBookingDemo, turnstileSiteKey } from '@/lib/booking/server'
import BookingFlow from '@/components/booking/BookingFlow'

// Seats change all the time, so this is rendered on each visit
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ lang: string; slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: param, slug } = await params
  const lang = langFromParam(param) ?? 'EN'
  const tour = await getTourBySlug(slug)
  if (!tour) return {}
  return pageMetadata(lang, `/tours/${tour.slug}/book`, { title: fill(translate(lang, 'metaBookTitle'), { tour: tour.title[lang] }), noindex: true })
}

const one = (v: string | string[] | undefined) => (typeof v === 'string' ? v : undefined)
const num = (v: string | string[] | undefined) => (one(v) && !Number.isNaN(Number(v)) ? Number(v) : undefined)

export default async function BookTourPage({ params, searchParams }: Props) {
  const [{ lang: param, slug }, q] = await Promise.all([params, searchParams])
  const lang = langFromParam(param) ?? 'EN'
  const tour = await getTourBySlug(slug)
  if (!tour) notFound()

  // Tours that can't be booked online yet go back to their page, where the WhatsApp form is
  const departures = await getDepartures(tour)
  if (!departures) {
    const keep = new URLSearchParams()
    if (one(q.date)) keep.set('date', one(q.date)!)
    if (one(q.a)) keep.set('a', one(q.a)!)
    const qs = keep.toString()
    redirect(localePath(lang, `/tours/${tour.slug}`) + (qs ? `?${qs}` : ''))
  }

  return (
    <BookingFlow
      tour={tour}
      departures={departures}
      demo={isBookingDemo()}
      turnstileKey={turnstileSiteKey()}
      start={{ step: num(q.step), date: one(q.date), dep: one(q.dep), adults: num(q.a), children: num(q.c) }}
    />
  )
}
