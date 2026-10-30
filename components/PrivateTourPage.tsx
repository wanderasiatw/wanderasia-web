'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Clock, MapPin, Minus, Plus, ShieldCheck, Sparkles, X } from 'lucide-react'
import type { PublicForm } from '@/lib/cms'
import { whatsappLink } from '@/lib/contact'
import { HERO } from '@/lib/home-content'
import {
  DEFAULT_FAQS,
  DEFAULT_INCLUDED,
  DEFAULT_INTERESTS,
  DEFAULT_ITINERARIES,
  DEFAULT_PACKAGES,
  DEFAULT_PERFECT_FOR,
  DEFAULT_TRUST,
  PT,
} from '@/lib/private-tour'
import { currencyOf, formatPrice, type Guide, type Review, type Service, type TextList, type Tour } from '@/lib/tours'
import InquiryForm from './InquiryForm'
import { WhatsAppIcon } from './Icons'
import TourCover from './TourCover'
import { RatingStars } from './TourExtras'
import { fromLabel } from './ServiceCards'
import { useSite, type DictKey } from './SiteProvider'

/** The CMS list when it has items, else the built-in one */
const orDefault = (list: TextList, fallback: TextList): TextList => (list.EN.length > 0 ? list : fallback)
const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

/**
 * The private tours page: a sales page with a trip builder. Staff edit everything on it in the CMS
 * (Services → the private tour); built-in text fills any section the CMS leaves empty.
 */
