'use client'

import { useState } from 'react'
import type { Tour } from '@/lib/tours'
import { formatPrice } from '@/lib/tours'
import { useSite } from './SiteProvider'
import TourModal from './TourModal'

const TABS = [
  { key: 'ALL', label: null },
  { key: 'Japan', label: '🇯🇵 Japan' },
  { key: 'Taiwan', label: '🇹🇼 Taiwan' },
  { key: 'Korea', label: '🇰🇷 Korea' },
  { key: 'Thailand', label: '🇹🇭 Thailand' },
]

export default function FeaturedTours({ tours, title }: { tours: Tour[]; title?: string }) {
  const { t, filter, setFilter } = useSite()
  const [selected, setSelected] = useState<Tour | null>(null)

  const visible = tours.filter(
    (p) =>
      (filter.dest === 'ALL' || p.destination === filter.dest) &&
      (filter.type === 'ALL' || p.type === filter.type)
  )

  return (
    <section id="tours" className="section">
      <div className="wa-container">
        <div className="section-header">
          <div>
            <span className="section-sub">{t('toursSub')}</span>
            <h2 className="section-title">{title ?? t('toursTitle')}</h2>
          </div>
          <div className="filter-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter({ dest: tab.key, type: 'ALL' })}
                className={`filter-btn ${filter.dest === tab.key ? 'active' : ''}`}
              >
                {tab.label ?? t('viewAll')}
              </button>
            ))}
          </div>
        </div>

        <div className="tour-grid">
          {visible.length === 0 && <p className="empty-state">{t('noTours')}</p>}
          {visible.map((pkg) => (
            <div key={pkg.id} className="tour-card">
              <div className="tour-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pkg.image} alt={pkg.title} className="tour-img" />
                <div className="tour-badge">★ {pkg.rating}</div>
                <div className="tour-loc">{pkg.destination}</div>
              </div>
              <div className="tour-body">
                <div>
                  <h3 className="tour-title">{pkg.title}</h3>
                  <p className="tour-desc">{pkg.desc}</p>
                </div>
                <div className="tour-footer">
                  <div>
                    <span className="tour-price-label">{t('from')}</span>
                    <span className="tour-price">{formatPrice(pkg.price)}</span>
                  </div>
                  <button onClick={() => setSelected(pkg)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 11 }}>
                    {t('viewPackage')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <TourModal tour={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
