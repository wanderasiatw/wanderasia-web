import { isBookingDemo } from '@/lib/booking/server'
import { demoMarkPaid } from '@/lib/booking/demo'
import { PAYMENT_METHODS, type PaymentMethod } from '@/lib/booking/types'

type Ctx = { params: Promise<{ ref: string }> }

/** Demo mode only: stands in for the Stripe or PayPal webhook and marks the booking paid */
export async function POST(req: Request, { params }: Ctx) {
  if (!isBookingDemo()) return Response.json({ error: 'Not found' }, { status: 404 })
  const { ref } = await params
  const body = (await req.json().catch(() => ({}))) as { t?: string; method?: string }
  const method = PAYMENT_METHODS.includes(body.method as PaymentMethod) ? (body.method as PaymentMethod) : 'stripe'
  const booking = demoMarkPaid(ref, body.t ?? '', method)
  if (!booking) return Response.json({ error: 'Cannot pay this booking' }, { status: 409 })
  return Response.json({ booking })
}
