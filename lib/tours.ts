export type Destination = 'Japan' | 'Taiwan' | 'Korea' | 'Thailand'
export type TourType = 'Sakura' | 'Culture' | 'Winter'

export interface Tour {
  id: string
  slug: string
  title: string
  destination: string
  type: string
  price: number
  rating: string
  image: string
  desc: string
  highlights: string[]
  duration?: string
}

export const CURRENCY = 'USD'

export function formatPrice(n: number) {
  return `$${n.toLocaleString('en-US')}`
}

// Shown when Sanity has no published tours yet (or can't be reached),
// so the homepage never renders an empty "Featured Tour Packages" section.
export const FALLBACK_TOURS: Tour[] = [
  {
    id: 'fallback-1',
    slug: '5d4n-japan-sakura-experience',
    title: '5D4N Japan Sakura Experience',
    destination: 'Japan',
    type: 'Sakura',
    price: 1200,
    rating: '4.9',
    duration: '5 Days 4 Nights',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop',
    desc: 'Explore Tokyo sakura gardens, Mt. Fuji views, and Kyoto bullet train experiences.',
    highlights: [
      'Tokyo Sakura Viewing at Ueno Park',
      'Mt. Fuji Onsen Ryokan Stay',
      'Kyoto Bullet Train Ticket Included',
    ],
  },
  {
    id: 'fallback-2',
    slug: '4d3n-taiwan-best-highlights',
    title: '4D3N Taiwan Best Highlights',
    destination: 'Taiwan',
    type: 'Culture',
    price: 850,
    rating: '4.8',
    duration: '4 Days 3 Nights',
    image: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=600&auto=format&fit=crop',
    desc: 'Taipei 101, Jiufen Lantern Village, Sun Moon Lake boat cruise & night markets.',
    highlights: [
      'Taipei 101 Observatory Access',
      'Jiufen Old Street & Lantern Release',
      'Sun Moon Lake Private Cruise',
    ],
  },
  {
    id: 'fallback-3',
    slug: '6d5n-korea-winter-wonderland',
    title: '6D5N Korea Winter Wonderland',
    destination: 'Korea',
    type: 'Winter',
    price: 1100,
    rating: '4.9',
    duration: '6 Days 5 Nights',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=600&auto=format&fit=crop',
    desc: 'Skiing at Vivaldi Park, Nami Island snow tree trails, Hanbok dress up in Seoul.',
    highlights: [
      'Ski Resort Pass & Gear Included',
      'Nami Island Winter Scenery',
      'Seoul Palace Hanbok Experience',
    ],
  },
  {
    id: 'fallback-4',
    slug: '5d4n-thailand-paradise-escape',
    title: '5D4N Thailand Paradise Escape',
    destination: 'Thailand',
    type: 'Culture',
    price: 790,
    rating: '4.7',
    duration: '5 Days 4 Nights',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=600&auto=format&fit=crop',
    desc: 'Phuket island hopping, Bangkok Grand Palace, and luxury beachfront resort stay.',
    highlights: [
      'Phi Phi Islands Speedboat Tour',
      'Grand Palace & Floating Market',
      '5-Star Beachfront Hotel',
    ],
  },
]
