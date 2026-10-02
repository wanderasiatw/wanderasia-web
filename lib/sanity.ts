import { createClient } from 'next-sanity'

export className Client {
  static instance = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'YOUR_PROJECT_ID',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-01-01',
    useCdn: false,
  })
}

export async function getFeaturedTours() {
  const query = `*[_type == "tourPackage"][0..5]{
    _id,
    title,
    "slug": slug.current,
    price,
    duration,
    "imageUrl": featuredImage.asset->url,
    overview
  }`
  return await Client.instance.fetch(query)
}
