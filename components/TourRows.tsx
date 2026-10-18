'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatPrice, privateTourService, type Tour, type TourCategory } from '@/lib/tours'
import { askAboutLink } from '@/lib/contact'
import { scrollToTours, useSite, type DictKey, type Lang } from './SiteProvider'
import TourCover, { CATEGORY_ICONS } from './TourCover'
import { WhatsAppIcon } from './Icons'

type T = (key: DictKey) => string

export function priceLabel(tour: Tour, t: T) {
  if (tour.price === 0) return t('free')
  if (tour.price == null) return t('priceOnRequest')
  return formatPrice(tour.price)
}

/**
 * Tours that are ready, in rows by category; everything still on the way in one "coming soon" strip; plus the private tours bubble.
 * `tours` are the ready ones and `upcoming` the categories of tours whose details aren't out yet (see splitComingSoon).
 */
export default function TourRows({ tours, upcoming, title }: { tours: Tour[]; upcoming: TourCategory[]; title?: string }) {
  const { t, lang, href, categories, services } = useSite()
  const privateTours = privateTourService(services)

  const other: Lang = lang === 'EN' ? 'ZH' : 'EN'
  const rows = categories
    .filter((c) => tours.some((p) => p.category === c.key))
    .map((c) => ({
      id: `tours-${c.key}`,
      title: c.title[lang],
      subtitle: c.title[other] !== c.title[lang] ? c.title[other] : '',
      blurb: c.blurb[lang],
      tours: tours.filter((p) => p.category === c.key),
    }))
  // Categories with nothing ready yet: flagged "coming soon" in the CMS, or only holding tours whose details aren't out
  const soon = categories.filter(
    (c) => !tours.some((p) => p.category === c.key) && (c.comingSoon || upcoming.includes(c.key)),
  )
  const tabs = [...rows.map((r) => ({ id: r.id, title: r.title })), ...(soon.length > 0 ? [{ id: 'tours-soon', title: t('comingSoon') }] : [])]
  const PrivateIcon = CATEGORY_ICONS.private

  return (
    <section id="tours" className="section">
      <div className="wa-container">
        <div className="section-header">
          <div>
            <span className="section-sub">{t('toursSub')}</span>
            <h2 className="section-title">{title ?? t('toursTitle')}</h2>
          </div>
          <Link href={href(`/services/${privateTours.slug}`)} className="private-bubble">
            <span className="private-bubble-icon"><PrivateIcon size={18} /></span>
            <span>
              <strong>{privateTours.title[lang]}</strong>
              <small>{privateTours.summary[lang]}</small>
            </span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Jump links only help once there are two or more rows of tours */}
        {rows.length > 1 && (
          <div className="filter-tabs" style={{ marginBottom: 28 }}>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => scrollToTours(tab.id)} className="filter-btn">
                {tab.title}
              </button>
            ))}
          </div>
        )}

        {rows.map((row) => (
          <div key={row.id} id={row.id} className="tour-row">
            <div className="tour-row-head">
              <h3 className="tour-row-title">{row.title}</h3>
              {row.subtitle && <span className="tour-row-subtitle">{row.subtitle}</span>}
              <p>{row.blurb}</p>
            </div>
            <div className="tour-grid">
              {row.tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} t={t} lang={lang} href={href(`/tours/${tour.slug}`)} />
              ))}
            </div>
          </div>
        ))}

        {soon.length > 0 && (
          <div id="tours-soon" className="soon-strip">
            <div>
              <h3 className="tour-row-title">{t('comingSoon')}</h3>
              <p>{t('soonBlurb')}</p>
            </div>
            <ul className="soon-list">
              {soon.map((c) => (
                // Each keeps its row's anchor, so footer links to it still land here
                <li key={c.key} id={`tours-${c.key}`}>
                  <a href={askAboutLink(c.title.EN)} target="_blank" rel="noreferrer" className="soon-chip">
                    <WhatsAppIcon size={14} />
                    <span>{c.title[lang]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/** A tour card; the whole card links to the tour's page */
function TourCard({ tour, t, lang, href }: { tour: Tour; t: T; lang: Lang; href: string }) {
  const facts = [tour.startTime?.[lang], tour.duration?.[lang]].filter(Boolean).join(' • ')

  return (
    <article className="tour-card">
      <div className="tour-img-wrap">
        <TourCover category={tour.category} image={tour.image} alt={tour.title[lang]} />
        <div className="tour-loc">{tour.location[lang]}</div>
      </div>
      <div className="tour-body">
        <div>
          <h3 className="tour-title">
            <Link href={href} className="tour-card-link">{tour.title[lang]}</Link>
          </h3>
          {facts && <p className="tour-meta">{facts}</p>}
          <p className="tour-desc">{tour.desc[lang]}</p>
        </div>
        <div className="tour-footer">
          <div>
            {tour.price === 0 && <span className="tour-price-label">{t('tipsWelcome')}</span>}
            <span className={`tour-price ${tour.price == null ? 'tour-price-ask' : ''}`}>{priceLabel(tour, t)}</span>
          </div>
          {/* Looks like a button; the card's link covers it */}
          <span className="btn btn-primary" aria-hidden="true" style={{ padding: '6px 12px', fontSize: 11 }}>
            {t('viewTour')}
          </span>
        </div>
      </div>
    </article>
  )
}
