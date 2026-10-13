'use client'

import Link from 'next/link'
import { categoryOf, type Tour } from '@/lib/tours'
import BookingForm from './BookingForm'
import TourCover from './TourCover'
import TourFacts from './TourFacts'
import { useSite } from './SiteProvider'

export default function TourModal({ tour, price, onClose }: { tour: Tour; price: string; onClose: () => void }) {
  const { lang } = useSite()
  const category = categoryOf(tour.category)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-img">
          <TourCover category={tour.category} image={tour.image} alt={tour.title} />
          <button onClick={onClose} className="modal-close" aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold-text)', textTransform: 'uppercase', letterSpacing: 1 }}>
            {category?.title[lang]} • {tour.location}
          </span>
          <h3 className="modal-title" style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{tour.title}</h3>

          <TourFacts tour={tour} />

          <p style={{ fontSize: 13, color: 'var(--stone-600)', margin: '12px 0' }}>{tour.desc}</p>

          {tour.tastings.length > 0 && (
            <div className="tasting-chips" style={{ marginBottom: 14 }}>
              {tour.tastings.map((f) => (
                <span key={f.name} className="tasting-chip">{f.name} <span lang="zh-Hant">{f.zh}</span></span>
              ))}
            </div>
          )}

          <div className="modal-price">
            <span>Price / person</span>
            <strong>{price}</strong>
          </div>
          {tour.note && <p style={{ fontSize: 12, color: 'var(--gold-text)', fontWeight: 600, marginBottom: 14 }}>{tour.note}</p>}

          <BookingForm tourTitle={tour.title} />

          <Link href={`/tours/${tour.slug}`} style={{ display: 'block', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginTop: 12 }}>
            See full tour details →
          </Link>
        </div>
      </div>
    </div>
  )
}
