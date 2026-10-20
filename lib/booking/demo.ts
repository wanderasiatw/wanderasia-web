// Demo bookings for showing the booking flow on localhost before the CMS booking API exists.
// Only used when BOOKING_DEMO=1 (see .env.local). Dates, seats and prices are samples; bookings live in memory
// until the dev server restarts, and nothing is charged or emailed.

import type { Tour } from '@/lib/tours'
import { CURRENCY } from '@/lib/tours'
import {
  EMAIL_RE,
  HOLD_MINUTES,
  MAX_GUESTS_PER_BOOKING,
  PAYMENT_METHODS,
  bookingTotal,
  taiwanToday,
  type Booking,
  type BookingRequest,
  type Checkout,
  type Departure,
  type PaymentMethod,
} from './types'

const DAYS_AHEAD = 90
const CAPACITY = 12

// Kept on globalThis so the bookings survive hot reloads in `next dev`
const g = globalThis as unknown as { __waDemoBookings?: Map<string, Booking> }
const bookings = (g.__waDemoBookings ??= new Map<string, Booking>())

/** Sample price for tours without one in the CMS ("price on request"), so the payment step can be shown */
const demoPrice = () => Number(process.env.BOOKING_DEMO_PRICE) || 35

/** Small stable number from a string, so each date gets the same sample seats on every visit */
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return Math.abs(h)
}

/** "7:00 PM" → "19:00"; "10:00" when the tour has no start time */
function startTime(tour: Tour) {
  const m = tour.startTime?.EN.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i)
  if (!m) return '10:00'
  let h = Number(m[1]) % 12
  if (m[3]?.toLowerCase() === 'pm' || (!m[3] && Number(m[1]) >= 12)) h += 12
  return `${String(h).padStart(2, '0')}:${m[2] ?? '00'}`
}

function addDays(ymd: string, n: number) {
  const d = new Date(`${ymd}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Seats taken by demo bookings that still count (paid, confirmed, or held and not yet expired) */
function seatsTaken(departureId: string) {
  let n = 0
  for (const b of Array.from(bookings.values())) {
    refresh(b)
    if (b.departureId === departureId && (b.status === 'confirmed' || b.status === 'paid' || b.status === 'pending_payment')) n += b.adults + b.children
  }
  return n
}

/** Unpaid bookings past their hold become expired, and their seats free up */
function refresh(b: Booking) {
  if (b.status === 'pending_payment' && b.holdExpiresAt && Date.parse(b.holdExpiresAt) < Date.now()) {
    b.status = 'expired'
    b.holdExpiresAt = null
  }
}

/** Every day except Monday for the next 90 days, at the tour's start time */
export function demoDepartures(tour: Tour): Departure[] {
  const today = taiwanToday()
  const price = tour.price ?? demoPrice()
  const time = startTime(tour)
  const out: Departure[] = []
  for (let i = 1; i <= DAYS_AHEAD; i++) {
    const date = addDays(today, i)
    if (new Date(`${date}T12:00:00Z`).getUTCDay() === 1) continue
    const id = `${tour.slug}_${date}_${time.replace(':', '')}`
    const r = hash(id) % 100
    // About one date in nine is sold out and one in six is nearly full
    const sample = r < 11 ? CAPACITY : r < 28 ? CAPACITY - 1 - (r % 3) : r % 7
    out.push({
      id,
      date,
      time,
      capacity: CAPACITY,
      seatsLeft: Math.max(0, CAPACITY - sample - seatsTaken(id)),
      price,
      childPrice: price,
      currency: CURRENCY,
    })
  }
  return out
}

function code(length: number, alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789') {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

type Result = { status: number; body: unknown }

/** Checks the request like the CMS will, then saves the booking: free tours are confirmed, paid tours hold their seats */
export function demoCreateBooking(tour: Tour, req: BookingRequest): Result {
  const fields: Record<string, string> = {}
  if (!req.name?.trim()) fields.name = 'required'
  if (!req.email?.trim()) fields.email = 'required'
  else if (!EMAIL_RE.test(req.email.trim())) fields.email = 'invalid'
  if (!req.phone?.trim()) fields.phone = 'required'
  if (!req.agree) fields.agree = 'required'
  if (Object.keys(fields).length) return { status: 422, body: { error: 'Check the fields', fields } }

  const dep = demoDepartures(tour).find((d) => d.id === req.departureId)
  if (!dep) return { status: 404, body: { error: 'Departure not found' } }
  const adults = Math.floor(Number(req.adults))
  const children = Math.floor(Number(req.children) || 0)
  const guests = adults + children
  if (!(adults >= 1) || children < 0 || guests > MAX_GUESTS_PER_BOOKING) return { status: 422, body: { error: 'Check the guests', fields: { adults: 'invalid' } } }
  if (guests > dep.seatsLeft) return { status: 409, body: { error: 'sold-out', seatsLeft: dep.seatsLeft } }

  const total = bookingTotal(dep, adults, children)
  const booking: Booking = {
    ref: `WA-${code(6)}`,
    token: code(24, 'abcdefghijkmnopqrstuvwxyz23456789'),
    status: total === 0 ? 'confirmed' : 'pending_payment',
    tourSlug: tour.slug,
    tourTitle: tour.title.EN,
    departureId: dep.id,
    date: dep.date,
    time: dep.time,
    adults,
    children,
    total,
    currency: dep.currency,
    name: req.name.trim(),
    email: req.email.trim(),
    phone: req.phone.trim(),
    country: req.country?.trim() || undefined,
    notes: req.notes?.trim() || undefined,
    lang: req.lang === 'zh' ? 'zh' : 'en',
    holdExpiresAt: total === 0 ? null : new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString(),
    paymentMethods: PAYMENT_METHODS,
    createdAt: new Date().toISOString(),
  }
  bookings.set(booking.ref, booking)
  return { status: 201, body: { booking } }
}

export function demoGetBooking(ref: string, token: string): Booking | null {
  const b = bookings.get(ref)
  if (!b || b.token !== token) return null
  refresh(b)
  return { ...b }
}

/** Instead of Stripe or ECPay, the demo checkout page on this site */
export function demoCheckout(ref: string, token: string, method: PaymentMethod, lang: 'en' | 'zh'): Checkout | null {
  const b = demoGetBooking(ref, token)
  if (!b || b.status !== 'pending_payment') return null
  const prefix = lang === 'zh' ? '/zh' : ''
  return { url: `${prefix}/booking/${encodeURIComponent(ref)}/demo-pay?t=${encodeURIComponent(token)}&method=${method}` }
}

/** What the payment provider's webhook will do in the CMS: mark the booking paid */
export function demoMarkPaid(ref: string, token: string, method: PaymentMethod): Booking | null {
  const b = bookings.get(ref)
  if (!b || b.token !== token) return null
  refresh(b)
  if (b.status !== 'pending_payment') return null
  b.status = 'paid'
  b.paidWith = method
  b.holdExpiresAt = null
  return { ...b }
}
