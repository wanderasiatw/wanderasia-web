import { getBooking } from '@/lib/booking/server'

type Ctx = { params: Promise<{ ref: string }> }

/** A booking's current state, for the confirmation page to check after the customer returns from paying */
export async function GET(req: Request, { params }: Ctx) {
  const { ref } = await params
  const token = new URL(req.url).searchParams.get('t') ?? ''
  const booking = await getBooking(ref, token)
  if (!booking) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ booking }, { headers: { 'cache-control': 'no-store' } })
}
