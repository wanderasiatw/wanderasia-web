import type { Metadata } from 'next'
import { getTourBySlug } from '@/lib/cms'
import { langFromParam, translate } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { whatsappLink } from '@/lib/contact'
import { getBooking, isBookingDemo } from '@/lib/booking/server'
import BookingView from '@/components/booking/BookingView'

// Always the booking's latest state
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ lang: string; ref: string }>
  searchParams: Promise<{ t?: string | string[]; paid?: string | string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: param, ref } = await params
  const lang = langFromParam(param) ?? 'EN'
  return pageMetadata(lang, `/booking/${ref}`, { title: translate(lang, 'metaBookingTitle'), noindex: true })
}

/** A booking, opened with its secret link: payment while unpaid, then the confirmation */
export default async function BookingPage({ params, searchParams }: Props) {
  const [{ lang: param, ref }, q] = await Promise.all([params, searchParams])
  const lang = langFromParam(param) ?? 'EN'
  const token = typeof q.t === 'string' ? q.t : ''
  const booking = await getBooking(decodeURIComponent(ref), token)

  if (!booking) {
    return (
      <main>
        <section className="section">
          <div className="wa-container" style={{ maxWidth: 640 }}>
            <div className="panel flex flex-col gap-3">
              <h1 className="book-step-title">{translate(lang, 'bookingNotFound')}</h1>
              <p>{translate(lang, 'bookingNotFoundText')}</p>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ alignSelf: 'flex-start' }}>
                {translate(lang, 'askWhatsApp')}
              </a>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const tour = await getTourBySlug(booking.tourSlug)
  return (
    <BookingView
      key={`${booking.ref}-${booking.status}`}
      initial={booking}
      tour={tour ? { slug: tour.slug, title: tour.title, image: tour.image, category: tour.category, meetingPoint: tour.meetingPoint, duration: tour.duration } : null}
      demo={isBookingDemo()}
      returned={q.paid === '1'}
    />
  )
}