export default function PrivateTourPage({
  service,
  tours,
  reviews,
  guides,
  form,
}: {
  service: Service
  tours: Tour[]
  reviews: Review[]
  guides: Guide[]
  form: PublicForm | null
}) {
  const { lang, t } = useSite()
  const currency = currencyOf(service)
  const money = (n: number) => formatPrice(n, currency)
  const unit = (u: string) => (u ? (t(`unit_${u}` as DictKey) ?? '') : '')

  const packages = service.priceOptions.length > 0 ? service.priceOptions : DEFAULT_PACKAGES
  const itineraries = service.itineraries.length > 0 ? service.itineraries : DEFAULT_ITINERARIES
  const faqs = service.faqs.length > 0 ? service.faqs : DEFAULT_FAQS
  const trust = orDefault(service.trustPoints, DEFAULT_TRUST)[lang]
  const perfectFor = orDefault(service.perfectFor, DEFAULT_PERFECT_FOR)[lang]
  const interests = orDefault(service.interests, DEFAULT_INTERESTS)[lang]
  const included = orDefault(service.included, DEFAULT_INCLUDED)[lang]
  const notIncluded = service.notIncluded[lang]
  const experiences = tours.filter((tour) => !tour.comingSoon)
  const maxGuests = service.maxGuests ?? 30
  // Reviews written for this page, else the ones marked for the home page
  const pageReviews = reviews.filter((r) => r.tourSlug === service.slug)
  const shownReviews = (pageReviews.length > 0 ? pageReviews : reviews.filter((r) => r.featured)).slice(0, 6)

  // Trip builder: the package with a badge starts selected (e.g. "Most popular"), else the second one (usually a full day)
  const badged = packages.findIndex((p) => p.badge)
  const [pkgIndex, setPkgIndex] = useState(badged >= 0 ? badged : Math.min(1, packages.length - 1))
  const [picks, setPicks] = useState<string[]>([])
  const [likes, setLikes] = useState<string[]>([])
  const [guests, setGuests] = useState(2)
  const [date, setDate] = useState('')
  const [extras, setExtras] = useState<number[]>([])
  const [notes, setNotes] = useState('')
  const [prefill, setPrefill] = useState<{ key: number; values: Record<string, string> } | undefined>()
  const [minDate, setMinDate] = useState('')
  useEffect(() => setMinDate(new Date().toISOString().slice(0, 10)), [])

  const pkg = packages[pkgIndex]
  const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item])

  /** Estimate for the whole group; null when the package (or a picked extra) has no price yet */
  const estimate = useMemo(() => {
    if (!pkg || pkg.price == null) return null
    let total = pkg.unit === 'person' ? pkg.price * guests : pkg.price
    let extraGuests = 0
    if (pkg.unit !== 'person' && service.groupIncluded && service.extraGuestPrice != null) {
      extraGuests = Math.max(0, guests - service.groupIncluded)
      total += extraGuests * service.extraGuestPrice
    }
    for (const i of extras) {
      const a = service.addOns[i]
      if (!a) continue
      if (a.price == null) return null
      total += a.unit === 'person' ? a.price * guests : a.price
    }
    return { total, extraGuests }
  }, [pkg, guests, extras, service])

  const pickedTitles = [...experiences.filter((tour) => picks.includes(tour.slug)).map((tour) => tour.title[lang]), ...likes]
  const pickedExtras = extras.map((i) => service.addOns[i]?.label[lang]).filter(Boolean)

  /** The plan as a message, in the visitor's language */
  const planText = () =>
    [
      PT.msgIntro[lang],
      '',
      pkg ? `${PT.msgLength[lang]}: ${pkg.label[lang]}${pkg.duration ? ` (${pkg.duration[lang]})` : ''}` : null,
      `${PT.guests[lang]}: ${guests}`,
      date ? `${PT.date[lang]}: ${date}` : null,
      pickedTitles.length > 0 ? `${PT.msgDo[lang]}: ${pickedTitles.join(', ')}` : null,
      pickedExtras.length > 0 ? `${PT.msgExtras[lang]}: ${pickedExtras.join(', ')}` : null,
      notes.trim() ? `${PT.msgNotes[lang]}: ${notes.trim()}` : null,
      estimate ? `${PT.msgEstimate[lang]}: ${money(estimate.total)}` : null,
    ]
      .filter((line): line is string => line !== null)
      .join('\n')

  const sendPlan = () => {
    // No inquiry form (CMS unreachable): send the plan on WhatsApp instead
    if (!form) {
      window.open(whatsappLink(planText()), '_blank', 'noopener')
      return
    }
    setPrefill({
      key: Date.now(),
      values: { message: planText(), guests: String(guests), date, item: `services:${service.slug}` },
    })
    scrollTo('send')
  }

  const planDay = (title: string) => {
    setNotes((n) => {
      const line = `${PT.msgIdea[lang]}: ${title}`
      return n.includes(line) ? n : n ? `${n}\n${line}` : line
    })
    scrollTo('plan')
  }

  const heroImage = service.image ?? '/images/hero-jiufen.jpg'

  return (
    <main className="pt-page">
      {/* Hero */}
      <section className="hero hero-photo pt-hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="wa-container hero-content">
          <div className="badge-hero">
            <Sparkles size={13} /> {t('navServices')}
          </div>
          <h1>{service.title[lang]}</h1>
          <p className="pt-tagline">{PT.tagline[lang]}</p>
          {service.summary[lang] && <p className="pt-summary">{service.summary[lang]}</p>}
          <ul className="pt-trust">
            {trust.map((point) => (
              <li key={point}>
                <Check size={14} /> {point}
              </li>
            ))}
          </ul>
          <div className="pt-hero-price">{fromLabel(service, t)}</div>
          <div className="pt-hero-ctas">
            <button type="button" className="btn btn-gold" onClick={() => scrollTo('plan')}>
              {PT.ctaPlan[lang]} <ArrowRight size={16} />
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

      {/* Trip builder */}
      <section className="section pt-builder" id="plan">
        <div className="wa-container">
          <div className="text-center how-head">
            <span className="section-sub">{PT.builderSub[lang]}</span>
            <h2 className="section-title">{PT.builderTitle[lang]}</h2>
          </div>

          <div className="pt-builder-grid">
            <div className="pt-steps">
              {/* 1. Length */}
              <div className="pt-step">
                <h3 className="pt-step-title"><span>1</span>{PT.stepLength[lang]}</h3>
                <div className="pt-packages" role="radiogroup" aria-label={PT.stepLength[lang]}>
                  {packages.map((p, i) => (
                    <button
                      key={p.label.EN + i}
                      type="button"
                      role="radio"
                      aria-checked={i === pkgIndex}
                      className={`pt-package${i === pkgIndex ? ' active' : ''}`}
                      onClick={() => setPkgIndex(i)}
                    >
                      {p.badge && <span className="pt-package-badge">{p.badge[lang]}</span>}
                      <span className="pt-package-name">{p.label[lang]}</span>
                      {p.duration && (
                        <span className="pt-package-meta"><Clock size={13} /> {p.duration[lang]}</span>
                      )}
                      {p.detail && <span className="pt-package-detail">{p.detail[lang]}</span>}
                      <span className="pt-package-price">
                        {p.price == null ? t('priceOnRequest') : (
                          <>
                            {money(p.price)} <small>{unit(p.unit)}</small>
                          </>
                        )}
                      </span>
                      <span className="pt-radio" aria-hidden="true">{i === pkgIndex && <Check size={13} />}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Experiences */}
              {(experiences.length > 0 || interests.length > 0) && (
                <div className="pt-step">
                  <h3 className="pt-step-title"><span>2</span>{PT.stepDo[lang]}</h3>
                  <p className="pt-step-hint">{PT.stepDoHint[lang]}</p>
                  <div className="pt-experiences">
                    {experiences.map((tour) => {
                      const on = picks.includes(tour.slug)
                      return (
                        <button
                          key={tour.slug}
                          type="button"
                          aria-pressed={on}
                          className={`pt-exp${on ? ' active' : ''}`}
                          onClick={() => setPicks((list) => toggle(list, tour.slug))}
                        >
                          <span className="pt-exp-img">
                            <TourCover category={tour.category} image={tour.image} alt="" />
                            <span className="pt-exp-check" aria-hidden="true">{on ? <Check size={14} /> : <Plus size={14} />}</span>
                          </span>
                          <span className="pt-exp-body">
                            <span className="pt-exp-title">{tour.title[lang]}</span>
                            <span className="pt-exp-loc"><MapPin size={11} /> {tour.location[lang]}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {interests.length > 0 && (
                    <div className="pt-likes">
                      {interests.map((item) => {
                        const on = likes.includes(item)
                        return (
                          <button key={item} type="button" aria-pressed={on} className={`pt-like${on ? ' active' : ''}`} onClick={() => setLikes((list) => toggle(list, item))}>
                            {on ? <Check size={13} /> : <Plus size={13} />} {item}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Group */}
              <div className="pt-step">
                <h3 className="pt-step-title"><span>3</span>{PT.stepWho[lang]}</h3>
                <div className="pt-who">
                  <div className="pt-field">
                    <span className="pt-label">{PT.guests[lang]}</span>
                    <div className="pt-stepper">
                      <button type="button" aria-label="−" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1}><Minus size={16} /></button>
                      <output aria-live="polite">{guests}</output>
                      <button type="button" aria-label="+" onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))} disabled={guests >= maxGuests}><Plus size={16} /></button>
                    </div>
                  </div>
                  <label className="pt-field">
                    <span className="pt-label">{PT.date[lang]} <em>({PT.optional[lang]})</em></span>
                    <input type="date" className="form-control" value={date} min={minDate || undefined} onChange={(e) => setDate(e.target.value)} />
                  </label>
                </div>
              </div>

              {/* 4. Extras */}
              {service.addOns.length > 0 && (
                <div className="pt-step">
                  <h3 className="pt-step-title"><span>4</span>{PT.stepExtras[lang]}</h3>
                  <div className="pt-extras">
                    {service.addOns.map((a, i) => {
                      const on = extras.includes(i)
                      return (
                        <label key={a.label.EN + i} className={`pt-extra${on ? ' active' : ''}`}>
                          <input type="checkbox" checked={on} onChange={() => setExtras((list) => toggle(list, i))} />
                          <span className="pt-extra-name">{a.label[lang]}</span>
                          <span className="pt-extra-price">
                            {a.price == null ? t('priceOnRequest') : `+${money(a.price)} ${unit(a.unit)}`}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              <label className="pt-field">
                <span className="pt-label">{PT.notes[lang]} <em>({PT.optional[lang]})</em></span>
                <textarea className="form-control" rows={3} value={notes} maxLength={800} placeholder={PT.notesPlaceholder[lang]} onChange={(e) => setNotes(e.target.value)} style={{ height: 'auto' }} />
              </label>
            </div>

            {/* Summary */}
            <aside className="pt-summary-card" aria-label={PT.summary[lang]}>
              <h3>{PT.summary[lang]}</h3>
              <dl>
                {pkg && (
                  <div>
                    <dt>{PT.msgLength[lang]}</dt>
                    <dd>{pkg.label[lang]}{pkg.duration ? ` · ${pkg.duration[lang]}` : ''}</dd>
                  </div>
                )}
                <div>
                  <dt>{PT.guests[lang]}</dt>
                  <dd>{guests}{date ? ` · ${date}` : ''}</dd>
                </div>
                <div>
                  <dt>{PT.msgDo[lang]}</dt>
                  <dd>
                    {pickedTitles.length > 0 ? (
                      <ul className="pt-chips">
                        {experiences.filter((tour) => picks.includes(tour.slug)).map((tour) => (
                          <li key={tour.slug}>
                            {tour.title[lang]}
                            <button type="button" aria-label="×" onClick={() => setPicks((list) => list.filter((s) => s !== tour.slug))}><X size={12} /></button>
                          </li>
                        ))}
                        {likes.map((item) => (
                          <li key={item}>
                            {item}
                            <button type="button" aria-label="×" onClick={() => setLikes((list) => list.filter((s) => s !== item))}><X size={12} /></button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="pt-muted">{PT.nothingPicked[lang]}</span>
                    )}
                  </dd>
                </div>
                {pickedExtras.length > 0 && (
                  <div>
                    <dt>{PT.msgExtras[lang]}</dt>
                    <dd>{pickedExtras.join(', ')}</dd>
                  </div>
                )}
              </dl>

              <div className="pt-estimate">
                {estimate ? (
                  <>
                    <span className="pt-estimate-label">{PT.estimate[lang]}</span>
                    <strong>{money(estimate.total)}</strong>
                    {estimate.extraGuests > 0 && service.extraGuestPrice != null && (
                      <span className="pt-estimate-line">
                        {PT.extraGuests[lang].replace('{n}', String(estimate.extraGuests))} × {money(service.extraGuestPrice)}
                      </span>
                    )}
                    <p>{PT.estimateNote[lang]}</p>
                  </>
                ) : (
                  <p className="pt-estimate-ask"><ShieldCheck size={16} /> {PT.priceToFollow[lang]}</p>
                )}
              </div>

              <button type="button" className="btn btn-primary pt-send" onClick={sendPlan}>
                {PT.sendPlan[lang]} <ArrowRight size={16} />
              </button>
              <a href={whatsappLink(planText())} target="_blank" rel="noreferrer" className="btn btn-whatsapp pt-send">
                <WhatsAppIcon /> {PT.sendWhatsApp[lang]}
              </a>
              <p className="pt-free">{PT.noPayment[lang]}</p>
            </aside>
          </div>
        </div>
      </section>

      {/* Sample itineraries */}
      {itineraries.length > 0 && (
        <section className="section pt-ideas">
          <div className="wa-container">
            <div className="text-center how-head">
              <span className="section-sub">{PT.ideasSub[lang]}</span>
              <h2 className="section-title">{PT.ideasTitle[lang]}</h2>
              <p className="pt-lead">{PT.ideasLead[lang]}</p>
            </div>
            <div className="pt-idea-grid">
              {itineraries.map((it, i) => (
                <article key={it.title.EN + i} className="pt-idea">
                  <div className="pt-idea-img">
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt={it.title[lang]} loading="lazy" decoding="async" />
                    ) : (
                      <div className={`tour-cover tour-cover-${['food', 'hiking', 'night', 'special'][i % 4]}`} aria-hidden="true">
                        <MapPin size={40} strokeWidth={1.4} />
                      </div>
                    )}
                    {it.region && <span className="pt-idea-region">{it.region[lang]}</span>}
                  </div>
                  <div className="pt-idea-body">
                    <h3>{it.title[lang]}</h3>
                    {it.duration && <span className="pt-package-meta"><Clock size={13} /> {it.duration[lang]}</span>}
                    <ol className="pt-stops">
                      {it.stops[lang].map((stop) => <li key={stop}>{stop}</li>)}
                    </ol>
                    <button type="button" className="pt-idea-cta" onClick={() => planDay(it.title[lang])}>
                      {PT.useThis[lang]} <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Perfect for + what's included */}
      <section className="section pt-fit">
        <div className="wa-container pt-fit-grid">
          <div className="panel">
            <h2 className="section-title pt-panel-title">{PT.perfectFor[lang]}</h2>
            <ul className="pt-fit-list">
              {perfectFor.map((item) => <li key={item}><Check size={16} />{item}</li>)}
            </ul>
          </div>
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
        </div>
      </section>

      {/* Guides */}
      {guides.length > 0 && (
        <section className="section how-section">
          <div className="wa-container">
            <div className="text-center how-head">
              <span className="section-sub">{PT.guidesSub[lang]}</span>
              <h2 className="section-title">{PT.guidesTitle[lang]}</h2>
            </div>
            <div className="pt-guides">
              {guides.map((g) => (
                <div key={g.name} className="pt-guide">
                  {g.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.photo} alt={g.name} loading="lazy" />
                  ) : (
                    <span className="pt-guide-initial" aria-hidden="true">{g.name.charAt(0)}</span>
                  )}
                  <h3>{g.name}</h3>
                  {g.role && <p className="pt-guide-role">{g.role[lang]}</p>}
                  {g.languages.length > 0 && <p className="pt-guide-langs">{g.languages.join(' · ')}</p>}
                  {g.bio && <p className="pt-guide-bio">{g.bio[lang]}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
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
                    {r.link && (
                      <a href={r.link} target="_blank" rel="noreferrer" className="pt-review-link">{r.source ?? 'Review'}</a>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
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
      )}

      {/* Send */}
      <section className="pt-final" id="send">
        <div className="wa-container text-center pt-final-head">
          <h2 className="section-title">{PT.finalTitle[lang]}</h2>
          <p className="pt-lead">{prefill && form ? PT.planFilled[lang] : PT.finalLead[lang]}</p>
        </div>
        <InquiryForm form={form} item={`services:${service.slug}`} title={PT.sendPlan[lang]} embedded prefill={prefill} />
      </section>

      <MobileBar label={estimate ? money(estimate.total) : fromLabel(service, t)} cta={PT.ctaPlan[lang]} />
    </main>
  )
}

/** Bottom bar on phones: shows once the hero is passed, hides while the planner or form is on screen */
function MobileBar({ label, cta }: { label: string; cta: string }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const targets = ['plan', 'send'].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const visible = new Set<Element>()
    const update = () => setShow(window.scrollY > 560 && visible.size === 0)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target)
          else visible.delete(e.target)
        }
        update()
      },
      { rootMargin: '-20% 0px -20% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])
  return (
    <div className={`sticky-book-bar${show ? ' show' : ''}`} aria-hidden={!show}>
      <div className="sticky-book-info">
        <strong>{label}</strong>
      </div>
      <button type="button" className="btn btn-primary" tabIndex={show ? 0 : -1} onClick={() => scrollTo('plan')}>
        {cta}
      </button>
    </div>
  )
}
