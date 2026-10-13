'use client'

import { useState, type FormEvent } from 'react'
import { WhatsAppIcon } from './Icons'
import { whatsappLink } from '@/lib/contact'

/** Collects the booking details and hands them to WhatsApp, where our team confirms them */
export default function BookingForm({ tourTitle }: { tourTitle: string }) {
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
        <label htmlFor="book-name">Your Name</label>
        <input id="book-name" type="text" className="form-control" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="booking-row">
        <div className="form-group">
          <label htmlFor="book-date">Date</label>
          <input id="book-date" type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Guests</label>
          <div className="stepper">
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Fewer guests">−</button>
            <span>{guests}</span>
            <button type="button" onClick={() => setGuests((g) => g + 1)} aria-label="More guests">+</button>
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-whatsapp" style={{ width: '100%', padding: 12 }}>
        <WhatsAppIcon />
        <span>Book on WhatsApp</span>
      </button>
      <p style={{ fontSize: 11, color: 'var(--stone-600)', textAlign: 'center' }}>
        {sent ? 'Press send in WhatsApp and we’ll confirm your spot shortly.' : 'We confirm every booking personally on WhatsApp.'}
      </p>
    </form>
  )
}
