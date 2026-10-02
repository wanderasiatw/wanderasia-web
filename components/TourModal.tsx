'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { CURRENCY, formatPrice, type Tour } from '@/lib/tours'

export default function TourModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [guests, setGuests] = useState(1)
  const [sent, setSent] = useState(false)
  const total = tour.price * guests

  function submitBooking(e: FormEvent) {
    e.preventDefault()
    // TODO: send to your backend / email / LINE Notify
    setSent(true)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tour.image} alt={tour.title} />
          <button onClick={onClose} className="modal-close" aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>{tour.destination}</span>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{tour.title}</h3>

          {tour.highlights.length > 0 && (
            <>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate-600)', marginBottom: 6 }}>Highlights:</p>
              <ul style={{ fontSize: 12, color: 'var(--slate-600)', marginLeft: 16, marginBottom: 16, listStyle: 'disc' }}>
                {tour.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </>
          )}

          <div style={{ background: 'var(--slate-50)', padding: 12, borderRadius: 10, border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: 10, color: 'var(--slate-400)' }}>Price / person</span>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)' }}>{formatPrice(tour.price)} {CURRENCY}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Guests:</span>
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="btn" style={{ padding: '2px 8px', background: 'var(--slate-200)' }}>-</button>
              <span style={{ fontSize: 14, fontWeight: 800 }}>{guests}</span>
              <button type="button" onClick={() => setGuests((g) => g + 1)} className="btn" style={{ padding: '2px 8px', background: 'var(--slate-200)' }}>+</button>
            </div>
          </div>

          {sent ? (
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textAlign: 'center', padding: 12 }}>
              Booking request for {tour.title} ({guests} guest{guests > 1 ? 's' : ''}) received! We will contact you via Email/LINE shortly.
            </p>
          ) : (
            <form onSubmit={submitBooking}>
              <input type="text" placeholder="Your Name" required className="form-control" style={{ marginBottom: 8 }} />
              <input type="email" placeholder="Email Address" required className="form-control" style={{ marginBottom: 12 }} />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }}>
                Book Now ({formatPrice(total)} {CURRENCY})
              </button>
            </form>
          )}

          <Link href={`/tours/${tour.slug}`} style={{ display: 'block', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginTop: 12 }}>
            See full itinerary →
          </Link>
        </div>
      </div>
    </div>
  )
}
