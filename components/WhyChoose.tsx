'use client'

import { useSite } from './SiteProvider'
import { ChatIcon, DollarIcon, PenIcon, PinIcon } from './Icons'

const FEATURES = [
  { Icon: PinIcon, title: 'Local Taiwan Expertise', desc: 'Headquartered in Taipei with guides who know hidden gems, night markets, and authentic culture.' },
  { Icon: DollarIcon, title: 'Transparent Pricing', desc: '100% upfront pricing with zero mandatory shopping stops or unexpected extra fees.' },
  { Icon: PenIcon, title: 'Tailor-Made Trips', desc: 'Custom itineraries for families, couples, and corporate groups with full flexibility.' },
  { Icon: ChatIcon, title: '24/7 Dedicated Support', desc: 'Real-time LINE messaging support throughout your entire journey in Asia.' },
]

export default function WhyChoose() {
  const { t } = useSite()
  return (
    <section id="about" className="section why-section">
      <div className="wa-container">
        <div className="text-center" style={{ maxWidth: 600, margin: '0 auto 40px auto' }}>
          <span className="section-sub" style={{ color: '#2dd4bf' }}>{t('whySub')}</span>
          <h2 className="section-title" style={{ color: 'white', marginTop: 4 }}>{t('whyTitle')}</h2>
        </div>

        <div className="features-grid">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon"><Icon /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
