// Server-side booking calls. The CMS owns departures, bookings and payments; this file passes requests to it.
//
// CMS API the website expects (to be built in plyndi-cms, Part A of the plan):
//   GET  /api/v1/tours/:slug/departures?from=YYYY-MM-DD&to=YYYY-MM-DD
//        → 200 { departures: Departure[] }               (404 = this tour isn't booked online; the WhatsApp form shows)
//   POST /api/v1/bookings                  BookingRequest (+ ip in cf-connecting-ip)
//        → 201 { booking: Booking }   free tours are 'confirmed'; paid tours are 'pending_payment' with seats held 30 minutes
//        → 409 { error: 'sold-out', seatsLeft }   422 { fields: { name: 'required' | 'invalid', … } }   429 too many
//   GET  /api/v1/bookings/:ref?t=token     → 200 { booking: Booking }   404 unknown ref or wrong token
//   POST /api/v1/bookings/:ref/checkout    { t, method, lang, returnUrl, cancelUrl }
//        → 200 { checkout: { url } }  (Stripe Checkout)   or   { checkout: { form: { action, fields } } }  (ECPay)
//        The provider's webhook goes straight to the CMS, which marks the booking 'paid' and sends the emails.
//   (Types: lib/booking/types.ts)
//
// Until that exists, BOOKING_DEMO=1 runs the same flow with sample data (lib/booking/demo.ts) so it can be shown on localhost.

import { cmsRequest } from '@/lib/cms'
import type { Tour } from '@/lib/tours'
import { demoCheckout, demoCreateBooking, demoDepartures, demoGetBooking } from './demo'
import { taiwanToday, type Booking, type BookingRequest, type Checkout, type Departure, type PaymentMethod } from './types'

export const isBookingDemo = () => process.env.BOOKING_DEMO === '1'

/** Cloudflare Turnstile site key for the spam check on the details step; unset = no widget */
export const turnstileSiteKey = () => process.env.TURNSTILE_SITE_KEY || undefined

/** Open departures for the next 90 days, or null when the tour can't be booked online (the WhatsApp form shows instead) */
export async function getDepartures(tour: Tour): Promise<Departure[] | null> {
  if (tour.comingSoon) return null
  if (isBookingDemo()) return demoDepartures(tour)
  const from = taiwanToday()
  const to = new Date(Date.parse(`${from}T00:00:00Z`) + 90 * 86400_000).toISOString().slice(0, 10)
  const res = await cmsRequest(`/api/v1/tours/${encodeURIComponent(tour.slug)}/departures?from=${from}&to=${to}`)
  if (!res || !res.ok) return null
  try {
    const { departures } = (await res.json()) as { departures: Departure[] }
    return Array.isArray(departures) ? departures.map((d) => ({ ...d, childPrice: d.childPrice ?? d.price })) : null
  } catch {
    return null
  }
}

/** The first date with seats left */
export function nextAvailable(departures: Departure[]): Departure | undefined {
  return departures.find((d) => d.seatsLeft > 0)
}

const json = (body: unknown, status: number) => Response.json(body, { status })

/** Passes a booking to the CMS and returns its answer as-is */
export async function createBooking(tour: Tour, req: BookingRequest, visitorIp: string | null): Promise<Response> {
  if (isBookingDemo()) {
    const { status, body } = demoCreateBooking(tour, req)
    return json(body, status)
  }
  const res = await cmsRequest('/api/v1/bookings', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(visitorIp ? { 'cf-connecting-ip': visitorIp } : {}) },
    body: JSON.stringify(req),
  })
  if (!res) return json({ error: 'Booking is not available' }, 503)
  return new Response(await res.text(), { status: res.status, headers: { 'content-type': 'application/json' } })
}

export async function getBooking(ref: string, token: string): Promise<Booking | null> {
  if (!ref || !token) return null
  if (isBookingDemo()) return demoGetBooking(ref, token)
  const res = await cmsRequest(`/api/v1/bookings/${encodeURIComponent(ref)}?t=${encodeURIComponent(token)}`)
  if (!res || !res.ok) return null
  try {
    return ((await res.json()) as { booking: Booking }).booking ?? null
  } catch {
    return null
  }
}

/** Asks the CMS to start a Stripe or ECPay payment, and returns where to send the customer */
export async function startCheckout(
  ref: string,
  token: string,
  method: PaymentMethod,
  lang: 'en' | 'zh',
  origin: string,
): Promise<Checkout | null> {
  if (isBookingDemo()) return demoCheckout(ref, token, method, lang)
  const page = `${origin}${lang === 'zh' ? '/zh' : ''}/booking/${encodeURIComponent(ref)}?t=${encodeURIComponent(token)}`
  const res = await cmsRequest(`/api/v1/bookings/${encodeURIComponent(ref)}/checkout`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ t: token, method, lang, returnUrl: `${page}&paid=1`, cancelUrl: page }),
  })
  if (!res || !res.ok) return null
  try {
    return ((await res.json()) as { checkout: Checkout }).checkout ?? null
  } catch {
    return null
  }
}

/** Checks a Turnstile token with Cloudflare. Passes when Turnstile isn't set up (no secret). */
export async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  try {
    const body = new FormData()
    body.set('secret', secret)
    body.set('response', token)
    if (ip) body.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
    return Boolean(((await res.json()) as { success?: boolean }).success)
  } catch {
    return false
  }
}
