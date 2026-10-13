'use client'

import { useState, type FormEvent } from 'react'
import { WhatsAppIcon } from './Icons'
import { whatsappLink } from '@/lib/contact'
import { useSite } from './SiteProvider'

/** Collects the booking details and hands them to WhatsApp, where our team confirms them. The message is always in English. */
export default function BookingForm({ tourTitle }: { tourTitle: string }) {
  const { t } = useSite()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState(1)
  const [sent, setSent] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    const msg = [
      `Hi Wander Asia! I'd like to book the ${tourTitle}.`,
      `Name: ${name.trim()}`,
      `Date: ${date || 'flexible'}`,
      `Guests: ${guests}`,
    ].join('\n')
    window.open(whatsappLink(msg), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="form-group">
        <label htmlFor="book-name">{t('yourName')}</label>
        <input id="book-name" type="text" className="form-control" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="booking-row">
        <div className="form-group">
          <label htmlFor="book-date">{t('date')}</label>
          <input id="book-date" type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('guests')}</label>
          <div className="stepper">
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label={t('fewerGuests')}>−</button>
            <span>{guests}</span>
            <button type="button" onClick={() => setGuests((g) => g + 1)} aria-label={t('moreGuests')}>+</button>
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-whatsapp" style={{ width: '100%', padding: 12 }}>
        <WhatsAppIcon />
        <span>{t('bookWhatsApp')}</span>
      </button>
      <p style={{ fontSize: 11, color: 'var(--stone-600)', textAlign: 'center' }}>
        {sent ? t('bookSent') : t('bookNote')}
      </p>
    </form>
  )
}
