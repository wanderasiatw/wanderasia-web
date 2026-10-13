'use client'

import { useSite } from './SiteProvider'

// NOTE: placeholder reviews copied from the design sample.
// Replace these with real customer reviews before launch.
const REVIEWS = [
  { initials: 'SM', name: 'Sarah Mitchell', trip: 'Taiwan Tour • Nov 2024', text: 'Unforgettable experience in Taiwan! Our guide made Jiufen and Sun Moon Lake feel so authentic. Seamless WhatsApp support.', avatar: {} },
]

export default function Testimonials() {
  const { t } = useSite()
  return (
    <section id="reviews" className="section">
      <div className="wa-container">
        <div className="text-center" style={{ maxWidth: 600, margin: '0 auto 30px auto' }}>
          <span className="section-sub">{t('revSub')}</span>
          <h2 className="section-title">{t('revTitle')}</h2>
        </div>

        <div className="testimonials-grid">
          {REVIEWS.map((r) => (
            <div key={r.name} className="review-card">
              <div>
                <div className="review-header">
                  <div className="avatar" style={r.avatar}>{r.initials}</div>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 800 }}>{r.name}</h4>
                    <span style={{ fontSize: 10, color: 'var(--stone-400)' }}>{r.trip}</span>
                  </div>
                </div>
                <p className="review-text">&ldquo;{r.text}&rdquo;</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold-text)' }}>★★★★★ Google Review</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
