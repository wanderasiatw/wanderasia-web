'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CreditCard, Landmark } from 'lucide-react'
import { fill } from '@/lib/i18n'
import { formatMoney, type Booking, type PaymentMethod } from '@/lib/booking/types'
import { useSite } from '../SiteProvider'

/** Demo mode only: a stand-in for the Stripe or PayPal payment page. Nothing is charged. */
export default function DemoCheckout({ booking, method }: { booking: Booking; method: PaymentMethod }) {
  const { t, href } = useSite()
  const router = useRouter()
  const [paying, setPaying] = useState(false)
  const back = href(`/booking/${encodeURIComponent(booking.ref)}?t=${encodeURIComponent(booking.token)}`)
  const provider = method === 'stripe' ? 'Stripe Checkout' : method === 'paypal' ? 'PayPal' : 'ECPay 綠界科技'
  const amount = formatMoney(booking.total, booking.currency)
  const Icon = method === 'stripe' ? CreditCard : Landmark

  async function pay() {
    setPaying(true)
    const res = await fetch(`/api/bookings/${encodeURIComponent(booking.ref)}/demo-pay`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ t: booking.token, method }),
    })
    if (res.ok) {
      // Real payments come back to the same page with ?paid=1, after the provider tells the CMS
      router.replace(`${back}&paid=1`)
      return
    }
    router.replace(back)
  }

  return (
    <main style={{ background: method === 'stripe' ? '#f6f9fc' : '#f3f7f2', minHeight: '70vh' }}>
      <section className="section">
        <div className="wa-container" style={{ maxWidth: 480 }}>
          <p className="demo-notice">{t('demoNotice')}</p>
          <div className="panel flex flex-col gap-4" style={{ textAlign: 'center', padding: 28 }}>
            <Icon size={36} style={{ margin: '0 auto', color: method === 'stripe' ? '#635bff' : '#00a651' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--stone-400)', textTransform: 'uppercase', letterSpacing: 1 }}>{t('demoPayTitle')}</div>
              <div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>{provider}</div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--stone-600)' }}>{fill(t('demoPayText'), { provider })}</p>
            <div style={{ fontSize: 13 }}>
              Wander Asia · {booking.tourTitle}
              <br />
              {t('bookingRef')}: <strong>{booking.ref}</strong>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary)' }}>{amount}</div>
            <button type="button" className="btn btn-primary" style={{ padding: 14, background: method === 'stripe' ? '#635bff' : '#00a651' }} onClick={pay} disabled={paying}>
              {paying ? t('reserving') : fill(t('demoPayButton'), { amount })}
            </button>
            <Link href={back} style={{ fontSize: 13, fontWeight: 700, color: 'var(--stone-600)' }}>{t('cancelPay')}</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
