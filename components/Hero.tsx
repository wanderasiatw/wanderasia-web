'use client'

import { useState, type FormEvent } from 'react'
import { useSite } from './SiteProvider'
import { PinIcon, WhatsAppIcon } from './Icons'
import { privateTourService } from '@/lib/tours'
import { whatsappLink } from '@/lib/contact'

export default function Hero() {
  const { t, lang, categories, services } = useSite()
  const [type, setType] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState(2)

  const options = [...categories.map((c) => ({ key: c.key, title: c.title })), { key: 'private', title: privateTourService(services).title }]

  function checkAvailability(e: FormEvent) {
    e.preventDefault()
    const tour = options.find((o) => o.key === type)?.title.EN ?? 'Not sure yet'
    const msg = [
      "Hi Wander Asia! I'd like to check availability.",
      `Tour: ${tour}`,
      `Date: ${date || 'flexible'}`,
      `Guests: ${guests === 10 ? '10+' : guests}`,
    ].join('\n')
    window.open(whatsappLink(msg), '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="wa-container hero-content">
        <div className="badge-hero">
          <PinIcon size={14} color="var(--gold-light)" />
          <span>{t('heroTag')}</span>
        </div>
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroSub')}</p>

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
              <button type="submit" className="btn btn-whatsapp" style={{ width: '100%', padding: 11 }}>
                <WhatsAppIcon />
                <span>{t('checkAvail')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
