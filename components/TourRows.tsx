'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatPrice, privateTourService, type Category, type Tour } from '@/lib/tours'
import { askAboutLink } from '@/lib/contact'
import { scrollToTours, useSite, type DictKey, type Lang } from './SiteProvider'
import TourCover, { CATEGORY_ICONS } from './TourCover'
import TourModal from './TourModal'

type T = (key: DictKey) => string

export function priceLabel(tour: Tour, t: T) {
  if (tour.price === 0) return t('free')
  if (tour.price == null) return t('priceOnRequest')
  return formatPrice(tour.price)
}

/** All tours in rows by category, plus the private tours bubble */
export default function TourRows({ tours, title }: { tours: Tour[]; title?: string }) {
  const { t, lang, categories, services } = useSite()
  const [selected, setSelected] = useState<Tour | null>(null)
  const privateTours = privateTourService(services)

  // A row per category that has tours, then one shared row for categories that are coming soon
  const other: Lang = lang === 'EN' ? 'ZH' : 'EN'
  const rows = categories
    .filter((c) => tours.some((p) => p.category === c.key))
    .map((c) => ({
      id: `tours-${c.key}`,
      title: c.title[lang],
      subtitle: c.title[other] !== c.title[lang] ? c.title[other] : '',
      blurb: c.blurb[lang],
      cards: tours.filter((p) => p.category === c.key).map((tour) => <TourCard key={tour.id} tour={tour} t={t} lang={lang} onOpen={() => setSelected(tour)} />),
    }))
  const soon = categories.filter((c) => c.comingSoon && !tours.some((p) => p.category === c.key))
  if (soon.length > 0) {
    rows.push({
      id: 'tours-soon',
      title: t('comingSoon'),
      subtitle: '',
      blurb: t('soonBlurb'),
      cards: soon.map((c) => <ComingSoonCard key={c.key} category={c} t={t} lang={lang} />),
    })
  }
  const PrivateIcon = CATEGORY_ICONS.private

  return (
    <section id="tours" className="section">
      <div className="wa-container">
        <div className="section-header">
          <div>
            <span className="section-sub">{t('toursSub')}</span>
            <h2 className="section-title">{title ?? t('toursTitle')}</h2>
          </div>
          <Link href={`/services/${privateTours.slug}`} className="private-bubble">
            <span className="private-bubble-icon"><PrivateIcon size={18} /></span>
            <span>
              <strong>{privateTours.title[lang]}</strong>
              <small>{privateTours.summary[lang]}</small>
            </span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="filter-tabs" style={{ marginBottom: 28 }}>
          {rows.map((row) => (
            <button key={row.id} onClick={() => scrollToTours(row.id)} className="filter-btn">
              {row.title}
            </button>
          ))}
        </div>

        {rows.map((row) => (
          <div key={row.id} id={row.id} className="tour-row">
            <div className="tour-row-head">
              <h3 className="tour-row-title">{row.title}</h3>
              {row.subtitle && <span className="tour-row-subtitle">{row.subtitle}</span>}
              <p>{row.blurb}</p>
            </div>
            <div className="tour-grid">{row.cards}</div>
          </div>
        ))}
      </div>

      {selected && <TourModal tour={selected} price={priceLabel(selected, t)} onClose={() => setSelected(null)} />}
    </section>
  )
}

function TourCard({ tour, t, lang, onOpen }: { tour: Tour; t: T; lang: Lang; onOpen: () => void }) {
  const facts = [tour.startTime?.[lang], tour.duration?.[lang]].filter(Boolean).join(' • ')

  return (
    <div className="tour-card">
      <div className="tour-img-wrap">
        <TourCover category={tour.category} image={tour.image} alt={tour.title[lang]} />
        {tour.comingSoon && <div className="tour-badge">{t('detailsSoon')}</div>}
        <div className="tour-loc">{tour.location[lang]}</div>
      </div>
      <div className="tour-body">
        <div>
          <h3 className="tour-title">{tour.title[lang]}</h3>
          {facts && <p className="tour-meta">{facts}</p>}
          <p className="tour-desc">{tour.desc[lang]}</p>
        </div>
        <div className="tour-footer">
          <div>
            {tour.price === 0 && <span className="tour-price-label">{t('tipsWelcome')}</span>}
            <span className={`tour-price ${tour.price == null ? 'tour-price-ask' : ''}`}>{priceLabel(tour, t)}</span>
          </div>
          {tour.comingSoon ? (
            <a
              href={askAboutLink(`the ${tour.title.EN}`)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ padding: '6px 12px', fontSize: 11 }}
            >
              {t('askWhatsApp')}
            </a>
          ) : (
            <button onClick={onOpen} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 11 }}>
              {t('viewTour')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ComingSoonCard({ category, t, lang }: { category: Category; t: T; lang: Lang }) {
  return (
    <div className="tour-card">
      <div className="tour-img-wrap">
        <TourCover category={category.key} alt={category.title[lang]} />
        <div className="tour-badge">{t('comingSoon')}</div>
      </div>
      <div className="tour-body">
        <div>
          <h3 className="tour-title">{category.title[lang]}</h3>
          <p className="tour-desc">{category.blurb[lang]}</p>
        </div>
        <div className="tour-footer">
          <span className="tour-price tour-price-ask">{t('comingSoon')}</span>
          <a
            href={askAboutLink(category.title.EN)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: 11 }}
          >
            {t('askWhatsApp')}
          </a>
        </div>
      </div>
    </div>
  )
}
