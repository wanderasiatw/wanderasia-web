'use client'

import Link from 'next/link'
import { ArrowRight, Check, ChevronDown, Clock, MessageCircle, Plus } from 'lucide-react'
import { whatsappLink } from '@/lib/contact'
import { HERO } from '@/lib/home-content'
import { DEFAULT_FAQS, DEFAULT_INCLUDED, DEFAULT_PACKAGES, DEFAULT_TRUST, PT } from '@/lib/private-tour'
import { SH } from '@/lib/services-hub'
import { currencyOf, formatPrice, fromPrice, type Review, type Service, type Text } from '@/lib/tours'
import { WhatsAppIcon } from './Icons'
import ServiceCover from './ServiceCover'
import { RatingStars } from './TourExtras'
import WhyChoose from './WhyChoose'
import { useSite, type DictKey } from './SiteProvider'

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

/**
 * The Services page. Built from what is published in the CMS: the private tour is the main card and its
 * packages become the "ways to book" tiles; any other published service gets its own card. Unpublished
 * services (e.g. car or airport transfer) simply don't appear, and the layout fits 1 to 4 services.
 */
export default function ServicesHub({
  services,
  privateTour,
  page,
  reviews,
}: {
  services: Service[]
  privateTour: Service | null
  page: { title: Text; intro?: Text; image?: string } | null
  reviews: Review[]
}) {
  const { lang, t, href } = useSite()
  const unit = (u: string) => (u ? (t(`unit_${u}` as DictKey) ?? '') : '')
  const priceLabel = (s: Service) => {
    const p = fromPrice(s)
    return p == null ? SH.freeQuote[lang] : t('fromPrice').replace('{price}', formatPrice(p, currencyOf(s)))
  }

  const others = services.filter((s) => s !== privateTour)
  const packages = privateTour ? (privateTour.priceOptions.length > 0 ? privateTour.priceOptions : DEFAULT_PACKAGES) : []
  const trust = privateTour && privateTour.trustPoints.EN.length > 0 ? privateTour.trustPoints[lang] : DEFAULT_TRUST[lang]
  const featuredPoints = (privateTour && privateTour.included.EN.length > 0 ? privateTour.included : DEFAULT_INCLUDED)[lang].slice(0, 3)
  const faqs = (privateTour && privateTour.faqs.length > 0 ? privateTour.faqs : DEFAULT_FAQS).slice(0, 5)
  const shownReviews = reviews.filter((r) => r.featured || r.tourSlug === privateTour?.slug).slice(0, 3)
  const heroImage = page?.image ?? privateTour?.image
  const tourHref = privateTour ? href(`/services/${privateTour.slug}`) : null

  return (
    <main className="pt-page sh-page">
      {/* Hero */}
      <section className="hero hero-photo pt-hero">
        <div className="hero-bg" style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined} />
        <div className="wa-container hero-content">
          <div className="badge-hero">{SH.eyebrow[lang]}</div>
          <h1>{(page?.title ?? SH.title)[lang]}</h1>
          <p className="pt-summary">{(page?.intro ?? SH.intro)[lang]}</p>
          <ul className="pt-trust">
            {trust.map((point) => (
              <li key={point}><Check size={14} /> {point}</li>
            ))}
          </ul>
          <div className="pt-hero-ctas">
            {tourHref ? (
              <Link href={`${tourHref}#plan`} className="btn btn-gold">
                {SH.ctaPlan[lang]} <ArrowRight size={16} />
              </Link>
            ) : (
              <button type="button" className="btn btn-gold" onClick={() => scrollTo('services-list')}>
                {SH.helpTitle[lang]} <ArrowRight size={16} />
              </button>
            )}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <WhatsAppIcon /> {t('enquire')}
            </a>
          </div>
        </div>
        {!heroImage && (
          <p className="hero-credit">
            {HERO.photo.place[lang]} · <a href={HERO.photo.source} target="_blank" rel="noreferrer">{HERO.photo.author}</a>,{' '}
            <a href={HERO.photo.licenseUrl} target="_blank" rel="noreferrer license">{HERO.photo.license}</a>
          </p>
        )}
      </section>

      {/* Services: the private tour as the big card, the rest beside it */}
      <section className="section" id="services-list">
        <div className="wa-container">
          <div className="text-center how-head">
            <span className="section-sub">{SH.helpSub[lang]}</span>
            <h2 className="section-title">{SH.helpTitle[lang]}</h2>
          </div>

          <div className={`sh-bento${others.length === 0 ? ' sh-bento-solo' : ''}${!privateTour ? ' sh-bento-flat' : ''}`}>
            {privateTour && tourHref && (
              <Link href={tourHref} className="sh-feature">
                <div className="sh-feature-img">
                  <ServiceCover kind={privateTour.kind} image={privateTour.image} alt={privateTour.title[lang]} />
                  <span className="pt-package-badge sh-feature-badge">{SH.bestSeller[lang]}</span>
                </div>
                <div className="sh-feature-body">
                  <h3>{privateTour.title[lang]}</h3>
                  <p className="sh-desc">{privateTour.summary[lang]}</p>
                  <ul className="pt-fit-list">
                    {featuredPoints.map((p) => <li key={p}><Check size={16} />{p}</li>)}
                  </ul>
                  <div className="sh-card-foot">
                    <span className="sh-price">{priceLabel(privateTour)}</span>
                    <span className="btn btn-primary">{SH.buildTour[lang]} <ArrowRight size={15} /></span>
                  </div>
                </div>
              </Link>
            )}

            {others.length > 0 && (
              <div className={`sh-side${others.length <= 2 ? ' sh-side-tall' : ''}`}>
                {others.map((s) => (
                  <Link key={s.id} href={href(`/services/${s.slug}`)} className="sh-card">
                    <div className="sh-card-img">
                      <ServiceCover kind={s.kind} image={s.image} alt={s.title[lang]} />
                    </div>
                    <div className="sh-card-body">
                      <h3>{s.title[lang]}</h3>
                      <p className="sh-desc">{s.summary[lang]}</p>
                      {others.length <= 2 && s.included[lang].length > 0 && (
                        <ul className="pt-fit-list sh-card-points">
                          {s.included[lang].slice(0, 3).map((p) => <li key={p}><Check size={15} />{p}</li>)}
                        </ul>
                      )}
                      <div className="sh-card-foot">
                        <span className="sh-price">{priceLabel(s)}</span>
                        <span className="sh-link">{SH.details[lang]} <ArrowRight size={14} /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ways to book: the private tour's packages, each opening the trip builder with it picked */}
      {privateTour && tourHref && packages.length > 0 && (
        <section className="section pt-builder">
          <div className="wa-container">
            <div className="text-center how-head">
              <span className="section-sub">{SH.waysSub[lang]}</span>
              <h2 className="section-title">{SH.waysTitle[lang]}</h2>
              <p className="pt-lead">{SH.waysLead[lang]}</p>
            </div>
            <div className="sh-ways">
              {packages.map((p, i) => (
                <Link key={p.label.EN + i} href={`${tourHref}?package=${i}#plan`} className="pt-package sh-way">
                  {p.badge && <span className="pt-package-badge">{p.badge[lang]}</span>}
                  <span className="pt-package-name">{p.label[lang]}</span>
                  {p.duration && <span className="pt-package-meta"><Clock size={13} /> {p.duration[lang]}</span>}
                  {p.detail && <span className="pt-package-detail">{p.detail[lang]}</span>}
                  <span className="pt-package-price">
                    {p.price == null ? SH.freeQuote[lang] : (
                      <>
                        {formatPrice(p.price, currencyOf(privateTour))} <small>{unit(p.unit)}</small>
                      </>
                    )}
                  </span>
                  <span className="sh-way-cta">{SH.start[lang]} <ArrowRight size={14} /></span>
                </Link>
              ))}
              <a href={whatsappLink(privateTour.whatsappText)} target="_blank" rel="noreferrer" className="pt-package sh-way sh-way-ask">
                <span className="sh-way-icon"><MessageCircle size={22} /></span>
                <span className="pt-package-name">{SH.notSure[lang]}</span>
                <span className="pt-package-detail">{SH.notSureText[lang]}</span>
                <span className="sh-way-cta">{SH.askUs[lang]} <ArrowRight size={14} /></span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Combine: only when there is more than one service to combine */}
      {services.length > 1 && (
        <section className="section sh-combo-section">
          <div className="wa-container">
            <div className="sh-combo">
              <div>
                <span className="section-sub">{SH.comboSub[lang]}</span>
                <h2 className="section-title">{SH.comboTitle[lang]}</h2>
                <p>{SH.comboText[lang]}</p>
              </div>
              <div className="sh-combo-flow">
                {(privateTour ? [privateTour, ...others] : services).map((s, i) => (
                  <span key={s.id} className="sh-combo-step">
                    {i > 0 && <Plus size={16} className="sh-combo-plus" />}
                    <span className="sh-combo-chip">{s.title[lang]}</span>
                  </span>
                ))}
              </div>
              <Link href={href('/inquire')} className="btn btn-gold sh-combo-cta">
                {SH.comboCta[lang]} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="section how-section">
        <div className="wa-container">
          <div className="text-center how-head">
            <span className="section-sub">{PT.howSub[lang]}</span>
            <h2 className="section-title">{PT.howTitle[lang]}</h2>
          </div>
          <ol className="how-grid">
            {PT.steps.map((step, i) => (
              <li key={step.title.EN} className="how-step">
                <span className="how-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.title[lang]}</h3>
                <p>{step.text[lang]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <WhyChoose />

      {/* Reviews (real ones from the CMS only) */}
      {shownReviews.length > 0 && (
        <section className="section">
          <div className="wa-container">
            <div className="text-center how-head">
              <h2 className="section-title">{PT.reviewsTitle[lang]}</h2>
            </div>
            <div className="pt-reviews">
              {shownReviews.map((r, i) => (
                <figure key={r.name + i} className="panel pt-review">
                  {r.rating != null && <RatingStars value={r.rating} />}
                  <blockquote>{r.text[lang]}</blockquote>
                  <figcaption>
                    <strong>{r.name}</strong>
                    {r.country && <span> · {r.country}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section pt-faq-section">
        <div className="wa-container" style={{ maxWidth: 820 }}>
          <div className="text-center how-head">
            <h2 className="section-title">{PT.faqTitle[lang]}</h2>
          </div>
          <div className="pt-faq">
            {faqs.map((f, i) => (
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

      {/* Final call to action */}
      <section className="sh-final">
        <div className="wa-container text-center">
          <h2>{SH.finalTitle[lang]}</h2>
          <p>{SH.finalText[lang]}</p>
          <div className="pt-hero-ctas">
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <WhatsAppIcon /> {t('enquire')}
            </a>
            <Link href={href('/inquire')} className="btn btn-outline">
              {SH.sendInquiry[lang]}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
