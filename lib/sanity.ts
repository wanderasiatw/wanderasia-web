import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ifzr2wb3',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Sanity Data Fetching Functions
export async function getFeaturedTours() {
  const query = `*[_type == "tourPackage" && featured == true]{
    _id,
    title,
    "slug": slug.current,
    price,
    duration,
    location,
    mainImage,
    featured
  }`
  return await client.fetch(query)
}

export async function getAllTours() {
  const query = `*[_type == "tourPackage"]{
    _id,
    title,
    "slug": slug.current,
    price,
    duration,
    location,
    mainImage,
    featured
  }`
  return await client.fetch(query)
}

export async function getTourBySlug(slug: string) {
  const query = `*[_type == "tourPackage" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    price,
    duration,
    location,
    mainImage,
    description,
    itinerary
  }`
  return await client.fetch(query, { slug })
}
