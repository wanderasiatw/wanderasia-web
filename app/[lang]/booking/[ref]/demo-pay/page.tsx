import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { langFromParam, localePath, translate } from '@/lib/i18n'
import { getBooking, isBookingDemo } from '@/lib/booking/server'
import { PAYMENT_METHODS, type PaymentMethod } from '@/lib/booking/types'
import DemoCheckout from '@/components/booking/DemoCheckout'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ lang: string; ref: string }>
  searchParams: Promise<{ t?: string | string[]; method?: string | string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return { title: translate(lang, 'demoPayTitle'), robots: { index: false, follow: false } }
}

/** Demo mode only: where "Pay" goes instead of Stripe or ECPay */
export default async function DemoPayPage({ params, searchParams }: Props) {
  if (!isBookingDemo()) notFound()
  const [{ lang: param, ref }, q] = await Promise.all([params, searchParams])
  const lang = langFromParam(param) ?? 'EN'
  const token = typeof q.t === 'string' ? q.t : ''
  const booking = await getBooking(decodeURIComponent(ref), token)
  if (!booking) notFound()
  if (booking.status !== 'pending_payment') redirect(localePath(lang, `/booking/${booking.ref}?t=${token}`))
  const method: PaymentMethod = PAYMENT_METHODS.includes(q.method as PaymentMethod) ? (q.method as PaymentMethod) : 'stripe'
  return <DemoCheckout booking={booking} method={method} />
}
