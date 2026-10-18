'use client'

import { useSite } from './SiteProvider'
import { HOW_IT_WORKS } from '@/lib/home-content'

/** Three steps from choosing a tour to meeting the guide */
export default function HowItWorks() {
  const { lang } = useSite()
  return (
    <section className="section how-section">
      <div className="wa-container">
        <div className="text-center how-head">
          <span className="section-sub">{HOW_IT_WORKS.sub[lang]}</span>
          <h2 className="section-title">{HOW_IT_WORKS.title[lang]}</h2>
        </div>
        <ol className="how-grid">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <li key={step.title.EN} className="how-step">
              <span className="how-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title[lang]}</h3>
              <p>{step.text[lang]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
