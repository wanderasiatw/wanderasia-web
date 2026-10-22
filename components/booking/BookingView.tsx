'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, CalendarPlus, Check, CreditCard, Landmark } from 'lucide-react'
import { LANG_CODE, fill } from '@/lib/i18n'
import { whatsappLink } from '@/lib/contact'
import type { Tour } from '@/lib/tours'
import { formatDate, formatMoney, formatTime, type Booking, type Checkout, type PaymentMethod } from '@/lib/booking/types'
import { googleCalendarUrl, icsFile } from '@/lib/booking/calendar'
import { WhatsAppIcon } from '../Icons'
import { useSite } from '../SiteProvider'
import BookingSummary, { guestsText } from './BookingSummary'
import DemoNotice from './DemoNotice'
import StepBar from './StepBar'

type TourInfo = Pick<Tour, 'slug' | 'title' | 'image' | 'category' | 'meetingPoint' | 'duration'>

/** How often, and how many times, to check for the payment after the customer comes back from Stripe or ECPay */
const POLL_MS = 3000
const POLL_TRIES = 10

/** Sends the customer to Stripe (an address) or ECPay (a form posted to its payment page) */
function goToCheckout(checkout: Checkout) {
  if ('url' in checkout) {
    window.location.assign(checkout.url)
    return
  }
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = checkout.form.action
  for (const [name, value] of Object.entries(checkout.form.fields)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
}

function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [active])
  return now
}

/**
 * The booking page: step 5 (Payment) while a paid booking waits for payment, then the confirmation.
 * Payment is confirmed by the provider's webhook to the CMS, never by this page, so after paying it checks back until the CMS says so.
 */
