'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type Lang = 'EN' | 'ZH'

const DICT = {
  EN: {
    announcement: '🌸 Cherry Blossom Season Special Packages Now Open for Booking!',
    navDest: 'Destinations',
    navTours: 'Tours',
    navAbout: 'About Us',
    navReviews: 'Reviews',
    navContact: 'Contact',
    heroTag: 'Licensed Agency • TA-2024-889',
    heroTitle: 'EXPLORE ASIA WITH WANDER ASIA',
    heroSub: 'Discover Handpicked Tours Across Japan, Korea, Taiwan & Beyond with Premium Local Experiences',
    lblDest: 'Destination',
    lblDate: 'Travel Date',
    lblType: 'Tour Type',
    allDest: 'All Destinations',
    allTypes: 'All Tour Types',
    search: 'Search Tours',
    toursSub: 'Top Rated Itineraries',
    toursTitle: 'FEATURED TOUR PACKAGES',
    viewAll: 'View All',
    viewPackage: 'View Package',
    from: 'From',
    noTours: 'No tours match your search. Try another destination or tour type.',
    destSub: 'Explore Regions',
    destTitle: 'POPULAR DESTINATIONS',
    whySub: 'Guaranteed Quality',
    whyTitle: 'WHY CHOOSE WANDER ASIA?',
    revSub: 'Verified Feedback',
    revTitle: 'WHAT OUR TRAVELERS SAY',
  },
  ZH: {
    announcement: '🌸 櫻花季特別行程現已開放預訂！',
    navDest: '熱門目的地',
    navTours: '旅遊行程',
    navAbout: '關於我們',
    navReviews: '旅客評價',
    navContact: '聯絡我們',
    heroTag: '合法立案旅行社 • TA-2024-889',
    heroTitle: '與 WANDER ASIA 一同探索亞洲',
    heroSub: '精選日本、韓國、台灣及東南亞頂級旅遊行程與在地體驗',
    lblDest: '目的地',
    lblDate: '出發日期',
    lblType: '行程類型',
    allDest: '所有目的地',
    allTypes: '所有行程類型',
    search: '搜尋行程',
    toursSub: '高評價行程',
    toursTitle: '精選推薦行程',
    viewAll: '全部',
    viewPackage: '查看行程',
    from: '起',
    noTours: '找不到符合條件的行程，請嘗試其他目的地或類型。',
    destSub: '探索地區',
    destTitle: '熱門旅遊目的地',
    whySub: '品質保證',
    whyTitle: '為什麼選擇 WANDER ASIA？',
    revSub: '真實評價',
    revTitle: '旅客怎麼說',
  },
} as const

export type DictKey = keyof (typeof DICT)['EN']

interface Filter {
  dest: string // 'ALL' | Destination
  type: string // 'ALL' | TourType
}

interface SiteState {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: DictKey) => string
  filter: Filter
  setFilter: (f: Filter) => void
  qrOpen: boolean
  toggleQr: () => void
}

const SiteContext = createContext<SiteState | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('EN')
  const [filter, setFilter] = useState<Filter>({ dest: 'ALL', type: 'ALL' })
  const [qrOpen, setQrOpen] = useState(false)

  const t = useCallback((key: DictKey) => DICT[lang][key], [lang])
  const toggleQr = useCallback(() => setQrOpen((o) => !o), [])

  return (
    <SiteContext.Provider value={{ lang, setLang, t, filter, setFilter, qrOpen, toggleQr }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>')
  return ctx
}

/** Jump to the tours grid, on any page */
export function scrollToTours() {
  const el = document.getElementById('tours')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  else window.location.href = '/#tours'
}
