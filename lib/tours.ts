import type { Lang } from '@/components/SiteProvider'

type Text = Record<Lang, string>

export type TourCategory = 'free' | 'food' | 'night' | 'hiking' | 'special'

export interface Category {
  key: TourCategory
  title: Text
  blurb: Text
  /** Shown as a "coming soon" row until real tours are added */
  comingSoon?: boolean
}

// One row per category on the tours section, in this order
export const CATEGORIES: Category[] = [
  {
    key: 'free',
    title: { EN: 'Free Tours', ZH: '免費導覽' },
    blurb: { EN: 'Free guided walks with a local. Tip whatever you feel we’ve earned.', ZH: '由在地導遊帶路的免費導覽，小費隨喜。' },
  },
  {
    key: 'food',
    title: { EN: 'Food Tours', ZH: '美食導覽' },
    blurb: { EN: 'Taste Taipei’s must-try street food with a local guide.', ZH: '跟著在地導遊品嚐台北必吃街頭小吃。' },
  },
  {
    key: 'night',
    title: { EN: 'Night / Drink Tours', ZH: '夜遊・小酌導覽' },
    blurb: { EN: 'See Taipei after dark, from night spots to local drinks.', ZH: '夜晚的台北：夜生活景點與在地小酌。' },
  },
  {
    key: 'hiking',
    title: { EN: 'Hiking Tours', ZH: '登山健行' },
    blurb: { EN: 'Trails and viewpoints around Taipei.', ZH: '台北近郊步道與絕美景點。' },
    comingSoon: true,
  },
  {
    key: 'special',
    title: { EN: 'Special Request Tours', ZH: '客製特別行程' },
    blurb: { EN: 'Have something special in mind? Tell us and we’ll plan it with you.', ZH: '有特別的想法嗎？告訴我們，一起規劃專屬行程。' },
    comingSoon: true,
  },
]

export const PRIVATE_TOURS = {
  title: { EN: 'Private Tours', ZH: '私人包團' } as Text,
  blurb: { EN: 'Your own guide, your own pace. Any tour, just your group.', ZH: '專屬導遊，自訂步調，任何行程皆可包團。' } as Text,
  whatsappText: "Hi Wander Asia! I'd like to ask about a private tour.",
}

export interface Tasting {
  name: string
  zh: string
  /** Photo path, e.g. /tours/dongmen/xiao-long-bao.jpg. A styled tile is shown until one is added. */
  image?: string
}

export interface Tour {
  id: string
  slug: string
  category: TourCategory
  title: string
  location: string
  /** 0 = free, null = price on request */
  price: number | null
  duration?: string
  meetingPoint?: string
  startTime?: string
  /** Cover photo; the category cover is shown when missing */
  image?: string
  /** One-line summary for cards */
  desc: string
  /** Full description paragraphs for the tour page */
  body: string[]
  highlights: string[]
  tastings: Tasting[]
  note?: string
  /** Listed, but details are not published yet */
  comingSoon?: boolean
}

export const CURRENCY = 'USD'

export function formatPrice(n: number) {
  return `$${n.toLocaleString('en-US')}`
}

export function categoryOf(key: string) {
  return CATEGORIES.find((c) => c.key === key)
}

// The tours we are launching with. Sanity tours replace these once any are published there.
export const TOURS: Tour[] = [
  {
    id: 'free-1',
    slug: 'free-tour-1',
    category: 'free',
    title: 'Free Tour 1',
    location: 'Taipei',
    price: 0,
    desc: 'Route and meeting point coming soon. Message us to be first to join.',
    body: [],
    highlights: [],
    tastings: [],
    comingSoon: true,
  },
  {
    id: 'free-2',
    slug: 'free-tour-2',
    category: 'free',
    title: 'Free Tour 2',
    location: 'Taipei',
    price: 0,
    desc: 'Route and meeting point coming soon. Message us to be first to join.',
    body: [],
    highlights: [],
    tastings: [],
    comingSoon: true,
  },
  {
    id: 'food-dongmen',
    slug: 'dongmen-street-food-tour',
    category: 'food',
    title: 'Dongmen Street Food Tour',
    location: 'Taipei',
    price: null,
    duration: 'About 2.5 hours',
    meetingPoint: 'Dongmen MRT Station, Exit 3',
    startTime: '7:00 PM',
    desc: 'Five must-try local finger foods in one of Taipei’s busiest street-vendor districts. Come hungry!',
    body: [
      'We meet at Dongmen Station Exit 3 at 7pm, so come hungry! Together we’ll explore one of the busiest street-vendor districts in Taipei, right next to the city’s biggest park.',
      'Along the way we’ll try some of the most popular finger foods enjoyed by locals and learn where each one comes from. Every guest gets their own portion of every tasting.',
      'So come hungry and enjoy the journey with us as we indulge in this mouth-watering feast! The tour lasts about 2.5 hours.',
    ],
    highlights: [
      'Five must-try finger foods from local vendors',
      'Your own portion of every tasting',
      'The story and origin behind each dish',
      'One of Taipei’s busiest street-vendor districts, next to its biggest park',
    ],
    tastings: [
      { name: 'Xiao long bao', zh: '小籠包' },
      { name: 'Bubble milk tea', zh: '珍珠奶茶' },
      { name: 'Scallion pancake', zh: '蔥油餅' },
      { name: 'Mung bean cake', zh: '綠豆糕' },
      { name: 'Sweet potato balls', zh: '地瓜球' },
    ],
    note: 'Tips are welcome. Give whatever you feel we’ve earned.',
  },
  {
    id: 'night-1',
    slug: 'night-drink-tour',
    category: 'night',
    title: 'Taipei Night & Drink Tour',
    location: 'Taipei',
    price: null,
    desc: 'Details coming soon. Message us to be first to join.',
    body: [],
    highlights: [],
    tastings: [],
    comingSoon: true,
  },
]
