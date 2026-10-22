'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'
import { scrollToTours, useSite } from './SiteProvider'
import { PinIcon, WhatsAppIcon } from './Icons'
import { privateTourService, type Tour } from '@/lib/tours'
import { whatsappLink } from '@/lib/contact'
import { HERO } from '@/lib/home-content'

/** Today in Taipei as YYYY-MM-DD, so past dates can't be picked */
const taipeiToday = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' })

export default function Hero({ tours = [] }: { tours?: Tour[] }) {
  const { t, lang, href, services } = useSite()
  const router = useRouter()
  const [type, setType] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState(2)

  const privateTour = privateTourService(services)
  const options = [
    ...tours.map((tour) => ({ key: `tour:${tour.slug}`, title: tour.title })),
    { key: 'private', title: privateTour.title },
  ]
  const chosen = options.find((o) => o.key === type)

  // Same details, sent as a WhatsApp message for people who'd rather chat
  const chatMsg = [
    "Hi Wander Asia! I'd like to check availability.",
    `Tour: ${chosen?.title.EN ?? 'Not sure yet'}`,
    `Date: ${date || 'flexible'}`,
    `Guests: ${guests === 10 ? '10+' : guests}`,
  ].join('\n')

  /** Opens the tour's booking page (live dates and seats) with the date and guests filled in */
  function checkAvailability(e: FormEvent) {
    e.preventDefault()
    if (type.startsWith('tour:')) {
      const q = new URLSearchParams()
      if (date) q.set('date', date)
      q.set('a', String(guests))
      router.push(`${href(`/tours/${type.slice(5)}/book`)}?${q}`)
    } else if (type === 'private') {
      router.push(href(`/services/${privateTour.slug}`))
    } else {
      scrollToTours('tours', lang)
    }
  }

  return (
    <section className="hero">
      <div className="hero-bg" />
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
              <input id="search-date" type="date" className="form-control" min={taipeiToday()} value={date} onChange={(e) => setDate(e.target.value)} />
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
                <CalendarCheck size={18} aria-hidden="true" />
                <span>{t('checkAvail')}</span>
              </button>
            </div>
          </form>
          <a className="hero-chat" href={whatsappLink(chatMsg)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={14} />
            <span>{t('preferChat')}</span>
          </a>
        </div>
      </div>
      <p className="hero-credit">
        {HERO.photo.place[lang]} · <a href={HERO.photo.source} target="_blank" rel="noreferrer">{HERO.photo.author}</a>,{' '}
        <a href={HERO.photo.licenseUrl} target="_blank" rel="noreferrer license">{HERO.photo.license}</a>
      </p>
    </section>
  )
}
