'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LANG_CODE, fill, type DictKey } from '@/lib/i18n'
import { whatsappLink } from '@/lib/contact'
import type { Tour } from '@/lib/tours'
import {
  EMAIL_RE,
  HOLD_MINUTES,
  MAX_GUESTS_PER_BOOKING,
  bookingTotal,
  formatDate,
  formatMoney,
  formatTime,
  type Booking,
  type Departure,
} from '@/lib/booking/types'
import { WhatsAppIcon } from '../Icons'
import { useSite } from '../SiteProvider'
import BookingSummary, { guestsText } from './BookingSummary'
import Calendar, { LOW_SEATS } from './Calendar'
import DemoNotice from './DemoNotice'
import StepBar from './StepBar'
import Turnstile from './Turnstile'

type Step = 1 | 2 | 3 | 4
type Details = { name: string; email: string; phone: string; country: string; notes: string }
type Errors = Partial<Record<keyof Details | 'agree' | 'turnstile' | 'adults', string>>

const EMPTY: Details = { name: '', email: '', phone: '', country: '', notes: '' }

export interface BookingStart {
  step?: number
  date?: string
  dep?: string
  adults?: number
  children?: number
}

/** Where the flow is, kept in the address so the browser's back button steps back (contact details stay out of it) */
function toQuery(step: Step, date: string, dep: string, adults: number, children: number) {
  const q = new URLSearchParams()
  if (step > 1) q.set('step', String(step))
  if (date) q.set('date', date)
  if (dep) q.set('dep', dep)
  if (adults !== 1) q.set('a', String(adults))
  if (children) q.set('c', String(children))
  const s = q.toString()
  return s ? `?${s}` : window.location.pathname
}

/**
 * Steps 1 to 4 of booking a tour: date and time, guests, contact details, review. Reserving saves the booking in the CMS:
 * free tours are confirmed straight away, paid tours hold their seats and continue to payment on the booking page.
 */
