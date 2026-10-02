import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { FALLBACK_TOURS, type Tour } from './tours'

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

// Fields every query returns, already shaped like the `Tour` type
const TOUR_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  price,
  duration,
  location,
  tourType,
  rating,
  description,
  highlights,
  mainImage
`

function normalize(doc: any): Tour {
  // Accept "South Korea" / "korea" etc. and map to the filter keys used in the UI
  const loc = String(doc.location || '').toLowerCase()
  const destination = loc.includes('korea')
    ? 'Korea'
    : loc.includes('japan')
    ? 'Japan'
    : loc.includes('thai')
    ? 'Thailand'
    : loc.includes('taiwan')
    ? 'Taiwan'
    : doc.location || 'Asia'

  return {
    id: doc._id,
    slug: doc.slug || doc._id,
    title: doc.title || 'Untitled Tour',
    destination,
    type: doc.tourType || 'Culture',
    price: Number(doc.price) || 0,
    rating: doc.rating ? String(doc.rating) : '4.8',
    duration: doc.duration,
    image: doc.mainImage
      ? urlFor(doc.mainImage).width(800).height(500).fit('crop').url()
      : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
    desc: doc.description || '',
    highlights: Array.isArray(doc.highlights) ? doc.highlights : [],
  }
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
  const docs = await safeFetch(`*[_type == "tourPackage" && featured == true]{${TOUR_FIELDS}}`)
  if (!docs || docs.length === 0) return FALLBACK_TOURS
  return docs.map(normalize)
}

export async function getAllTours(): Promise<Tour[]> {
  const docs = await safeFetch(`*[_type == "tourPackage"] | order(_createdAt desc){${TOUR_FIELDS}}`)
  if (!docs || docs.length === 0) return FALLBACK_TOURS
  return docs.map(normalize)
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const doc = await safeFetch(`*[_type == "tourPackage" && slug.current == $slug][0]{${TOUR_FIELDS}}`, { slug })
  if (doc) return normalize(doc)
  return FALLBACK_TOURS.find((t) => t.slug === slug) ?? null
}
