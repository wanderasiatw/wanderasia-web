import type { Lang } from '@/components/SiteProvider'

/** Text in both site languages. Chinese falls back to English when it hasn't been translated. */
export type Text = Record<Lang, string>
export type TextList = Record<Lang, string[]>

/** English-only text, shown in both languages */
export const en = (s: string): Text => ({ EN: s, ZH: s })
const enList = (items: string[]): TextList => ({ EN: items, ZH: items })

export type TourCategory = 'free' | 'food' | 'night' | 'hiking' | 'special'

export interface Category {
  key: TourCategory
  title: Text
  blurb: Text
  /** Shown as a "coming soon" card until real tours are added */
  comingSoon?: boolean
}

export interface Tasting {
  name: string
  zh: string
  /** A styled tile is shown until a photo is added */
  image?: string
}

export interface Tour {
  id: string
  slug: string
  category: TourCategory
  title: Text
  location: Text
  /** 0 = free, null = price on request */
  price: number | null
  duration?: Text
  meetingPoint?: Text
  startTime?: Text
  /** Cover photo; the category cover is shown when missing */
  image?: string
  /** One-line summary for cards */
  desc: Text
  /** Full description paragraphs for the tour page */
  body: TextList
  highlights: TextList
  tastings: Tasting[]
  note?: Text
  /** Listed, but details are not published yet */
  comingSoon?: boolean
  seoTitle?: string
  seoDescription?: string
}

export interface PriceOption {
  label: Text
  /** null = on request */
  price: number | null
  /** person, group, vehicle, hour, day or trip */
  unit: string
}

export interface Service {
  id: string
  slug: string
  /** private-tour, transfer, car or planning */
  kind: string
  title: Text
  summary: Text
  body: TextList
  included: TextList
  capacity?: Text
  duration?: Text
  priceOptions: PriceOption[]
  image?: string
  /** Pre-filled WhatsApp message for enquiries */
  whatsappText: string
  featured: boolean
  seoTitle?: string
  seoDescription?: string
}

export const CURRENCY = 'USD'

export function formatPrice(n: number) {
  return `$${n.toLocaleString('en-US')}`
}

/** Lowest price among a service's options, or null when all are on request */
export function fromPrice(service: Service): number | null {
  const prices = service.priceOptions.map((o) => o.price).filter((p): p is number => typeof p === 'number')
  return prices.length ? Math.min(...prices) : null
}

export function categoryOf(categories: Category[], key: string) {
  return categories.find((c) => c.key === key)
}

// ---------------------------------------------------------------------------
// Built-in content, used until the CMS is connected or when it can't be reached

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

export const PRIVATE_TOUR_SERVICE: Service = {
  id: 'private-tours',
  slug: 'private-tours',
  kind: 'private-tour',
  title: { EN: 'Private Tours', ZH: '私人包團' },
  summary: { EN: 'Your own guide, your own pace. Any tour, just your group.', ZH: '專屬導遊，自訂步調，任何行程皆可包團。' },
  body: enList([]),
  included: enList([]),
  priceOptions: [],
  whatsappText: "Hi Wander Asia! I'd like to ask about a private tour.",
  featured: true,
}

export const SERVICES: Service[] = [PRIVATE_TOUR_SERVICE]

/** The private tours service: the first one of that kind, or the built-in one */
export function privateTourService(services: Service[]): Service {
  return services.find((s) => s.kind === 'private-tour') ?? PRIVATE_TOUR_SERVICE
}

// The tours we are launching with. CMS tours replace these once any are published there.
export const TOURS: Tour[] = [
  {
    id: 'free-1',
    slug: 'free-tour-1',
    category: 'free',
    title: en('Free Tour 1'),
    location: { EN: 'Taipei', ZH: '台北' },
    price: 0,
    desc: en('Route and meeting point coming soon. Message us to be first to join.'),
    body: enList([]),
    highlights: enList([]),
    tastings: [],
    comingSoon: true,
  },
  {
    id: 'free-2',
    slug: 'free-tour-2',
    category: 'free',
    title: en('Free Tour 2'),
    location: { EN: 'Taipei', ZH: '台北' },
    price: 0,
    desc: en('Route and meeting point coming soon. Message us to be first to join.'),
    body: enList([]),
    highlights: enList([]),
    tastings: [],
    comingSoon: true,
  },
  {
    id: 'food-dongmen',
    slug: 'dongmen-street-food-tour',
    category: 'food',
    title: en('Dongmen Street Food Tour'),
    location: { EN: 'Taipei', ZH: '台北' },
    price: null,
    duration: en('About 2.5 hours'),
    meetingPoint: en('Dongmen MRT Station, Exit 3'),
    startTime: en('7:00 PM'),
    desc: en('Five must-try local finger foods in one of Taipei’s busiest street-vendor districts. Come hungry!'),
    body: enList([
      'We meet at Dongmen Station Exit 3 at 7pm, so come hungry! Together we’ll explore one of the busiest street-vendor districts in Taipei, right next to the city’s biggest park.',
      'Along the way we’ll try some of the most popular finger foods enjoyed by locals and learn where each one comes from. Every guest gets their own portion of every tasting.',
      'So come hungry and enjoy the journey with us as we indulge in this mouth-watering feast! The tour lasts about 2.5 hours.',
    ]),
    highlights: enList([
      'Five must-try finger foods from local vendors',
      'Your own portion of every tasting',
      'The story and origin behind each dish',
      'One of Taipei’s busiest street-vendor districts, next to its biggest park',
    ]),
    tastings: [
      { name: 'Xiao long bao', zh: '小籠包' },
      { name: 'Bubble milk tea', zh: '珍珠奶茶' },
      { name: 'Scallion pancake', zh: '蔥油餅' },
      { name: 'Mung bean cake', zh: '綠豆糕' },
      { name: 'Sweet potato balls', zh: '地瓜球' },
    ],
    note: en('Tips are welcome. Give whatever you feel we’ve earned.'),
  },
  {
    id: 'night-1',
    slug: 'night-drink-tour',
    category: 'night',
    title: en('Taipei Night & Drink Tour'),
    location: { EN: 'Taipei', ZH: '台北' },
    price: null,
    desc: en('Details coming soon. Message us to be first to join.'),
    body: enList([]),
    highlights: enList([]),
    tastings: [],
    comingSoon: true,
  },
]
