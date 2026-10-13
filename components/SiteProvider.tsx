'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type Lang = 'EN' | 'ZH'

const DICT = {
  EN: {
    announcement: '🥟 New: Dongmen Street Food Tour in Taipei, now taking bookings!',
    navDest: 'Destinations',
    navTours: 'Tours',
    navAbout: 'About Us',
    navReviews: 'Reviews',
    navContact: 'Contact',
    heroTag: 'Licensed Agency • TA-2024-889',
    heroTitle: 'EXPLORE ASIA WITH WANDER ASIA',
    heroSub: 'Discover Handpicked Tours Across Japan, Korea, Taiwan & Beyond with Premium Local Experiences',
    lblType: 'Tour Type',
    lblDate: 'Travel Date',
    lblGuests: 'Guests',
    anyTour: 'Not sure yet',
    checkAvail: 'Check Availability',
    toursSub: 'Led by Local Guides',
    toursTitle: 'OUR TOURS IN TAIWAN',
    viewTour: 'View Tour',
    comingSoon: 'Coming soon',
    soonBlurb: 'More tours on the way. Ask us and we’ll let you know when they launch.',
    detailsSoon: 'Details coming soon',
    askWhatsApp: 'Ask on WhatsApp',
    free: 'Free',
    tipsWelcome: 'Tips welcome',
    priceOnRequest: 'Price on request',
    destSub: 'Explore Regions',
    destTitle: 'POPULAR DESTINATIONS',
    whySub: 'Guaranteed Quality',
    whyTitle: 'WHY CHOOSE WANDER ASIA?',
    revSub: 'Verified Feedback',
    revTitle: 'WHAT OUR TRAVELERS SAY',
  },
  ZH: {
    announcement: '🥟 全新台北東門美食導覽，現正開放預約！',
    navDest: '熱門目的地',
    navTours: '旅遊行程',
    navAbout: '關於我們',
    navReviews: '旅客評價',
    navContact: '聯絡我們',
    heroTag: '合法立案旅行社 • TA-2024-889',
    heroTitle: '與 WANDER ASIA 一同探索亞洲',
    heroSub: '精選日本、韓國、台灣及東南亞頂級旅遊行程與在地體驗',
    lblType: '行程類型',
    lblDate: '出發日期',
    lblGuests: '人數',
    anyTour: '還沒決定',
    checkAvail: '查詢名額',
    toursSub: '在地導遊帶路',
    toursTitle: '台灣在地行程',
    viewTour: '查看行程',
    comingSoon: '即將推出',
    soonBlurb: '更多行程即將推出，歡迎詢問，開放時第一時間通知你。',
    detailsSoon: '詳情即將公布',
    askWhatsApp: 'WhatsApp 詢問',
    free: '免費',
    tipsWelcome: '小費隨喜',
    priceOnRequest: '價格請洽詢',
    destSub: '探索地區',
    destTitle: '熱門旅遊目的地',
    whySub: '品質保證',
    whyTitle: '為什麼選擇 WANDER ASIA？',
    revSub: '真實評價',
    revTitle: '旅客怎麼說',
  },
} as const

export type DictKey = keyof (typeof DICT)['EN']

interface SiteState {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: DictKey) => string
  qrOpen: boolean
  toggleQr: () => void
}

const SiteContext = createContext<SiteState | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('EN')
  const [qrOpen, setQrOpen] = useState(false)

  const t = useCallback((key: DictKey) => DICT[lang][key], [lang])
  const toggleQr = useCallback(() => setQrOpen((o) => !o), [])

  return (
    <SiteContext.Provider value={{ lang, setLang, t, qrOpen, toggleQr }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>')
  return ctx
}

/** Jump to the tours section (or one category row of it), on any page */
export function scrollToTours(id = 'tours') {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  else window.location.href = `/#${id}`
}
