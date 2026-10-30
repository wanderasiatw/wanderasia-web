'use client'

import Link from 'next/link'
import { ArrowRight, Check, ChevronDown, Clock, Users, X } from 'lucide-react'
import type { PublicForm } from '@/lib/cms'
import { whatsappLink } from '@/lib/contact'
import { HERO } from '@/lib/home-content'
import { SH } from '@/lib/services-hub'
import { currencyOf, formatPrice, fromPrice, type Service } from '@/lib/tours'
import InquiryForm from './InquiryForm'
import { WhatsAppIcon } from './Icons'
import ServiceCover from './ServiceCover'
import { useSite, type DictKey } from './SiteProvider'

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

/**
 * The page of a service other than private tours (e.g. trip planning, airport transfer, car with driver):
 * photo hero, options and prices, description, what's included, FAQ, a "combine with a private tour"
 * prompt and the quote form. Every part comes from the CMS service and hides itself when empty.
 */
export default function ServiceDetail({ service, form, privateTour }: { service: Service; form?: PublicForm | null; privateTour?: Service | null }) {
  const { lang, t, href } = useSite()
  const currency = currencyOf(service)
  const unit = (u: string) => (u ? (t(`unit_${u}` as DictKey) ?? '') : '')
  const from = fromPrice(service)
  const paragraphs = service.body[lang]
  const included = service.included[lang]
  const notIncluded = service.notIncluded[lang]
  const facts = [
    { icon: Users, value: service.capacity?.[lang] },
    { icon: Clock, value: service.duration?.[lang] },
  ].filter((f) => f.value)

  return (
    <main className="pt-page">
      <section className={`hero pt-hero sh-detail-hero${service.image ? ' hero-photo' : ''}`}>
        <div className="hero-bg" style={service.image ? { backgroundImage: `url(${service.image})` } : undefined} />
        <div className="wa-container hero-content">
          <div className="badge-hero">{t('navServices')}</div>
          <h1>{service.title[lang]}</h1>
          {service.summary[lang] && <p className="pt-summary">{service.summary[lang]}</p>}
          {facts.length > 0 && (
            <ul className="pt-trust">
              {facts.map(({ icon: Icon, value }) => (
                <li key={value}><Icon size={14} /> {value}</li>
              ))}
            </ul>
          )}
          <div className="pt-hero-price">{from == null ? SH.freeQuote[lang] : t('fromPrice').replace('{price}', formatPrice(from, currency))}</div>
          <div className="pt-hero-ctas">
            <button type="button" className="btn btn-gold" onClick={() => scrollTo('send')}>
              {SH.getQuote[lang]} <ArrowRight size={16} />
            </button>
            <a href={whatsappLink(service.whatsappText)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <WhatsAppIcon /> {t('enquire')}
            </a>
          </div>
        </div>
        {!service.image && (
          <p className="hero-credit">
            {HERO.photo.place[lang]} · <a href={HERO.photo.source} target="_blank" rel="noreferrer">{HERO.photo.author}</a>,{' '}
            <a href={HERO.photo.licenseUrl} target="_blank" rel="noreferrer license">{HERO.photo.license}</a>
          </p>
        )}
      </section>

      {service.priceOptions.length > 0 && (
        <section className="section pt-builder">
          <div className="wa-container">
            <div className="text-center how-head">
              <h2 className="section-title">{SH.options[lang]}</h2>
            </div>
            <div className="sh-ways">
              {service.priceOptions.map((p, i) => (
                <button key={p.label.EN + i} type="button" className="pt-package sh-way" onClick={() => scrollTo('send')}>
                  {p.badge && <span className="pt-package-badge">{p.badge[lang]}</span>}
                  <span className="pt-package-name">{p.label[lang]}</span>
                  {p.duration && <span className="pt-package-meta"><Clock size={13} /> {p.duration[lang]}</span>}
                  {p.detail && <span className="pt-package-detail">{p.detail[lang]}</span>}
                  <span className="pt-package-price">
                    {p.price == null ? SH.freeQuote[lang] : (
                      <>
                        {formatPrice(p.price, currency)} <small>{unit(p.unit)}</small>
                      </>
                    )}
                  </span>
                  <span className="sh-way-cta">{SH.getQuote[lang]} <ArrowRight size={14} /></span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {(paragraphs.length > 0 || included.length > 0) && (
        <section className="section pt-fit">
          <div className={`wa-container ${paragraphs.length > 0 && included.length > 0 ? 'pt-fit-grid' : ''}`}>
            {paragraphs.length > 0 && (
              <div className="panel">
                <h2 className="section-title pt-panel-title">{SH.about[lang]}</h2>
                <div className="flex flex-col gap-3">
                  {paragraphs.map((p) => <p key={p} className="sh-body">{p}</p>)}
                </div>
              </div>
            )}
            {included.length > 0 && (
              <div className="panel">
                <h2 className="section-title pt-panel-title">{t('included')}</h2>
                <ul className="pt-fit-list">
                  {included.map((item) => <li key={item}><Check size={16} />{item}</li>)}
                </ul>
                {notIncluded.length > 0 && (
                  <>
                    <h3 className="pt-sub-title">{t('notIncluded')}</h3>
                    <ul className="pt-fit-list pt-not">
                      {notIncluded.map((item) => <li key={item}><X size={16} />{item}</li>)}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {privateTour && (
        <section className="section sh-combo-section">
          <div className="wa-container">
            <Link href={href(`/services/${privateTour.slug}`)} className="sh-combo sh-combo-link">
              <div className="sh-combo-img">
                <ServiceCover kind={privateTour.kind} image={privateTour.image} alt={privateTour.title[lang]} />
              </div>
              <div>
                <span className="section-sub">{SH.comboSub[lang]}</span>
                <h2 className="section-title">{SH.addTourTitle[lang]}</h2>
                <p>{SH.addTourText[lang]}</p>
              </div>
              <span className="btn btn-gold sh-combo-cta">{privateTour.title[lang]} <ArrowRight size={16} /></span>
            </Link>
          </div>
        </section>
      )}

      {service.faqs.length > 0 && (
        <section className="section pt-faq-section">
          <div className="wa-container" style={{ maxWidth: 820 }}>
            <div className="pt-faq">
              {service.faqs.map((f, i) => (
                <details key={f.question.EN + i}>
                  <summary>
                    {f.question[lang]}
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <p>{f.answer[lang]}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pt-final" id="send">
        <div className="wa-container text-center pt-final-head">
          <h2 className="section-title">{SH.quoteTitle[lang]}</h2>
          <p className="pt-lead">{SH.quoteText[lang]}</p>
        </div>
        <InquiryForm form={form ?? null} item={`services:${service.slug}`} title={SH.quoteTitle[lang]} embedded />
      </section>
    </main>
  )
}
