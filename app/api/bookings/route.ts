import { getTourBySlug } from '@/lib/cms'
import { createBooking, verifyTurnstile } from '@/lib/booking/server'
import type { BookingRequest } from '@/lib/booking/types'

const MAX_BODY = 10_000
/** Forms sent faster than this after being shown are almost always bots */
const MIN_FILL_MS = 2_000

/** The booking form posts here (same site); this checks for spam and passes the booking to the CMS */
export async function POST(req: Request) {
  if (!(req.headers.get('content-type') ?? '').includes('application/json')) {
    return Response.json({ error: 'Send JSON' }, { status: 415 })
  }
  const text = await req.text()
  if (text.length > MAX_BODY) return Response.json({ error: 'Too long' }, { status: 413 })

  let body: BookingRequest
  try {
    body = JSON.parse(text)
  } catch {
    return Response.json({ error: 'Bad JSON' }, { status: 400 })
  }

  const ip = req.headers.get('cf-connecting-ip')
  const tooFast = typeof body._t === 'number' && Date.now() - body._t < MIN_FILL_MS
  if (body._hp || tooFast || !(await verifyTurnstile(body.turnstile, ip))) {
    return Response.json({ error: 'spam' }, { status: 400 })
  }

  const tour = typeof body.tourSlug === 'string' ? await getTourBySlug(body.tourSlug) : null
  if (!tour || tour.comingSoon) return Response.json({ error: 'Tour not found' }, { status: 404 })

  const { _hp, _t, turnstile, ...booking } = body
  return createBooking(tour, booking, ip)
}
