import OpenCC from 'opencc-js'
import {
  CATEGORIES,
  SERVICES,
  TOURS,
  type Category,
  type PriceOption,
  type Service,
  type Text,
  type TextList,
  type Tour,
  type TourCategory,
  type TourFact,
  type TourHiking,
  type TourRating,
} from './tours'

// CMS content fields the website reads, for one text field (shown here for `title`; the same pattern
// applies to every text field — description, location, summary, body, highlights, included, blurb, …):
//   title        English
//   titleZh      Traditional Chinese
//   titleZhHans  Simplified Chinese — optional; when the CMS doesn't send it, the Traditional Chinese
//                text is converted automatically (opencc-js, Traditional → Simplified)
//   titleJa      Japanese — optional; falls back to English when the CMS doesn't send it
//   titleKo      Korean — optional; falls back to English when the CMS doesn't send it
// Tastings use the same pattern on `name` (name, nameZh, nameZhHans, nameJa, nameKo), and gallery
// photos (the `photos` repeater on a tour) use it on `caption`.
// The tour mapper reads the full CMS tour form: subtitle, badge, mapUrl, the `facts` rows (icon + text),
// included / notIncluded / bring lists, importantInfo, the cancellation fields, the `ratings` rows
// (source, rating, count, url), `relatedTours` slugs and the hiking pack (difficulty, distanceKm,
// climbM, trailArea, fitness, gear, amenities, safety).
// Form labels (lib/cms.ts, FormLabel) are objects: { en, zh, zhHans, ja, ko } with the same fallbacks.
//
// The Plyndi CMS, e.g. https://wanderasia-cms.<account>.workers.dev
// Until CMS_API_URL is set, or whenever the CMS can't be reached, the built-in content in lib/tours.ts is shown.
// Read on each request: on Cloudflare, environment variables are only available while handling one.
const cmsApiUrl = () => process.env.CMS_API_URL?.replace(/\/+$/, '')

/**
 * On Cloudflare the site reaches the CMS through a service binding named CMS (see wrangler.jsonc): a direct,
 * private link between the two Workers that skips the public internet (a plain fetch() between two workers.dev
 * Workers can fail with Cloudflare error 1042). Elsewhere (next dev, Vercel) there is no binding and plain fetch() is used.
 */
async function cmsBinding(): Promise<{ fetch: typeof fetch } | undefined> {
  // Testing against a CMS running on this computer (CMS_API_URL=http://localhost:8787): talk to it directly,
  // because the binding in `next dev` points at the CMS Worker on Cloudflare, not the local one
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(cmsApiUrl() ?? '')) return undefined
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    return (getCloudflareContext().env as { CMS?: { fetch: typeof fetch } }).CMS
  } catch {
    return undefined
  }
}

type Raw = Record<string, any>

