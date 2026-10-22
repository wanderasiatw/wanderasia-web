'use client'

import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import { categoryOf, currencyOf, formatPrice, type Tour } from '@/lib/tours'
import { askAboutLink, whatsappLink } from '@/lib/contact'
import { fill } from '@/lib/i18n'
import { formatDate, formatMoney } from '@/lib/booking/types'
import BookingForm from './BookingForm'
import TourFacts from './TourFacts'
import TourGallery from './TourGallery'
import { PracticalDetails, PoliciesBlock, RatingChips, RatingsBlock, RelatedTours } from './TourExtras'
import StickyBookBar from './StickyBookBar'
import { useSite } from './SiteProvider'

/** Online booking for the tour, when the CMS has dates for it: price per adult and the first date with seats */
export interface TourBooking {
  price: number
  currency: string
  nextDate: string | null
}

/** The tour page's content, in the visitor's chosen language */
export default function TourDetail({ tour, booking, related = [] }: { tour: Tour; booking?: TourBooking | null; related?: Tour[] }) {
  const { lang, t, href, categories } = useSite()
  const category = categoryOf(categories, tour.category)
  const summary = [tour.startTime?.[lang], tour.duration?.[lang]].filter(Boolean).join(' • ')
  const paragraphs = tour.body[lang].length > 0 ? tour.body[lang] : [tour.desc[lang]]
  const highlights = tour.highlights[lang]
  const hasEssentials = Boolean(tour.meetingPoint || tour.startTime || tour.duration || tour.facts.length > 0 || tour.ratings.length > 0)
  // The guest cap for the WhatsApp form, read from a "group size" key fact when the CMS states one
  const capFact = tour.facts.find((f) => f.icon === 'users' || f.icon === 'group')
  const maxGuests = capFact ? Number(capFact.text.EN.match(/\d+/)?.[0]) || undefined : undefined

  return (
    <main>
      <div className={tour.image ? 'hero hero-photo' : 'hero'} style={{ padding: '60px 0' }}>
        <div className="hero-bg" style={tour.image ? { backgroundImage: `url(${tour.image})` } : undefined} />
        <div className="wa-container hero-content">
          <div className="hero-badges">
            <div className="badge-hero">{category?.title[lang]} • {tour.location[lang]}</div>
            {tour.badge && <span className="badge-chip">{tour.badge[lang]}</span>}
          </div>
          <h1>{tour.title[lang]}</h1>
          {tour.subtitle && <p className="hero-subtitle">{tour.subtitle[lang]}</p>}
          {summary && <p style={{ marginBottom: 0 }}>{summary}</p>}
        </div>
      </div>

      {hasEssentials && (
        <div className="essentials-band">
          <div className="wa-container essentials-inner">
            <TourFacts tour={tour} />
            <RatingChips tour={tour} />
          </div>
        </div>
      )}

      <section className="section">
        <div className="wa-container detail-grid">
          <div className="flex flex-col gap-6">
            <TourGallery tour={tour} />

            <div className="panel">
              <h2 className="section-title" style={{ fontSize: 20, marginBottom: 12 }}>{t('aboutTour')}</h2>
              <div className="flex flex-col gap-3 journey-steps">
                {paragraphs.map((p) => (
                  <p key={p} style={{ color: 'var(--stone-600)', fontSize: 14 }}>{p}</p>
                ))}
              </div>
              {tour.note && <p className="tour-note">{tour.note[lang]}</p>}
            </div>

            {highlights.length > 0 && (
              <div className="panel">
                <h2 className="section-title" style={{ fontSize: 20, marginBottom: 12 }}>{t('highlights')}</h2>
                <div className="flex flex-col gap-3">
                  {highlights.map((h, i) => (
                    <div key={h} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: 12, fontSize: 14 }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <PracticalDetails tour={tour} />

            {tour.tastings.length > 0 && (
              <div className="panel">
                <h2 className="section-title" style={{ fontSize: 20, marginBottom: 4 }}>{t('tasteTitle')}</h2>
                <p style={{ color: 'var(--stone-600)', fontSize: 13, marginBottom: 14 }}>{t('tasteBlurb')}</p>
                <div className="tasting-grid">
                  {tour.tastings.map((f) => {
                    // The tasting's name in the page's language, when there is one
                    const localName = lang === 'ZH' ? f.zh : lang === 'ZH_HANS' ? (f.zhHans ?? f.zh) : lang === 'JA' ? f.ja : lang === 'KO' ? f.ko : undefined
                    return (
                    <figure key={f.name} className="tasting-card">
                      {f.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.image} alt={localName || f.name} loading="lazy" decoding="async" />
                      ) : (
                        <div className="tasting-tile" lang={lang === 'ZH_HANS' ? 'zh-Hans' : 'zh-Hant'}>{lang === 'ZH_HANS' ? (f.zhHans ?? f.zh) : f.zh}</div>
                      )}
                      <figcaption>
                        {f.name}
                        <span lang="zh-Hant">{f.zh}</span>
                      </figcaption>
                    </figure>
                    )
                  })}
                </div>
              </div>
            )}

            <RatingsBlock tour={tour} />
            <PoliciesBlock tour={tour} />

            <Link href={href('/tours')} style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{t('backToTours')}</Link>
          </div>

          <div>
            <div className="panel" id="book" style={{ position: 'sticky', top: 90, boxShadow: 'var(--shadow-lg)' }}>
              <span style={{ fontSize: 11, color: 'var(--stone-400)' }}>{t('pricePerPerson')}</span>
              {booking ? (
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)', marginBottom: 16 }}>
                  {booking.price === 0 ? t('free') : formatMoney(booking.price, booking.currency)}{' '}
                  {booking.price && booking.currency === 'USD' ? <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>USD</span> : null}
                </div>
              ) : (
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)', marginBottom: 16 }}>
                  {tour.price === 0 ? t('free') : tour.price == null ? <span style={{ fontSize: 20 }}>{t('priceOnRequest')}</span> : formatPrice(tour.price, currencyOf(tour))}{' '}
                  {tour.price && currencyOf(tour) === 'USD' ? <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>USD</span> : null}
                </div>
              )}
              {tour.freeCancellation && (
                <p className="cancel-note" style={{ marginTop: -8, marginBottom: 14 }}>
                  <BadgeCheck size={15} />
                  <span>{tour.cancelHours ? fill(t('freeCancelUntil'), { hours: tour.cancelHours }) : t('freeCancellation')}</span>
                </p>
              )}
              {booking && !tour.comingSoon ? (
                <>
                  {booking.nextDate && (
                    <p className="tour-book-meta">
                      <strong>{fill(t('nextAvailable'), { date: formatDate(booking.nextDate, lang, false) })}</strong>
                    </p>
                  )}
                  <Link href={href(`/tours/${tour.slug}/book`)} className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 15 }}>
                    {t('bookNow')}
                  </Link>
                  <a href={whatsappLink(`Hi Wander Asia! I have a question about the ${tour.title.EN}.`)} target="_blank" rel="noreferrer" className="link-quiet">
                    {t('askQuestion')}
                  </a>
                </>
              ) : tour.comingSoon ? (
                <a href={askAboutLink(`the ${tour.title.EN}`)} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ width: '100%', padding: 12 }}>
                  {t('soonAskWhatsApp')}
                </a>
              ) : (
                <BookingForm tourTitle={tour.title.EN} price={tour.price} currency={currencyOf(tour)} maxGuests={maxGuests} />
              )}
              <Link href={href(`/inquire?item=tours:${tour.slug}`)} className="btn btn-outline" style={{ width: '100%', padding: 12, marginTop: 10 }}>
                {t('preferEmail')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedTours tours={related} />
      <StickyBookBar tour={tour} booking={booking} />
    </main>
  )
}
