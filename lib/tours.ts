import type { Lang } from '@/lib/i18n'

/** Text in all five site languages. Built-in text is written in English and Traditional Chinese;
 * Simplified Chinese is converted from the Traditional, and Japanese and Korean fall back to English
 * unless a translation is written out below (as for the categories). CMS text follows the same
 * fallbacks — see lib/cms.ts. */
export type Text = Record<Lang, string>
export type TextList = Record<Lang, string[]>

/** English-only text, shown in every language */
export const en = (s: string): Text => ({ EN: s, ZH: s, ZH_HANS: s, JA: s, KO: s })
const enList = (items: string[]): TextList => ({ EN: items, ZH: items, ZH_HANS: items, JA: items, KO: items })

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
  /** Simplified Chinese name, converted from `zh` for CMS tastings when the CMS sends none */
  zhHans?: string
  ja?: string
  ko?: string
  /** A styled tile is shown until a photo is added */
  image?: string
}

/** One extra photo in a tour's gallery, with its caption in every language */
export interface TourPhoto {
  image: string
  caption: Text
}

/** One key fact from the CMS (icon name + text), e.g. group size or tour language */
export interface TourFact {
  icon?: string
  text: Text
}

/** One review-platform score from the CMS; only ever filled with real ratings */
export interface TourRating {
  source: string
  rating?: number
  count?: number
  url?: string
}

/** Extra details the CMS collects for hiking tours; present only when the tour has any of them */
export interface TourHiking {
  /** CMS difficulty value, e.g. easy, moderate or hard (turning it into labels is a display concern) */
  difficulty?: string
  distanceKm?: number
  climbM?: number
  trailArea?: Text
  fitness?: Text
  gear: TextList
  amenities: TextList
  safety?: Text
}

export interface Tour {
  id: string
  slug: string
  category: TourCategory
  title: Text
  /** One-line value proposition under the title */
  subtitle?: Text
  /** Short label shown on cards and near the price, e.g. Best seller */
  badge?: Text
  location: Text
  /** 0 = free, null = price on request */
  price: number | null
  duration?: Text
  meetingPoint?: Text
  /** Map link for the meeting point */
  mapUrl?: string
  startTime?: Text
  /** Cover photo; the category cover is shown when missing */
  image?: string
  /** Gallery photos for the tour page, shown after the cover photo */
  photos: TourPhoto[]
  /** A YouTube or Vimeo link, shown at the end of the gallery */
  videoUrl?: string
  /** One-line summary for cards */
  desc: Text
  /** Full description paragraphs for the tour page */
  body: TextList
  highlights: TextList
  /** Key facts from the CMS (group size, language, …) */
  facts: TourFact[]
  tastings: Tasting[]
  note?: Text
  included: TextList
  notIncluded: TextList
  bring: TextList
  /** "Good to know" notes from the CMS */
  importantInfo?: Text
  freeCancellation: boolean
  /** Free cancellation is possible until this many hours before the tour */
  cancelHours?: number
  cancellationPolicy?: Text
  /** Real review-platform scores from the CMS; empty until genuine ratings are entered */
  ratings: TourRating[]
  /** Slugs of other tours to suggest at the end of the page */
  relatedTours: string[]
  /** Hiking-only details; missing for other tours */
  hiking?: TourHiking
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

/** Tours ready to show (details published), and the categories of the ones whose details aren't out yet */
export function splitComingSoon(tours: Tour[]): { ready: Tour[]; upcoming: TourCategory[] } {
  const upcoming = tours.filter((t) => t.comingSoon).map((t) => t.category)
  return { ready: tours.filter((t) => !t.comingSoon), upcoming: Array.from(new Set(upcoming)) }
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
    title: { EN: 'Free Tours', ZH: '免費導覽', ZH_HANS: '免费导览', JA: '無料ツアー', KO: '무료 투어' },
    blurb: { EN: 'Free guided walks with a local. Tip whatever you feel we’ve earned.', ZH: '由在地導遊帶路的免費導覽，小費隨喜。', ZH_HANS: '由在地导游带路的免费导览，小费随喜。', JA: '地元ガイドと歩く無料ツアー。チップはお気持ちでどうぞ。', KO: '현지 가이드와 함께하는 무료 도보 투어. 팁은 마음만큼만 주세요.' },
  },
  {
    key: 'food',
    title: { EN: 'Food Tours', ZH: '美食導覽', ZH_HANS: '美食导览', JA: 'グルメツアー', KO: '음식 투어' },
    blurb: { EN: 'Taste Taipei’s must-try street food with a local guide.', ZH: '跟著在地導遊品嚐台北必吃街頭小吃。', ZH_HANS: '跟着在地导游品尝台北必吃街头小吃。', JA: '地元ガイドと一緒に台北の必食ストリートフードを味わいましょう。', KO: '현지 가이드와 함께 타이베이의 꼭 맛봐야 할 길거리 음식을 즐기세요.' },
  },
  {
    key: 'night',
    title: { EN: 'Night / Drink Tours', ZH: '夜遊・小酌導覽', ZH_HANS: '夜游・小酌导览', JA: 'ナイト／ドリンクツアー', KO: '야간/드링크 투어' },
    blurb: { EN: 'See Taipei after dark, from night spots to local drinks.', ZH: '夜晚的台北：夜生活景點與在地小酌。', ZH_HANS: '夜晚的台北：夜生活景点与在地小酌。', JA: '夜の台北を、夜景スポットから地元のお酒までご案内。', KO: '밤의 타이베이, 야경 명소부터 현지 술까지 만나보세요.' },
  },
  {
    key: 'hiking',
    title: { EN: 'Hiking Tours', ZH: '登山健行', ZH_HANS: '登山健行', JA: 'ハイキングツアー', KO: '하이킹 투어' },
    blurb: { EN: 'Trails and viewpoints around Taipei.', ZH: '台北近郊步道與絕美景點。', ZH_HANS: '台北近郊步道与绝美景点。', JA: '台北近郊のトレイルと絶景スポット。', KO: '타이베이 근교의 트레일과 전망 명소.' },
    comingSoon: true,
  },
  {
    key: 'special',
    title: { EN: 'Special Request Tours', ZH: '客製特別行程', ZH_HANS: '客制特别行程', JA: '特別リクエストツアー', KO: '특별 요청 투어' },
    blurb: { EN: 'Have something special in mind? Tell us and we’ll plan it with you.', ZH: '有特別的想法嗎？告訴我們，一起規劃專屬行程。', ZH_HANS: '有特别的想法吗？告诉我们，一起规划专属行程。', JA: '特別なご希望があればお聞かせください。一緒にプランを作ります。', KO: '특별한 계획이 있으시면 알려 주세요. 함께 일정을 만들어 드립니다.' },
    comingSoon: true,
  },
]

