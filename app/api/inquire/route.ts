import { sendForm } from '@/lib/cms'

const MAX_BODY = 20_000

/** The inquiry form posts here (same site), and this passes it to the CMS */
export async function POST(req: Request) {
  if (!(req.headers.get('content-type') ?? '').includes('application/json')) {
    return Response.json({ error: 'Send JSON' }, { status: 415 })
  }
  const body = await req.text()
  if (body.length > MAX_BODY) return Response.json({ error: 'Too long' }, { status: 413 })
  return sendForm('inquiry', body, req.headers.get('cf-connecting-ip'))
}