/** Traditional → Simplified Chinese, for CMS text that has no Simplified version yet */
export const toSimplified = OpenCC.Converter({ from: 'tw', to: 'cn' })

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined)
const list = (v: unknown) => (Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string') : [])
const paragraphs = (v: unknown) => (str(v) ? (v as string).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : [])

/** All five languages of a field: Traditional Chinese falls back to English, Simplified Chinese is
 * converted from the Traditional text when the CMS sends none, Japanese and Korean fall back to English */
function text(doc: Raw, key: string, fallback = ''): Text {
  const en = str(doc[key]) ?? fallback
  const zh = str(doc[`${key}Zh`])
  return {
    EN: en,
    ZH: zh ?? en,
    ZH_HANS: str(doc[`${key}ZhHans`]) ?? (zh ? toSimplified(zh) : en),
    JA: str(doc[`${key}Ja`]) ?? en,
    KO: str(doc[`${key}Ko`]) ?? en,
  }
}
function optionalText(doc: Raw, key: string): Text | undefined {
  return str(doc[key]) ? text(doc, key) : undefined
}
/** Lists fall back as a whole: an empty list in one language shows the English one (Simplified Chinese
 * is converted from the Traditional list when the CMS sends none) */
function textList(doc: Raw, key: string, split = list): TextList {
  const en = split(doc[key])
  const zh = split(doc[`${key}Zh`])
  const zhHans = split(doc[`${key}ZhHans`])
  const ja = split(doc[`${key}Ja`])
  const ko = split(doc[`${key}Ko`])
  return {
    EN: en,
    ZH: zh.length ? zh : en,
    ZH_HANS: zhHans.length ? zhHans : zh.length ? zh.map((item) => toSimplified(item)) : en,
    JA: ja.length ? ja : en,
    KO: ko.length ? ko : en,
  }
}

const isCategory = (c: unknown): c is TourCategory => CATEGORIES.some((cat) => cat.key === c)

/** The hiking details, when the CMS has any of them (hiking tours only) */
function toHiking(doc: Raw): TourHiking | undefined {
  const hiking: TourHiking = {
    difficulty: str(doc.difficulty),
    distanceKm: typeof doc.distanceKm === 'number' ? doc.distanceKm : undefined,
    climbM: typeof doc.climbM === 'number' ? doc.climbM : undefined,
    trailArea: optionalText(doc, 'trailArea'),
    fitness: optionalText(doc, 'fitness'),
    gear: textList(doc, 'gear'),
    amenities: textList(doc, 'amenities'),
    safety: optionalText(doc, 'safety'),
  }
  const hasAny =
    hiking.difficulty ||
    hiking.distanceKm != null ||
    hiking.climbM != null ||
    hiking.trailArea ||
    hiking.fitness ||
    hiking.safety ||
    hiking.gear.EN.length > 0 ||
    hiking.amenities.EN.length > 0
  return hasAny ? hiking : undefined
}

function toTour(doc: Raw): Tour {
  return {
    id: doc.id,
    slug: doc.slug,
    category: doc.category,
    title: text(doc, 'title', 'Untitled Tour'),
    subtitle: optionalText(doc, 'subtitle'),
    badge: optionalText(doc, 'badge'),
    location: text(doc, 'location', 'Taipei'),
    price: typeof doc.price === 'number' ? doc.price : null,
    duration: optionalText(doc, 'duration'),
    meetingPoint: optionalText(doc, 'meetingPoint'),
    startTime: optionalText(doc, 'startTime'),
    mapUrl: str(doc.mapUrl),
    image: str(doc.mainImage),
    photos: (Array.isArray(doc.photos) ? doc.photos : [])
      .map((p: Raw) => ({ image: str(p.image) ?? '', caption: text(p, 'caption') }))
      .filter((p) => p.image),
    videoUrl: str(doc.videoUrl),
    desc: text(doc, 'description'),
    body: textList(doc, 'body', paragraphs),
    highlights: textList(doc, 'highlights'),
    facts: (Array.isArray(doc.facts) ? doc.facts : [])
      .map((f: Raw): TourFact => ({ icon: str(f.icon), text: text(f, 'text') }))
      .filter((f) => f.text.EN),
    tastings: (Array.isArray(doc.tastings) ? doc.tastings : []).map((t: Raw) => {
      const zh = str(t.nameZh) ?? ''
      return {
        name: t.name ?? '',
        zh,
        zhHans: str(t.nameZhHans) ?? (zh ? toSimplified(zh) : ''),
        ja: str(t.nameJa) ?? '',
        ko: str(t.nameKo) ?? '',
        image: str(t.image),
      }
    }),
    note: optionalText(doc, 'note'),
    included: textList(doc, 'included'),
    notIncluded: textList(doc, 'notIncluded'),
    bring: textList(doc, 'bring'),
    importantInfo: optionalText(doc, 'importantInfo'),
    freeCancellation: Boolean(doc.freeCancellation),
    cancelHours: typeof doc.cancelHours === 'number' ? doc.cancelHours : undefined,
    cancellationPolicy: optionalText(doc, 'cancellationPolicy'),
    ratings: (Array.isArray(doc.ratings) ? doc.ratings : [])
      .map(
        (r: Raw): TourRating => ({
          source: str(r.source) ?? '',
          rating: typeof r.rating === 'number' ? r.rating : undefined,
          count: typeof r.count === 'number' ? r.count : undefined,
          url: str(r.url),
        }),
      )
      .filter((r) => r.source),
    relatedTours: list(doc.relatedTours),
    hiking: toHiking(doc),
    comingSoon: Boolean(doc.comingSoon),
    seoTitle: str(doc.seoTitle),
    seoDescription: str(doc.seoDescription),
  }
}

function toService(doc: Raw): Service {
  return {
    id: doc.id,
    slug: doc.slug,
    kind: doc.kind,
    title: text(doc, 'title', 'Untitled'),
    summary: text(doc, 'summary'),
    body: textList(doc, 'body', paragraphs),
    included: textList(doc, 'included'),
    capacity: optionalText(doc, 'capacity'),
    duration: optionalText(doc, 'duration'),
    priceOptions: (Array.isArray(doc.priceOptions) ? doc.priceOptions : []).map(
      (o: Raw): PriceOption => ({ label: text(o, 'label'), price: typeof o.price === 'number' ? o.price : null, unit: o.unit ?? '' }),
    ),
    image: str(doc.mainImage),
    whatsappText: str(doc.whatsappText) ?? `Hi Wander Asia! I'd like to ask about ${str(doc.title) ?? 'your services'}.`,
    featured: Boolean(doc.featured),
    seoTitle: str(doc.seoTitle),
    seoDescription: str(doc.seoDescription),
  }
}

function toCategory(doc: Raw): Category {
  return { key: doc.slug, title: text(doc, 'title'), blurb: text(doc, 'blurb'), comingSoon: Boolean(doc.comingSoon) }
}

/** The JSON at `path`, or null when it is missing, the CMS isn't set up, or it can't be reached */
async function cmsFetch<T>(path: string): Promise<T | null> {
  const base = cmsApiUrl()
  if (!base) return null
  try {
    const url = `${base}${path}`
    const binding = await cmsBinding()
    const res = binding ? await binding.fetch(url) : await fetch(url, { next: { revalidate: 60 } })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    return (await res.json()) as T
  } catch (err) {
    console.error('[cms] fetch failed, using built-in content:', err)
    return null
  }
}

/** CMS tours that fit the website's categories, or the launch tours when there are none */
function toTours(docs: Raw[] | undefined): Tour[] {
  const tours = (docs ?? []).filter((d) => isCategory(d.category)).map(toTour)
  return tours.length > 0 ? tours : TOURS
}

export async function getFeaturedTours(): Promise<Tour[]> {
  return toTours((await cmsFetch<{ tours: Raw[] }>('/api/v1/tours?featured=1'))?.tours)
}

export async function getAllTours(): Promise<Tour[]> {
  return toTours((await cmsFetch<{ tours: Raw[] }>('/api/v1/tours'))?.tours)
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  if (cmsApiUrl()) {
    const doc = (await cmsFetch<{ tour: Raw }>(`/api/v1/tours/${encodeURIComponent(slug)}`))?.tour
    if (doc && isCategory(doc.category)) return toTour(doc)
  }
  return TOURS.find((t) => t.slug === slug) ?? null
}

/** Rows for the tours section, in the order set in the CMS */
export async function getCategories(): Promise<Category[]> {
  const docs = (await cmsFetch<{ categories: Raw[] }>('/api/v1/categories'))?.categories
  const categories = (docs ?? []).filter((d) => isCategory(d.slug)).map(toCategory)
  return categories.length > 0 ? categories : CATEGORIES
}

/** Published services, or the built-in private tours service when there are none */
export async function getServices(): Promise<Service[]> {
  const docs = (await cmsFetch<{ services: Raw[] }>('/api/v1/services'))?.services
  const services = (docs ?? []).map(toService)
  return services.length > 0 ? services : SERVICES
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (cmsApiUrl()) {
    const doc = (await cmsFetch<{ service: Raw }>(`/api/v1/services/${encodeURIComponent(slug)}`))?.service
    if (doc) return toService(doc)
  }
  return SERVICES.find((s) => s.slug === slug) ?? null
}

// ---------------------------------------------------------------------------
// Forms (e.g. the inquiry form). The CMS defines the fields; the website draws them and passes submissions on.

export interface FormLabel {
  en: string
  zh?: string
  /** Simplified Chinese; filled in from `zh` by conversion in getForm() when the CMS doesn't send it */
  zhHans?: string
  ja?: string
  ko?: string
}

/** A form label with its Simplified Chinese filled in from the Traditional text when missing */
function fillLabel(l: FormLabel | null | undefined): FormLabel | null {
  if (!l) return null
  return !l.zhHans && l.zh ? { ...l, zhHans: toSimplified(l.zh) } : l
}

/** The same form with every label's Simplified Chinese filled in (title, fields, options, messages) */
function fillFormLabels(form: PublicForm): PublicForm {
  return {
    ...form,
    title: fillLabel(form.title) ?? form.title,
    intro: fillLabel(form.intro),
    thanks: fillLabel(form.thanks) ?? form.thanks,
    privacy: fillLabel(form.privacy),
    fields: form.fields.map((f) => ({
      ...f,
      label: fillLabel(f.label) ?? f.label,
      hint: fillLabel(f.hint) ?? undefined,
      options: f.options?.map((o) => ({ ...o, label: fillLabel(o.label) ?? o.label })),
    })),
    oneOf: form.oneOf.map((g) => ({ ...g, message: fillLabel(g.message) ?? g.message })),
  }
}

export interface FormField {
  name: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'date' | 'number' | 'choice'
  label: FormLabel
  hint?: FormLabel
  required?: boolean
  max?: number
  min?: number
  options?: { value: string; label: FormLabel; group?: string }[]
}

export interface PublicForm {
  id: string
  title: FormLabel
  intro: FormLabel | null
  thanks: FormLabel
  privacy: FormLabel | null
  fields: FormField[]
  oneOf: { fields: string[]; message: FormLabel }[]
}

/** A form's definition from the CMS, or null when there is no CMS or it can't be reached */
export async function getForm(id: string): Promise<PublicForm | null> {
  const form = (await cmsFetch<{ form: PublicForm }>(`/api/v1/forms/${encodeURIComponent(id)}`))?.form ?? null
  return form ? fillFormLabels(form) : null
}

/**
 * Passes a filled-in form to the CMS and returns its answer as-is. The visitor's IP goes along so the CMS can
 * apply its hourly limit per visitor; only this site can set it, because it talks to the CMS over the binding.
 */
export async function sendForm(id: string, body: string, visitorIp: string | null): Promise<Response> {
  const base = cmsApiUrl()
  if (!base) return Response.json({ error: 'Forms are not available' }, { status: 503 })
  const url = `${base}/api/v1/forms/${encodeURIComponent(id)}`
  const init: RequestInit = {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(visitorIp ? { 'cf-connecting-ip': visitorIp } : {}) },
    body,
  }
  try {
    const binding = await cmsBinding()
    const res = binding ? await binding.fetch(url, init) : await fetch(url, init)
    return new Response(await res.text(), { status: res.status, headers: { 'content-type': 'application/json' } })
  } catch (err) {
    console.error('[cms] sending form failed:', err)
    return Response.json({ error: 'Forms are not available' }, { status: 503 })
  }
}

// ---------------------------------------------------------------------------
// Bookings. lib/booking.ts uses this to reach the CMS booking API.

/**
 * Sends a request to the CMS and returns its answer, or null when there is no CMS or it can't be reached.
 * Like sendForm(), it goes over the CMS service binding on Cloudflare and plain fetch() elsewhere.
 */
export async function cmsRequest(path: string, init?: RequestInit): Promise<Response | null> {
  const base = cmsApiUrl()
  if (!base) return null
  try {
    const url = `${base}${path}`
    const binding = await cmsBinding()
    return binding ? await binding.fetch(url, init) : await fetch(url, { cache: 'no-store', ...init })
  } catch (err) {
    console.error('[cms] request failed:', path, err)
    return null
  }
}
