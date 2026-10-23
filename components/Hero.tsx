'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'
import { scrollToTours, useSite } from './SiteProvider'
import { PinIcon, WhatsAppIcon } from './Icons'
import { privateTourService } from '@/lib/tours'
import { whatsappLink } from '@/lib/contact'
import { HERO } from '@/lib/home-content'
import type { HeroSlide } from '@/lib/cms'

/** How long each hero photo stays before the slow crossfade to the next (ms) */
const SLIDE_MS = 6500

/** The bookable tours the hero can route to, by category */
export type HeroTour = { slug: string; category: string }

export default function Hero({ slides = [], tours = [] }: { slides?: HeroSlide[]; tours?: HeroTour[] }) {
  const { t, lang, categories, services, href } = useSite()
  const router = useRouter()
  const [type, setType] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState(2)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const resumeTimer = useRef<number | null>(null)

  const options = [...categories.map((c) => ({ key: c.key, title: c.title })), { key: 'private', title: privateTourService(services).title }]

  // Visitors who ask for reduced motion get a still hero; a hidden tab pauses the rotation too
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onMq = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onMq)
    const onVis = () => setTabHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      mq.removeEventListener('change', onMq)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  useEffect(() => {
    if (slides.length < 2 || paused || tabHidden || reducedMotion) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS)
    return () => window.clearInterval(id)
  }, [slides.length, paused, tabHidden, reducedMotion])

  // A touch pauses the rotation; it resumes on its own after a while
  const pauseForTouch = () => {
    setPaused(true)
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => setPaused(false), 10000)
  }

  // The WhatsApp fallback under the form keeps the chat option: the same
  // picks, sent as a message instead of a booking-page visit
  const waMsg = [
    "Hi Wander Asia! I'd like to check availability.",
    `Tour: ${options.find((o) => o.key === type)?.title.EN ?? 'Not sure yet'}`,
    `Date: ${date || 'flexible'}`,
    `Guests: ${guests === 10 ? '10+' : guests}`,
  ].join('\n')

  function checkAvailability(e: FormEvent) {
    e.preventDefault()
    // Private tours are arranged from their own service page
    if (type === 'private') {
      router.push(href(`/services/${privateTourService(services).slug}`))
      return
    }
    // A category holding exactly one bookable tour goes straight to that tour's
    // booking page, carrying the picked date and group size (?date and ?a)
    const matches = type ? tours.filter((tour) => tour.category === type) : []
    if (matches.length === 1) {
      const q = new URLSearchParams()
      if (date) q.set('date', date)
      q.set('a', String(guests))
      router.push(`${href(`/tours/${matches[0].slug}/book`)}?${q.toString()}`)
      return
    }
    // Anything else: show the matching tours further down this page
    scrollToTours(type ? `tours-${type}` : 'tours', lang)
  }

  const active = slides.length > 0 ? Math.min(index, slides.length - 1) : 0
  const caption = slides.length > 0 ? slides[active].caption[lang] : ''

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={pauseForTouch}
    >
      {slides.length > 0 ? (
        <div className="hero-slides">
          {slides.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.image}
              src={s.image}
              alt=""
              className={i === active ? 'hero-slide active' : 'hero-slide'}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              aria-hidden={i !== active}
            />
          ))}
        </div>
      ) : (
        <div className="hero-bg" />
      )}
      <div className="wa-container hero-content">
        <div className="badge-hero">
          <PinIcon size={14} color="var(--gold-light)" />
          <span>{HERO.tag[lang]}</span>
        </div>
        <h1>{HERO.title[lang]}</h1>
        <p>{HERO.sub[lang]}</p>

        <div className="search-card">
          <form onSubmit={checkAvailability} className="search-grid">
            <div className="form-group">
              <label htmlFor="search-type">{t('lblType')}</label>
              <select id="search-type" className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">{t('anyTour')}</option>
                {options.map((o) => (
                  <option key={o.key} value={o.key}>{o.title[lang]}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="search-date">{t('lblDate')}</label>
              <input id="search-date" type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="search-guests">{t('lblGuests')}</label>
              <select id="search-guests" className="form-control" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n === 10 ? '10+' : n}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 11 }}>
                <CalendarCheck size={18} />
                <span>{t('checkAvail')}</span>
              </button>
            </div>
          </form>
          <p className="hero-prefer">
            <a href={whatsappLink(waMsg)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={14} />
              <span>{t('preferChat')}</span>
            </a>
          </p>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="hero-dots">
          {slides.map((s, i) => (
            <button
              key={s.image}
              type="button"
              className={i === active ? 'hero-dot active' : 'hero-dot'}
              aria-label={s.caption[lang] || `${i + 1} / ${slides.length}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
      {slides.length > 0 ? (
        caption ? <p className="hero-credit">{caption}</p> : null
      ) : (
        <p className="hero-credit">
          {HERO.photo.place[lang]} · <a href={HERO.photo.source} target="_blank" rel="noreferrer">{HERO.photo.author}</a>,{' '}
          <a href={HERO.photo.licenseUrl} target="_blank" rel="noreferrer license">{HERO.photo.license}</a>
        </p>
      )}
    </section>
  )
}