export default function BookingView({ initial, tour, demo, returned }: { initial: Booking; tour: TourInfo | null; demo: boolean; returned: boolean }) {
  const { lang, t, href } = useSite()
  const router = useRouter()
  const [booking, setBooking] = useState(initial)
  const [method, setMethod] = useState<PaymentMethod>(initial.paymentMethods[0] ?? 'stripe')
  const [paying, setPaying] = useState(false)
  const [message, setMessage] = useState('')
  const [confirming, setConfirming] = useState(returned && initial.status === 'pending_payment')
  const now = useNow(booking.status === 'pending_payment')

  const refetch = useCallback(async () => {
    const res = await fetch(`/api/bookings/${encodeURIComponent(booking.ref)}?t=${encodeURIComponent(booking.token)}`, { cache: 'no-store' })
    if (!res.ok) return null
    const { booking: b } = (await res.json()) as { booking: Booking }
    setBooking(b)
    return b
  }, [booking.ref, booking.token])

  // Back from paying: check until the webhook has marked it paid
  useEffect(() => {
    if (!confirming) return
    let tries = 0
    const id = setInterval(async () => {
      tries++
      const b = await refetch().catch(() => null)
      if ((b && b.status !== 'pending_payment') || tries >= POLL_TRIES) {
        clearInterval(id)
        setConfirming(false)
        if (b?.status === 'pending_payment') setMessage(t('confirmingSlow'))
      }
    }, POLL_MS)
    return () => clearInterval(id)
  }, [confirming, refetch, t])

  // Hold ran out: the CMS releases the seats
  const left = booking.holdExpiresAt ? Math.max(0, Date.parse(booking.holdExpiresAt) - now) : 0
  useEffect(() => {
    if (booking.status === 'pending_payment' && booking.holdExpiresAt && left === 0) refetch().catch(() => null)
  }, [left, booking.status, booking.holdExpiresAt, refetch])

  async function pay() {
    if (paying) return
    setPaying(true)
    setMessage('')
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(booking.ref)}/checkout`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ t: booking.token, method, lang: LANG_CODE[lang] }),
      })
      const body = (await res.json().catch(() => ({}))) as { checkout?: Checkout }
      if (res.ok && body.checkout) {
        goToCheckout(body.checkout)
        return
      }
      const b = await refetch().catch(() => null)
      if (!b || b.status === 'pending_payment') setMessage(t('payFailed'))
    } catch {
      setMessage(t('payFailed'))
    }
    setPaying(false)
  }

  const title = tour?.title[lang] ?? booking.tourTitle
  const money = (n: number) => (n === 0 ? t('free') : formatMoney(n, booking.currency))
  const event = {
    title: `${tour?.title.EN ?? booking.tourTitle} (Wander Asia)`,
    details: `Booking ${booking.ref}\n${guestsText(t, booking.adults, booking.children)}\nWhatsApp: ${whatsappLink()}`,
    location: tour?.meetingPoint?.EN,
    duration: tour?.duration?.EN,
  }
  const downloadIcs = () => {
    const url = URL.createObjectURL(new Blob([icsFile(booking, event)], { type: 'text/calendar' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `wander-asia-${booking.ref}.ics`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const whatsapp = (
    <a href={whatsappLink(`Hi Wander Asia! My booking reference is ${booking.ref}.`)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
      <WhatsAppIcon />
      <span>{t('questionsWhatsApp')}</span>
    </a>
  )
  const summary = tour && (
    <BookingSummary
      tour={tour}
      data={{ date: booking.date, time: booking.time, adults: booking.adults, children: booking.children, price: 0, childPrice: 0, currency: booking.currency, total: booking.total }}
    />
  )

  const isBooked = booking.status === 'confirmed' || booking.status === 'paid'
  const mm = String(Math.floor(left / 60000)).padStart(2, '0')
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, '0')

  return (
    <main>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wa-container">
          <DemoNotice show={demo} />
          {booking.status === 'pending_payment' && <StepBar current={5} />}

          <div className="book-grid">
            <div className="panel">
              {message && <p role="alert" className="book-error" style={{ marginBottom: 14 }}>{message}</p>}

              {booking.status === 'pending_payment' ? (
                confirming ? (
                  <div className="booked-head" role="status">
                    <h2>{t('confirmingPay')}</h2>
                  </div>
                ) : (
                  <>
                    <h2 className="book-step-title">{t('payTitle')}</h2>
                    {booking.holdExpiresAt && (
                      <p className="hold-timer" role="timer" aria-live="off">
                        {t('holdLeft')} <strong>{mm}:{ss}</strong>
                      </p>
                    )}
                    <div className="pay-options" role="radiogroup" aria-label={t('payTitle')}>
                      {booking.paymentMethods.includes('stripe') && (
                        <label className={`pay-option${method === 'stripe' ? ' selected' : ''}`}>
                          <input type="radio" name="method" value="stripe" checked={method === 'stripe'} onChange={() => setMethod('stripe')} />
                          <CreditCard size={22} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span>
                            <strong>{t('payByCard')}</strong>
                            <small>{t('payByCardText')}</small>
                            <span className="pay-brands" aria-hidden="true">
                              <span>VISA</span><span>Mastercard</span><span>AMEX</span><span>Apple Pay</span><span>Google Pay</span>
                            </span>
                          </span>
                        </label>
                      )}
                      {booking.paymentMethods.includes('ecpay') && (
                        <label className={`pay-option${method === 'ecpay' ? ' selected' : ''}`}>
                          <input type="radio" name="method" value="ecpay" checked={method === 'ecpay'} onChange={() => setMethod('ecpay')} />
                          <Landmark size={22} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span>
                            <strong>{t('payTaiwan')}</strong>
                            <small>{t('payTaiwanText')}</small>
                            <span className="pay-brands" aria-hidden="true">
                              <span>綠界 ECPay</span><span>{lang === 'ZH' || lang === 'ZH_HANS' ? '信用卡' : 'Card'}</span><span>ATM</span><span>{lang === 'ZH' || lang === 'ZH_HANS' ? '超商' : '7-ELEVEN / FamilyMart'}</span>
                            </span>
                          </span>
                        </label>
                      )}
                    </div>
                    <div className="book-actions">
                      <button type="button" className="btn btn-primary" onClick={pay} disabled={paying || left === 0} style={{ width: '100%' }}>
                        {paying ? t('redirecting') : fill(t('payButton'), { amount: money(booking.total) })}
                      </button>
                    </div>
                    <p className="book-hint" style={{ textAlign: 'center' }}>{t('securePay')}</p>
                    <p className="book-hint" style={{ textAlign: 'center' }}>{t('bookingRef')}: <strong>{booking.ref}</strong></p>
                  </>
                )
              ) : isBooked ? (
                <>
                  <div className="booked-head">
                    <span className="booked-icon"><Check size={30} strokeWidth={3} /></span>
                    <h2>{booking.status === 'paid' ? t('paidTitle') : t('bookedTitle')}</h2>
                    <p>{fill(t('bookedText'), { email: booking.email })}</p>
                    <div>
                      <span className="ref-box" aria-label={t('bookingRef')}>{booking.ref}</span>
                    </div>
                  </div>
                  <ul className="summary-lines" style={{ fontSize: 14, gap: 10 }}>
                    <li><span>{t('status')}</span><span><span className={`status-pill ${booking.status}`}>{t(`status_${booking.status}`)}</span></span></li>
                    <li><span>{t('tourLabel')}</span><span>{title}</span></li>
                    <li><span>{t('when')}</span><span>{formatDate(booking.date, lang)} · {formatTime(booking.time, lang)}</span></li>
                    {tour?.meetingPoint && <li><span>{t('meet')}</span><span>{tour.meetingPoint[lang]}</span></li>}
                    <li><span>{t('guests')}</span><span>{guestsText(t, booking.adults, booking.children)}</span></li>
                    <li><span>{t('total')}</span><span>{money(booking.total)}{booking.paidWith ? ` · ${t(`paidWith_${booking.paidWith}`)}` : ''}</span></li>
                  </ul>
                  <div className="booked-actions">
                    <button type="button" className="btn btn-primary" onClick={downloadIcs}><CalendarPlus size={16} /> {t('addCalendar')}</button>
                    <a className="btn btn-outline" href={googleCalendarUrl(booking, event)} target="_blank" rel="noreferrer">{t('googleCalendar')}</a>
                    {whatsapp}
                  </div>
                </>
              ) : (
                <div className="booked-head">
                  <span className="booked-icon warn"><AlertTriangle size={28} /></span>
                  <h2>{booking.status === 'expired' ? t('expiredTitle') : t('cancelledTitle')}</h2>
                  <p>{booking.status === 'expired' ? t('expiredText') : t('cancelledText')}</p>
                  <div className="booked-actions" style={{ justifyContent: 'center' }}>
                    {booking.status === 'expired' && tour && (
                      <Link href={href(`/tours/${tour.slug}/book`)} className="btn btn-primary" onClick={() => router.refresh()}>{t('bookAgain')}</Link>
                    )}
                    {whatsapp}
                  </div>
                </div>
              )}
            </div>
            {summary}
          </div>
        </div>
      </section>
    </main>
  )
}
