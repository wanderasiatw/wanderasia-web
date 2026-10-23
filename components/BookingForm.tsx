'use client'

import { useState, type FormEvent } from 'react'
import { WhatsAppIcon } from './Icons'
import { whatsappLink } from '@/lib/contact'
import { formatPrice } from '@/lib/tours'
import { fill } from '@/lib/i18n'
import { useSite } from './SiteProvider'

/**
 * Collects the booking details and hands them to WhatsApp, where our team confirms them.
 * The message is always in English. When the tour has a per-person price, the form shows
 * the running total and includes it in the message; the guest stepper stops at the
 * tour's group-size cap when one is known (30 otherwise).
 */
export default function BookingForm({ tourTitle, price, currency, maxGuests, initialDate, initialGuests }: { tourTitle: string; price?: number | null; currency?: string; maxGuests?: number; initialDate?: string; initialGuests?: number }) {
  const { t } = useSite()
  const [name, setName] = useState('')
  const [today] = useState(() => new Date().toISOString().slice(0, 10))
  const cap = maxGuests && maxGuests > 0 ? maxGuests : 30
  const [date, setDate] = useState(initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate) && initialDate >= today ? initialDate : '')
  const [guests, setGuests] = useState(initialGuests && initialGuests > 0 ? Math.min(Math.floor(initialGuests), cap) : 1)
  const [sent, setSent] = useState(false)
  const total = price != null && price > 0 ? price * guests : null

  function submit(e: FormEvent) {
    e.preventDefault()
    const msg = [
      `Hi Wander Asia! I'd like to book the ${tourTitle}.`,
      `Name: ${name.trim()}`,
      `Date: ${date || 'flexible'}`,
      `Guests: ${guests}`,
      ...(total != null ? [`Total: ${formatPrice(total, currency)}`] : []),
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
          <input id="book-date" type="date" className="form-control" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('guests')}</label>
          <div className="stepper">
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label={t('fewerGuests')}>−</button>
            <span>{guests}</span>
            <button type="button" onClick={() => setGuests((g) => Math.min(cap, g + 1))} aria-label={t('moreGuests')}>+</button>
          </div>
        </div>
      </div>
      {total != null && (
        <div className="booking-total">
          <span>{guests === 1 ? t('totalForOneGuest') : fill(t('totalForGuests'), { n: guests })}</span>
          <strong>{formatPrice(total, currency)}</strong>
        </div>
      )}
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
