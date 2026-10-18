'use client'

import { useSite } from './SiteProvider'
import { ChatIcon, DollarIcon, PenIcon, PinIcon } from './Icons'
import { WHY_FEATURES } from '@/lib/home-content'

const ICONS = { pin: PinIcon, dollar: DollarIcon, pen: PenIcon, chat: ChatIcon }

export default function WhyChoose() {
  const { t, lang } = useSite()
  return (
    <section id="about" className="section why-section">
      <div className="wa-container">
        <div className="text-center" style={{ maxWidth: 600, margin: '0 auto 40px auto' }}>
          <span className="section-sub" style={{ color: 'var(--brand-gold)' }}>{t('whySub')}</span>
          <h2 className="section-title" style={{ color: 'var(--ivory)', marginTop: 4 }}>{t('whyTitle')}</h2>
        </div>

        <div className="features-grid">
          {WHY_FEATURES.map(({ icon, title, text }) => {
            const Icon = ICONS[icon]
            return (
              <div key={title.EN} className="feature-card">
                <div className="feature-icon"><Icon /></div>
                <h3>{title[lang]}</h3>
                <p>{text[lang]}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
