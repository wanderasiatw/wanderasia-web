import * as sanity from './sanity'
import { CATEGORIES, TOURS, type Tour, type TourCategory } from './tours'

// The Plyndi CMS, e.g. https://plyndi-cms.<account>.workers.dev
// Until CMS_API_URL is set the site keeps reading Sanity; lib/sanity.ts goes once the CMS is live.
const CMS_API_URL = process.env.CMS_API_URL?.replace(/\/+$/, '')

/** A published tour as GET /api/v1/tours returns it. The …Zh fields are not shown on the site yet. */
interface CmsTour {
  id: string
  slug: string
  category: string
  title: string
  location: string | null
  price: number | null
  duration: string | null
  meetingPoint: string | null
  startTime: string | null
  mainImage: string | null
  description: string | null
  body: string | null
  highlights: string[]
  tastings: { name: string; nameZh: string | null; image: string | null }[]
  note: string | null
  comingSoon: boolean
}

const isCategory = (c: unknown): c is TourCategory => CATEGORIES.some((cat) => cat.key === c)

function normalize(doc: CmsTour): Tour {
  return {
    id: doc.id,
    slug: doc.slug,
    category: doc.category as TourCategory,
    title: doc.title || 'Untitled Tour',
    location: doc.location || 'Taipei',
    price: typeof doc.price === 'number' ? doc.price : null,
    duration: doc.duration ?? undefined,
    meetingPoint: doc.meetingPoint ?? undefined,
    startTime: doc.startTime ?? undefined,
    image: doc.mainImage ?? undefined,
    desc: doc.description || '',
    body: doc.body ? doc.body.split(/\n\s*\n/).filter(Boolean) : [],
    highlights: doc.highlights ?? [],
    tastings: (doc.tastings ?? []).map((t) => ({ name: t.name, zh: t.nameZh || '', image: t.image ?? undefined })),
    note: doc.note ?? undefined,
    comingSoon: doc.comingSoon,
  }
}

/** CMS tours that fit the current categories, or our launch tours when there are none */
function toTours(docs: CmsTour[] | undefined): Tour[] {
  const tours = (docs || []).filter((d) => isCategory(d.category)).map(normalize)
  return tours.length > 0 ? tours : TOURS
}

/** The JSON at `path`, or null when it is missing or the CMS can't be reached */
async function cmsFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_API_URL}${path}`, { next: { revalidate: 60 } })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    return (await res.json()) as T
  } catch (err) {
    console.error('[cms] fetch failed, using fallback data:', err)
    return null
  }
}

export async function getFeaturedTours(): Promise<Tour[]> {
  if (!CMS_API_URL) return sanity.getFeaturedTours()
  return toTours((await cmsFetch<{ tours: CmsTour[] }>('/api/v1/tours?featured=1'))?.tours)
}

export async function getAllTours(): Promise<Tour[]> {
  if (!CMS_API_URL) return sanity.getAllTours()
  return toTours((await cmsFetch<{ tours: CmsTour[] }>('/api/v1/tours'))?.tours)
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  if (!CMS_API_URL) return sanity.getTourBySlug(slug)
  const doc = (await cmsFetch<{ tour: CmsTour }>(`/api/v1/tours/${encodeURIComponent(slug)}`))?.tour
  if (doc && isCategory(doc.category)) return normalize(doc)
  return TOURS.find((t) => t.slug === slug) ?? null
}
