'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { CURRENCY, formatPrice, type Service } from '@/lib/tours'
import { whatsappLink } from '@/lib/contact'
import { WhatsAppIcon } from './Icons'
import { fromLabel } from './ServiceCards'
import { useSite, type DictKey } from './SiteProvider'

/** A service page's content, in the visitor's chosen language */
export default function ServiceDetail({ service }: { service: Service }) {
  const { lang, t, href } = useSite()
  // The summary is already under the title, so only the full description goes here
  const paragraphs = service.body[lang]
  const included = service.included[lang]
  const facts = [
    { label: t('capacity'), value: service.capacity?.[lang] },
    { label: t('duration'), value: service.duration?.[lang] },
  ].filter((f) => f.value)
  const unit = (u: string) => (u ? t(`unit_${u}` as DictKey) ?? '' : '')

  return (
    <main>
      <div className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-bg" style={service.image ? { backgroundImage: `url(${service.image})`, opacity: 0.35 } : undefined} />
        <div className="wa-container hero-content">
          <div className="badge-hero">{t('navServices')}</div>
          <h1>{service.title[lang]}</h1>
          {service.summary[lang] && <p style={{ marginBottom: 0 }}>{service.summary[lang]}</p>}
        </div>
      </div>

      <section className="section">
        <div className="wa-container detail-grid">
          <div className="flex flex-col gap-6">
            {(paragraphs.length > 0 || facts.length > 0) && (
              <div className="panel">
                {facts.length > 0 && (
                  <ul className="tour-facts" style={{ marginBottom: 12 }}>
                    {facts.map((f) => (
                      <li key={f.label}><span><strong>{f.label}:</strong> {f.value}</span></li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-col gap-3">
                  {paragraphs.map((p) => (
                    <p key={p} style={{ color: 'var(--stone-600)', fontSize: 14 }}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            {included.length > 0 && (
              <div className="panel">
                <h2 className="section-title" style={{ fontSize: 20, marginBottom: 12 }}>{t('included')}</h2>
                <ul className="tour-facts">
                  {included.map((item) => (
                    <li key={item}><Check size={16} /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {service.priceOptions.length > 0 && (
              <div className="panel">
                <h2 className="section-title" style={{ fontSize: 20, marginBottom: 12 }}>{t('prices')}</h2>
                <table className="price-table">
                  <tbody>
                    {service.priceOptions.map((o) => (
                      <tr key={o.label.EN}>
                        <td>{o.label[lang]}</td>
                        <td>
                          {o.price == null ? t('priceOnRequest') : `${formatPrice(o.price)} ${CURRENCY}`}
                          {o.price != null && o.unit && <small> {unit(o.unit)}</small>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Link href={href('/')} style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{t('backHome')}</Link>
          </div>

          <div>
            <div className="panel" style={{ position: 'sticky', top: 90, boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', marginBottom: 16 }}>{fromLabel(service, t)}</div>
              <a href={whatsappLink(service.whatsappText)} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ width: '100%', padding: 12 }}>
                <WhatsAppIcon />
                <span>{t('enquire')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