export const PRIVATE_TOUR_SERVICE: Service = {
  id: 'private-tours',
  slug: 'private-tours',
  kind: 'private-tour',
  title: { EN: 'Private Tours', ZH: '私人包團', ZH_HANS: '私人包团', JA: 'プライベートツアー', KO: '프라이빗 투어' },
  summary: { EN: 'Your own guide, your own pace. Any tour, just your group.', ZH: '專屬導遊，自訂步調，任何行程皆可包團。', ZH_HANS: '专属导游，自订步调，任何行程皆可包团。', JA: '専属ガイドで自分のペースで。どのツアーも貸切できます。', KO: '전담 가이드와 우리만의 속도. 어떤 투어든 우리 그룹만으로 즐길 수 있습니다.' },
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
    location: { EN: 'Taipei', ZH: '台北', ZH_HANS: '台北', JA: '台北', KO: '타이베이' },
    price: 0,
    desc: en('Route and meeting point coming soon. Message us to be first to join.'),
    body: enList([]),
    highlights: enList([]),
    photos: [],
    tastings: [],
    facts: [],
    included: enList([]),
    notIncluded: enList([]),
    bring: enList([]),
    freeCancellation: false,
    ratings: [],
    relatedTours: [],
    comingSoon: true,
  },
  {
    id: 'free-2',
    slug: 'free-tour-2',
    category: 'free',
    title: en('Free Tour 2'),
    location: { EN: 'Taipei', ZH: '台北', ZH_HANS: '台北', JA: '台北', KO: '타이베이' },
    price: 0,
    desc: en('Route and meeting point coming soon. Message us to be first to join.'),
    body: enList([]),
    highlights: enList([]),
    photos: [],
    tastings: [],
    facts: [],
    included: enList([]),
    notIncluded: enList([]),
    bring: enList([]),
    freeCancellation: false,
    ratings: [],
    relatedTours: [],
    comingSoon: true,
  },
  {
    id: 'food-dongmen',
    slug: 'dongmen-street-food-tour',
    category: 'food',
    title: en('Dongmen Street Food Tour'),
    location: { EN: 'Taipei', ZH: '台北', ZH_HANS: '台北', JA: '台北', KO: '타이베이' },
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
    photos: [],
    facts: [],
    included: enList([]),
    notIncluded: enList([]),
    bring: enList([]),
    freeCancellation: false,
    ratings: [],
    relatedTours: [],
    note: en('Tips are welcome. Give whatever you feel we’ve earned.'),
  },
  {
    id: 'night-1',
    slug: 'night-drink-tour',
    category: 'night',
    title: en('Taipei Night & Drink Tour'),
    location: { EN: 'Taipei', ZH: '台北', ZH_HANS: '台北', JA: '台北', KO: '타이베이' },
    price: null,
    desc: en('Details coming soon. Message us to be first to join.'),
    body: enList([]),
    highlights: enList([]),
    photos: [],
    tastings: [],
    facts: [],
    included: enList([]),
    notIncluded: enList([]),
    bring: enList([]),
    freeCancellation: false,
    ratings: [],
    relatedTours: [],
    comingSoon: true,
  },
]
