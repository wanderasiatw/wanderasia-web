'use client'

import { scrollToTours, useSite } from './SiteProvider'

const DESTINATIONS = [
  { key: 'Japan', name: 'Japan', places: 'Tokyo, Mt. Fuji, Kyoto', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop' },
  { key: 'Taiwan', name: 'Taiwan', places: 'Taipei, Jiufen, Sun Moon Lake', image: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=600&auto=format&fit=crop' },
  { key: 'Korea', name: 'South Korea', places: 'Seoul, Nami Island, Busan', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=600&auto=format&fit=crop' },
  { key: 'Thailand', name: 'Thailand', places: 'Bangkok, Chiang Mai, Phuket', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=600&auto=format&fit=crop' },
]

export default function Destinations() {
  const { t, setFilter } = useSite()

  return (
    <section id="destinations" className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--slate-200)' }}>
      <div className="wa-container">
        <div className="section-header">
          <div>
            <span className="section-sub">{t('destSub')}</span>
            <h2 className="section-title">{t('destTitle')}</h2>
          </div>
        </div>

        <div className="dest-grid">
          {DESTINATIONS.map((d) => (
            <div
              key={d.key}
              className="dest-card"
              onClick={() => {
                setFilter({ dest: d.key, type: 'ALL' })
                scrollToTours()
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.image} alt={d.name} />
              <div className="dest-overlay">
                <h3>{d.name}</h3>
                <p>{d.places}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
