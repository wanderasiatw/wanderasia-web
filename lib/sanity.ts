import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { CATEGORIES, TOURS, type Tour, type TourCategory } from './tours'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ifzr2wb3',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Fields every query returns
const TOUR_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  category,
  location,
  price,
  duration,
  meetingPoint,
  startTime,
  description,
  body,
  highlights,
  tastings[]{ name, nameZh, image },
  note,
  comingSoon,
  mainImage
`

const isCategory = (c: unknown): c is TourCategory => CATEGORIES.some((cat) => cat.key === c)

function normalize(doc: any): Tour {
  return {
    id: doc._id,
    slug: doc.slug || doc._id,
    category: doc.category,
    title: doc.title || 'Untitled Tour',
    location: doc.location || 'Taipei',
    price: typeof doc.price === 'number' ? doc.price : null,
    duration: doc.duration,
    meetingPoint: doc.meetingPoint,
    startTime: doc.startTime,
    image: doc.mainImage ? urlFor(doc.mainImage).width(800).height(500).fit('crop').url() : undefined,
    desc: doc.description || '',
    body: typeof doc.body === 'string' ? doc.body.split(/\n\s*\n/).filter(Boolean) : [],
    highlights: Array.isArray(doc.highlights) ? doc.highlights : [],
    tastings: Array.isArray(doc.tastings)
      ? doc.tastings.map((t: any) => ({
          name: t.name || '',
          zh: t.nameZh || '',
          image: t.image ? urlFor(t.image).width(500).height(500).fit('crop').url() : undefined,
        }))
      : [],
    note: doc.note,
    comingSoon: Boolean(doc.comingSoon),
  }
}

/** Sanity tours that fit the current categories, or our launch tours when there are none */
function toTours(docs: any[] | null): Tour[] {
  const tours = (docs || []).filter((d) => isCategory(d.category)).map(normalize)
  return tours.length > 0 ? tours : TOURS
}

async function safeFetch(query: string, params: Record<string, any> = {}) {
  try {
    return await client.fetch(query, params, { next: { revalidate: 60 } } as any)
  } catch (err) {
    console.error('[sanity] fetch failed, using fallback data:', err)
    return null
  }
}

export async function getFeaturedTours(): Promise<Tour[]> {
  return toTours(await safeFetch(`*[_type == "tourPackage" && featured == true]{${TOUR_FIELDS}}`))
}

export async function getAllTours(): Promise<Tour[]> {
  return toTours(await safeFetch(`*[_type == "tourPackage"] | order(_createdAt desc){${TOUR_FIELDS}}`))
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const doc = await safeFetch(`*[_type == "tourPackage" && slug.current == $slug][0]{${TOUR_FIELDS}}`, { slug })
  if (doc && isCategory(doc.category)) return normalize(doc)
  return TOURS.find((t) => t.slug === slug) ?? null
}