export default function BookingFlow({
  tour,
  departures,
  demo,
  turnstileKey,
  start,
}: {
  tour: Tour
  departures: Departure[]
  demo: boolean
  turnstileKey?: string
  start: BookingStart
}) {
  const { lang, t, href } = useSite()
  const router = useRouter()

  const validDep = (id?: string) => departures.find((d) => d.id === id && d.seatsLeft > 0)
  const startDep = validDep(start.dep)

  const [step, setStepState] = useState<Step>(startDep ? (Math.min(Math.max(start.step ?? 1, 1), 3) as Step) : 1)
  const [date, setDate] = useState(startDep?.date ?? (departures.some((d) => d.date === start.date) ? start.date! : ''))
  const [depId, setDepId] = useState(startDep?.id ?? '')
  const [adults, setAdults] = useState(Math.max(1, start.adults ?? 1))
  const [children, setChildren] = useState(Math.max(0, start.children ?? 0))
  const [details, setDetails] = useState<Details>(EMPTY)
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [shownAt, setShownAt] = useState(0)
  const [honeypot, setHoneypot] = useState('')
  const [turnstile, setTurnstile] = useState('')

  useEffect(() => setShownAt(Date.now()), [])

  const dep = departures.find((d) => d.id === depId)
  const timesForDate = useMemo(() => departures.filter((d) => d.date === date), [departures, date])
  const maxGuests = Math.min(dep?.seatsLeft ?? MAX_GUESTS_PER_BOOKING, MAX_GUESTS_PER_BOOKING)
  const sample = dep ?? departures.find((d) => d.seatsLeft > 0) ?? departures[0]
  const total = dep ? bookingTotal(dep, adults, children) : 0
  const isFree = (dep ?? sample)?.price === 0 && (dep ?? sample)?.childPrice === 0

  // Fewer seats than guests (another date chosen): bring the counts down
  useEffect(() => {
    if (!dep) return
    if (adults + children > maxGuests) {
      const a = Math.min(adults, maxGuests)
      setAdults(a)
      setChildren(Math.max(0, maxGuests - a))
    }
  }, [dep, maxGuests, adults, children])

  // Keep the address in step, and follow the back and forward buttons
  const goTo = useCallback(
    (next: Step) => {
      window.history.pushState({ step: next }, '', toQuery(next, date, depId, adults, children))
      setStepState(next)
      setMessage('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [date, depId, adults, children],
  )
  useEffect(() => {
    window.history.replaceState(window.history.state, '', toQuery(step, date, depId, adults, children))
  }, [step, date, depId, adults, children])
  useEffect(() => {
    const onPop = () => {
      const s = Number(new URLSearchParams(window.location.search).get('step')) || 1
      setStepState((Math.min(Math.max(s, 1), 4) as Step))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // A step can only show once the ones before it are done
  const detailsOk = Boolean(details.name.trim() && EMAIL_RE.test(details.email.trim()) && details.phone.trim() && agree && (!turnstileKey || turnstile))
  const shown: Step = !dep ? 1 : step === 4 && !detailsOk ? 3 : step

  function pickDate(d: string) {
    setDate(d)
    const open = departures.filter((x) => x.date === d && x.seatsLeft > 0)
    setDepId(open.length === 1 ? open[0].id : '')
    setMessage('')
  }

  function checkDetails(): boolean {
    const e: Errors = {}
    if (!details.name.trim()) e.name = t('formRequired')
    if (!details.email.trim()) e.email = t('formRequired')
    else if (!EMAIL_RE.test(details.email.trim())) e.email = t('emailInvalid')
    if (!details.phone.trim()) e.phone = t('formRequired')
    if (!agree) e.agree = t('agreeRequired')
    if (turnstileKey && !turnstile) e.turnstile = t('formRequired')
    setErrors(e)
    if (Object.keys(e).length) {
      setMessage(t('formCheck'))
      return false
    }
    return true
  }

  async function reserve() {
    if (!dep || sending) return
    setSending(true)
    setMessage('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tourSlug: tour.slug,
          departureId: dep.id,
          adults,
          children,
          ...details,
          agree,
          lang: LANG_CODE[lang],
          _hp: honeypot,
          _t: shownAt,
          turnstile: turnstile || undefined,
        }),
      })
      const body = (await res.json().catch(() => ({}))) as { booking?: Booking; fields?: Record<string, string> }
      if (res.ok && body.booking) {
        router.push(href(`/booking/${encodeURIComponent(body.booking.ref)}?t=${encodeURIComponent(body.booking.token)}`))
        return
      }
      if (res.status === 409) {
        setDepId('')
        setStepState(1)
        setMessage(t('soldOutNow'))
        router.refresh()
      } else if (res.status === 422 && body.fields) {
        const e: Errors = {}
        for (const [k, code] of Object.entries(body.fields)) {
          e[k as keyof Errors] = k === 'agree' ? t('agreeRequired') : code === 'required' ? t('formRequired') : k === 'email' ? t('emailInvalid') : t('formInvalid')
        }
        setErrors(e)
        setStepState(e.adults ? 2 : 3)
        setMessage(t('formCheck'))
      } else {
        setMessage(res.status === 429 ? t('tooManyTries') : t('formFailed'))
      }
    } catch {
      setMessage(t('formFailed'))
    }
    setSending(false)
  }

  const setField = (k: keyof Details, v: string) => {
    setDetails((d) => ({ ...d, [k]: v }))
    if (errors[k]) setErrors(({ [k]: _gone, ...rest }) => rest)
  }

  const whatsapp = (
    <a href={whatsappLink(`Hi Wander Asia! I'd like to book the ${tour.title.EN}.`)} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ padding: 12 }}>
      <WhatsAppIcon />
      <span>{t('askWhatsApp')}</span>
    </a>
  )

  const field = (k: keyof Details, label: DictKey, opts: { type?: string; hint?: DictKey; optional?: boolean; auto?: string; max?: number } = {}) => (
    <div className="form-group">
      <label htmlFor={`bk-${k}`}>
        {t(label)}
        {opts.optional && <span style={{ fontWeight: 600, textTransform: 'none', color: 'var(--stone-400)' }}> ({t('formOptional')})</span>}
      </label>
      {k === 'notes' ? (
        <textarea id={`bk-${k}`} className="form-control" rows={3} maxLength={1000} style={{ height: 'auto', lineHeight: 1.5 }} value={details[k]} onChange={(e) => setField(k, e.target.value)} />
      ) : (
        <input
          id={`bk-${k}`}
          type={opts.type ?? 'text'}
          className="form-control"
          autoComplete={opts.auto}
          maxLength={opts.max ?? 120}
          value={details[k]}
          aria-invalid={errors[k] ? true : undefined}
          aria-describedby={errors[k] || opts.hint ? `bk-${k}-help` : undefined}
          onChange={(e) => setField(k, e.target.value)}
        />
      )}
      {(errors[k] || opts.hint) && (
        <p id={`bk-${k}-help`} style={{ fontSize: 12, marginTop: 4, color: errors[k] ? '#b91c1c' : 'var(--stone-600)', fontWeight: errors[k] ? 600 : 400 }}>
          {errors[k] || t(opts.hint!)}
        </p>
      )}
    </div>
  )

  const counter = (label: DictKey, hint: DictKey, value: number, set: (n: number) => void, min: number) => (
    <div className="guest-row">
      <div>
        <strong>{t(label)}</strong>
        <small>{t(hint)}</small>
      </div>
      <div className="stepper">
        <button type="button" onClick={() => set(value - 1)} disabled={value <= min} aria-label={`${t('fewerGuests')}: ${t(label)}`}>−</button>
        <span aria-live="polite">{value}</span>
        <button type="button" onClick={() => set(value + 1)} disabled={adults + children >= maxGuests} aria-label={`${t('moreGuests')}: ${t(label)}`}>+</button>
      </div>
    </div>
  )

  return (
    <main>
      <div className={tour.image ? 'hero hero-photo' : 'hero'} style={{ padding: '44px 0' }}>
        <div className="hero-bg" style={tour.image ? { backgroundImage: `url(${tour.image})` } : undefined} />
        <div className="wa-container hero-content">
          <div className="badge-hero">{t('bookingTitle')}</div>
          <h1 style={{ fontSize: 30 }}>{tour.title[lang]}</h1>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="wa-container">
          <DemoNotice show={demo} />
          <StepBar current={shown} withPayment={!isFree} />

          <div className="book-grid">
            <div className="panel">
              {message && <p role="alert" className="book-error" style={{ marginBottom: 14 }}>{message}</p>}

              {departures.length === 0 || !departures.some((d) => d.seatsLeft > 0) ? (
                <div className="flex flex-col gap-3">
                  <p>{t('noDepartures')}</p>
                  {whatsapp}
                </div>
              ) : shown === 1 ? (
                <>
                  <h2 className="book-step-title">{t('chooseDate')}</h2>
                  <Calendar departures={departures} selected={date} onSelect={pickDate} />
                  {date && (
                    <div style={{ marginTop: 20 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>{t('chooseTime')} · {formatDate(date, lang)}</h3>
                      <div className="time-list" role="radiogroup" aria-label={t('chooseTime')}>
                        {timesForDate.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            role="radio"
                            aria-checked={depId === d.id}
                            className={`time-btn${depId === d.id ? ' selected' : ''}`}
                            disabled={d.seatsLeft === 0}
                            onClick={() => setDepId(d.id)}
                          >
                            {formatTime(d.time, lang)}
                            <small>
                              {d.seatsLeft === 0
                                ? t('soldOut')
                                : d.seatsLeft <= LOW_SEATS
                                  ? fill(t('onlySeatsLeft'), { n: d.seatsLeft })
                                  : fill(t('seatsAvailable'), { n: d.seatsLeft })}
                            </small>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="book-actions">
                    <Link href={href(`/tours/${tour.slug}`)} className="btn btn-outline">{t('back')}</Link>
                    <button type="button" className="btn btn-primary" disabled={!dep} onClick={() => goTo(2)}>{t('continue')}</button>
                  </div>
                </>
              ) : shown === 2 ? (
                <>
                  <h2 className="book-step-title">{t('stepGuests')}</h2>
                  {counter('adults', 'adultsHint', adults, setAdults, 1)}
                  {counter('children', 'childrenHint', children, setChildren, 0)}
                  <p className="book-hint">{fill(t('maxGuests'), { n: maxGuests })}</p>
                  <div className="book-actions">
                    <button type="button" className="btn btn-outline" onClick={() => goTo(1)}>{t('back')}</button>
                    <button type="button" className="btn btn-primary" onClick={() => goTo(3)}>{t('continue')}</button>
                  </div>
                </>
              ) : shown === 3 ? (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (checkDetails()) goTo(4)
                  }}
                  className="flex flex-col gap-4"
                >
                  <h2 className="book-step-title" style={{ marginBottom: 0 }}>{t('stepDetails')}</h2>
                  {field('name', 'fullName', { auto: 'name' })}
                  <div className="form-grid-2">
                    {field('email', 'email', { type: 'email', auto: 'email', max: 200 })}
                    {field('phone', 'phone', { type: 'tel', auto: 'tel', hint: 'phoneHint', max: 40 })}
                  </div>
                  {field('country', 'country', { auto: 'country-name', optional: true, max: 80 })}
                  {field('notes', 'notes', { hint: 'notesHint', optional: true })}

                  {/* Hidden from people; bots that fill in every field get caught */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                    <label htmlFor="bk-website">Website</label>
                    <input id="bk-website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </div>

                  <div>
                    <label className="check-row">
                      <input
                        type="checkbox"
                        checked={agree}
                        aria-invalid={errors.agree ? true : undefined}
                        onChange={(e) => {
                          setAgree(e.target.checked)
                          if (errors.agree) setErrors(({ agree: _gone, ...rest }) => rest)
                        }}
                      />
                      <span>
                        {t('agreeBefore')}
                        <a href={href('/terms')} target="_blank" rel="noreferrer">{t('termsLink')}</a>
                        {t('agreeAfter')}
                      </span>
                    </label>
                    {errors.agree && <p className="book-error" style={{ fontSize: 12, marginTop: 4 }}>{errors.agree}</p>}
                  </div>

                  {turnstileKey && <Turnstile siteKey={turnstileKey} lang={lang} onToken={setTurnstile} />}

                  <div className="book-actions" style={{ marginTop: 4 }}>
                    <button type="button" className="btn btn-outline" onClick={() => goTo(2)}>{t('back')}</button>
                    <button type="submit" className="btn btn-primary">{t('continue')}</button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="book-step-title">{t('stepReview')}</h2>
                  <div className="review-block">
                    <div>
                      <h4>{t('when')}</h4>
                      <p>
                        <strong>{tour.title[lang]}</strong>
                        <br />
                        {formatDate(dep!.date, lang)} · {formatTime(dep!.time, lang)}
                      </p>
                    </div>
                    <button type="button" onClick={() => goTo(1)}>{t('edit')}</button>
                  </div>
                  <div className="review-block">
                    <div>
                      <h4>{t('guests')}</h4>
                      <p>{guestsText(t, adults, children)}</p>
                    </div>
                    <button type="button" onClick={() => goTo(2)}>{t('edit')}</button>
                  </div>
                  <div className="review-block">
                    <div>
                      <h4>{t('contactDetails')}</h4>
                      <p>
                        {details.name}
                        <br />
                        {details.email} · {details.phone}
                        {details.country && <><br />{details.country}</>}
                      </p>
                      {details.notes && <p style={{ color: 'var(--stone-600)', fontSize: 13, marginTop: 4 }}>{details.notes}</p>}
                    </div>
                    <button type="button" onClick={() => goTo(3)}>{t('edit')}</button>
                  </div>
                  <div className="summary-total" style={{ borderTop: 0 }}>
                    <span>{t('total')}</span>
                    <strong>{total === 0 ? t('free') : formatMoney(total, dep!.currency)}</strong>
                  </div>
                  <p className="book-hint">{total === 0 ? t('freeNote') : fill(t('holdNote'), { n: HOLD_MINUTES })}</p>
                  <div className="book-actions">
                    <button type="button" className="btn btn-outline" onClick={() => goTo(3)}>{t('back')}</button>
                    <button type="button" className="btn btn-primary" onClick={reserve} disabled={sending}>
                      {sending ? t('reserving') : total === 0 ? t('reserveFree') : t('reservePay')}
                    </button>
                  </div>
                </>
              )}
            </div>

            {sample && (
              <BookingSummary
                tour={tour}
                data={{ date: dep?.date ?? (date || undefined), time: dep?.time, adults, children, price: sample.price, childPrice: sample.childPrice, currency: sample.currency }}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
