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
} from './tours'

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
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    return (getCloudflareContext().env as { CMS?: { fetch: typeof fetch } }).CMS
  } catch {
    return undefined
  }
}

type Raw = Record<string, any>

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined)
const list = (v: unknown) => (Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string') : [])
const paragraphs = (v: unknown) => (str(v) ? (v as string).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : [])

/** English and Chinese versions of a field; the Chinese falls back to the English */
function text(doc: Raw, key: string, fallback = ''): Text {
  const en = str(doc[key]) ?? fallback
  return { EN: en, ZH: str(doc[`${key}Zh`]) ?? en }
}
function optionalText(doc: Raw, key: string): Text | undefined {
  return str(doc[key]) ? text(doc, key) : undefined
}
/** Lists fall back as a whole: an empty Chinese list shows the English one */
function textList(doc: Raw, key: string, split = list): TextList {
  const en = split(doc[key])
  const zh = split(doc[`${key}Zh`])
  return { EN: en, ZH: zh.length ? zh : en }
}

const isCategory = (c: unknown): c is TourCategory => CATEGORIES.some((cat) => cat.key === c)

function toTour(doc: Raw): Tour {
  return {
    id: doc.id,
    slug: doc.slug,
    category: doc.category,
    title: text(doc, 'title', 'Untitled Tour'),
    location: text(doc, 'location', 'Taipei'),
    price: typeof doc.price === 'number' ? doc.price : null,
    duration: optionalText(doc, 'duration'),
    meetingPoint: optionalText(doc, 'meetingPoint'),
    startTime: optionalText(doc, 'startTime'),
    image: str(doc.mainImage),
    desc: text(doc, 'description'),
    body: textList(doc, 'body', paragraphs),
    highlights: textList(doc, 'highlights'),
    tastings: (Array.isArray(doc.tastings) ? doc.tastings : []).map((t: Raw) => ({ name: t.name ?? '', zh: t.nameZh ?? '', image: str(t.image) })),
    note: optionalText(doc, 'note'),
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
