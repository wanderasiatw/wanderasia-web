// Booking types and helpers shared by the server and the browser.
// The CMS (plyndi-cms) owns bookings, seats and payments; the website shows them and passes requests on.
// See lib/booking/server.ts for the CMS API the website expects.

import { INTL_LOCALE, type Lang, type LangCode } from '@/lib/i18n'

export type BookingStatus = 'confirmed' | 'pending_payment' | 'paid' | 'expired' | 'cancelled'

/** The language a booking was made in, as a code the CMS understands ('en', 'zh', 'zh-cn', 'ja', 'ko') */
export type BookingLang = LangCode

/**
 * Stripe: cards, Apple Pay and Google Pay. PayPal: a PayPal account or a card saved in it.
 * 'ecpay' only appears on old bookings: Wander Asia removed it (Oct 2026); it can come back if they ask.
 */
export type PaymentMethod = 'stripe' | 'paypal' | 'ecpay'
/** Methods a customer can choose */
export const PAYMENT_METHODS: PaymentMethod[] = ['stripe', 'paypal']

/** One date and start time of a tour, with its seats and prices */
export interface Departure {
  id: string
  /** YYYY-MM-DD, Taiwan time */
  date: string
  /** HH:MM, 24-hour, Taiwan time */
  time: string
  capacity: number
  seatsLeft: number
  /** Per adult; 0 = free */
  price: number
  /** Per child; the adult price when the CMS doesn't set one */
  childPrice: number
  /** ISO code, e.g. USD or TWD */
  currency: string
}

export interface Booking {
  ref: string
  /** Secret part of the booking link, so strangers can't open other people's bookings */
  token: string
  status: BookingStatus
  tourSlug: string
  tourTitle: string
  departureId: string
  date: string
  time: string
  adults: number
  children: number
  total: number
  currency: string
  name: string
  email: string
  phone: string
  country?: string
  notes?: string
  lang: BookingLang
  /** When unpaid seats are released (pending_payment only) */
  holdExpiresAt: string | null
  /** The ways this booking can be paid, as set up in the CMS */
  paymentMethods: PaymentMethod[]
  paidWith?: PaymentMethod
  createdAt: string
}

/** What the booking form sends */
export interface BookingRequest {
  tourSlug: string
  departureId: string
  adults: number
  children: number
  name: string
  email: string
  phone: string
  country: string
  notes: string
  agree: boolean
  lang: BookingLang
  /** Spam checks: hidden field, time the form was shown, Cloudflare Turnstile token */
  _hp?: string
  _t?: number
  turnstile?: string
}

/** Where to send the customer to pay: a page address (Stripe Checkout, PayPal) or a form to post (a provider like ECPay, not used now) */
export type Checkout = { url: string } | { form: { action: string; fields: Record<string, string> } }

/** Most guests one booking can hold, whatever the seats left */
export const MAX_GUESTS_PER_BOOKING = 10
/** Minutes unpaid seats are held */
export const HOLD_MINUTES = 30

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function bookingTotal(dep: Pick<Departure, 'price' | 'childPrice'>, adults: number, children: number) {
  return dep.price * adults + dep.childPrice * children
}

/** e.g. $35 or NT$1,200 */
export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}


/** A YYYY-MM-DD date as a Date at noon UTC, so it shows as the same day everywhere */
export const dateOf = (ymd: string) => new Date(`${ymd}T12:00:00Z`)

/** e.g. "Sat, 24 Oct 2026" or "2026年10月24日 週六" */
export function formatDate(ymd: string, lang: Lang, withYear = true) {
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], {
    weekday: 'short',
    day: 'numeric',
    month: lang === 'EN' ? 'short' : 'long',
    ...(withYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  }).format(dateOf(ymd))
}

/** "19:00" → "7:00 PM" (English) or "19:00" (the other languages, which use the 24-hour clock here) */
export function formatTime(hhmm: string, lang: Lang) {
  if (lang !== 'EN') return hhmm
  const [h, m] = hhmm.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

export function monthTitle(year: number, month: number, lang: Lang) {
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month, 1, 12)))
}

/** Today's date in Taiwan, YYYY-MM-DD */
export function taiwanToday() {
  return new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10)
}
