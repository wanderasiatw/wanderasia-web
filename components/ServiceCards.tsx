'use client'

import Link from 'next/link'
import { currencyOf, formatPrice, fromPrice, type Service } from '@/lib/tours'
import { useSite, type DictKey } from './SiteProvider'
import ServiceCover from './ServiceCover'

/** "From $45" / "$45 起", or "Price on request" */
export function fromLabel(service: Service, t: (key: DictKey) => string) {
  const price = fromPrice(service)
  return price == null ? t('priceOnRequest') : t('fromPrice').replace('{price}', formatPrice(price, currencyOf(service)))
}

/** The home page's services section: featured services as cards */
export default function ServiceCards() {
  const { t, lang, href, services } = useSite()
  const featured = services.filter((s) => s.featured)
  if (featured.length === 0) return null

  return (
    <section id="services" className="section" style={{ paddingTop: 0 }}>
      <div className="wa-container">
        <div className="section-header">
          <div>
            <span className="section-sub">{t('servicesSub')}</span>
            <h2 className="section-title">{t('servicesTitle')}</h2>
          </div>
        </div>
        {/* A lone service gets a wide card so the row doesn't look empty */}
        <div className={featured.length === 1 ? 'service-single' : 'tour-grid'}>
          {featured.map((s) => (
            <div key={s.id} className="tour-card">
              <div className="tour-img-wrap">
                <ServiceCover kind={s.kind} image={s.image} alt={s.title[lang]} />
              </div>
              <div className="tour-body">
                <div>
                  <h3 className="tour-title">{s.title[lang]}</h3>
                  <p className="tour-desc">{s.summary[lang]}</p>
                </div>
                <div className="tour-footer">
                  <span className={`tour-price ${fromPrice(s) == null ? 'tour-price-ask' : ''}`}>{fromLabel(s, t)}</span>
                  <Link href={href(`/services/${s.slug}`)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 11 }}>
                    {t('learnMore')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
