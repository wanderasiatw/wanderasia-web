'use client'

import Link from 'next/link'
import { CURRENCY, categoryOf, formatPrice, type Tour } from '@/lib/tours'
import { askAboutLink } from '@/lib/contact'
import BookingForm from './BookingForm'
import TourFacts from './TourFacts'
import { useSite } from './SiteProvider'

/** The tour page's content, in the visitor's chosen language */
export default function TourDetail({ tour }: { tour: Tour }) {
  const { lang, t, href, categories } = useSite()
  const category = categoryOf(categories, tour.category)
  const summary = [tour.startTime?.[lang], tour.duration?.[lang]].filter(Boolean).join(' • ')
  const paragraphs = tour.body[lang].length > 0 ? tour.body[lang] : [tour.desc[lang]]
  const highlights = tour.highlights[lang]

  return (
    <main>
      <div className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-bg" style={tour.image ? { backgroundImage: `url(${tour.image})`, opacity: 0.35 } : undefined} />
        <div className="wa-container hero-content">
          <div className="badge-hero">{category?.title[lang]} • {tour.location[lang]}</div>
          <h1>{tour.title[lang]}</h1>
          {summary && <p style={{ marginBottom: 0 }}>{summary}</p>}
        </div>
      </div>

      <section className="section">
        <div className="wa-container detail-grid">
          <div className="flex flex-col gap-6">
            <div className="panel">
              <h2 className="section-title" style={{ fontSize: 20, marginBottom: 12 }}>{t('aboutTour')}</h2>
              <TourFacts tour={tour} />
              <div className="flex flex-col gap-3" style={{ marginTop: 12 }}>
                {paragraphs.map((p) => (
                  <p key={p} style={{ color: 'var(--stone-600)', fontSize: 14 }}>{p}</p>
                ))}
              </div>
              {tour.note && <p className="tour-note">{tour.note[lang]}</p>}
            </div>

            {tour.tastings.length > 0 && (
              <div className="panel">
                <h2 className="section-title" style={{ fontSize: 20, marginBottom: 4 }}>{t('tasteTitle')}</h2>
                <p style={{ color: 'var(--stone-600)', fontSize: 13, marginBottom: 14 }}>{t('tasteBlurb')}</p>
                <div className="tasting-grid">
                  {tour.tastings.map((f) => (
                    <figure key={f.name} className="tasting-card">
                      {f.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.image} alt={lang === 'ZH' && f.zh ? f.zh : f.name} />
                      ) : (
                        <div className="tasting-tile" lang="zh-Hant">{f.zh}</div>
                      )}
                      <figcaption>
                        {f.name}
                        <span lang="zh-Hant">{f.zh}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

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

            <Link href={href('/tours')} style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{t('backToTours')}</Link>
          </div>

          <div>
            <div className="panel" style={{ position: 'sticky', top: 90, boxShadow: 'var(--shadow-lg)' }}>
              <span style={{ fontSize: 11, color: 'var(--stone-400)' }}>{t('pricePerPerson')}</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)', marginBottom: 16 }}>
                {tour.price === 0 ? t('free') : tour.price == null ? <span style={{ fontSize: 20 }}>{t('priceOnRequest')}</span> : formatPrice(tour.price)}{' '}
                {tour.price ? <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>{CURRENCY}</span> : null}
              </div>
              {tour.comingSoon ? (
                <a href={askAboutLink(`the ${tour.title.EN}`)} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ width: '100%', padding: 12 }}>
                  {t('soonAskWhatsApp')}
                </a>
              ) : (
                <BookingForm tourTitle={tour.title.EN} />
              )}
              <Link href={href(`/inquire?item=tours:${tour.slug}`)} className="btn btn-outline" style={{ width: '100%', padding: 12, marginTop: 10 }}>
                {t('preferEmail')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
