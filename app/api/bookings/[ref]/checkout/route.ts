import { startCheckout } from '@/lib/booking/server'
import { LANG_CODE, langFromCode } from '@/lib/i18n'
import { PAYMENT_METHODS, type PaymentMethod } from '@/lib/booking/types'

type Ctx = { params: Promise<{ ref: string }> }

/** Starts paying for a booking with Stripe or PayPal; answers with where to send the customer */
export async function POST(req: Request, { params }: Ctx) {
  const { ref } = await params
  const body = (await req.json().catch(() => ({}))) as { t?: string; method?: string; lang?: string }
  if (!body.t || !PAYMENT_METHODS.includes(body.method as PaymentMethod)) return Response.json({ error: 'Bad request' }, { status: 400 })
  const origin = new URL(req.url).origin
  const checkout = await startCheckout(ref, body.t, body.method as PaymentMethod, LANG_CODE[langFromCode(body.lang ?? 'en')], origin)
  if (!checkout) return Response.json({ error: 'Payment could not be started' }, { status: 409 })
  return Response.json({ checkout })
}
