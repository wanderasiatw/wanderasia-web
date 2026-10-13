'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Category, Service } from '@/lib/tours'

export type Lang = 'EN' | 'ZH'

const DICT = {
  EN: {
    announcement: '🥟 New: Dongmen Street Food Tour in Taipei, now taking bookings!',
    navTours: 'Tours',
    navAbout: 'About Us',
    navContact: 'Contact',
    heroTag: 'Licensed Agency • TA-2024-889',
    heroTitle: 'EXPLORE ASIA WITH WANDER ASIA',
    heroSub: 'Discover Handpicked Tours Across Taiwan with Premium Local Experiences',
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
    whySub: 'Guaranteed Quality',
    whyTitle: 'WHY CHOOSE WANDER ASIA?',
    navServices: 'Services',
    aboutTour: 'About this tour',
    tasteTitle: 'What you’ll taste',
    tasteBlurb: 'The must-try finger foods from local vendors. You get your own portion of each one.',
    highlights: 'Highlights',
    backToTours: '← Back to all tours',
    backHome: '← Back to home',
    pricePerPerson: 'Price per person',
    soonAskWhatsApp: 'Details coming soon. Ask on WhatsApp',
    seeDetails: 'See full tour details →',
    meet: 'Meet',
    starts: 'Starts',
    duration: 'Duration',
    capacity: 'Group size',
    yourName: 'Your Name',
    date: 'Date',
    guests: 'Guests',
    fewerGuests: 'Fewer guests',
    moreGuests: 'More guests',
    bookWhatsApp: 'Book on WhatsApp',
    bookSent: 'Press send in WhatsApp and we’ll confirm your spot shortly.',
    bookNote: 'We confirm every booking personally on WhatsApp.',
    servicesSub: 'More Ways to Travel',
    servicesTitle: 'OUR SERVICES',
    fromPrice: 'From {price}',
    enquire: 'Enquire on WhatsApp',
    learnMore: 'Learn more',
    included: 'What’s included',
    prices: 'Prices',
    close: 'Close',
    unit_person: 'per person',
    unit_group: 'per group',
    unit_vehicle: 'per vehicle',
    unit_hour: 'per hour',
    unit_day: 'per day',
    unit_trip: 'per trip',
  },
  ZH: {
    announcement: '🥟 全新台北東門美食導覽，現正開放預約！',
    navTours: '旅遊行程',
    navAbout: '關於我們',
    navContact: '聯絡我們',
    heroTag: '合法立案旅行社 • TA-2024-889',
    heroTitle: '與 WANDER ASIA 一同探索亞洲',
    heroSub: '精選台灣頂級旅遊行程與在地體驗',
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
    whySub: '品質保證',
    whyTitle: '為什麼選擇 WANDER ASIA？',
    navServices: '服務',
    aboutTour: '行程介紹',
    tasteTitle: '品嚐美食',
    tasteBlurb: '在地攤商的必吃小吃，每一樣都有你的專屬份量。',
    highlights: '行程亮點',
    backToTours: '← 返回所有行程',
    backHome: '← 返回首頁',
    pricePerPerson: '每人價格',
    soonAskWhatsApp: '詳情即將公布，WhatsApp 詢問',
    seeDetails: '查看完整行程 →',
    meet: '集合地點',
    starts: '出發時間',
    duration: '行程時間',
    capacity: '人數',
    yourName: '您的姓名',
    date: '日期',
    guests: '人數',
    fewerGuests: '減少人數',
    moreGuests: '增加人數',
    bookWhatsApp: '透過 WhatsApp 預約',
    bookSent: '請在 WhatsApp 按下傳送，我們會盡快為您確認名額。',
    bookNote: '每筆預約都由我們在 WhatsApp 親自確認。',
    servicesSub: '更多旅遊服務',
    servicesTitle: '我們的服務',
    fromPrice: '{price} 起',
    enquire: 'WhatsApp 詢問',
    learnMore: '了解更多',
    included: '服務內容',
    prices: '價格方案',
    close: '關閉',
    unit_person: '每人',
    unit_group: '每團',
    unit_vehicle: '每車',
    unit_hour: '每小時',
    unit_day: '每天',
    unit_trip: '每趟',
  },
} as const

export type DictKey = keyof (typeof DICT)['EN']

interface SiteState {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: DictKey) => string
  qrOpen: boolean
  toggleQr: () => void
  /** Tour category rows, from the CMS */
  categories: Category[]
  /** Published services, from the CMS */
  services: Service[]
}

const SiteContext = createContext<SiteState | null>(null)

export function SiteProvider({ children, categories, services }: { children: ReactNode; categories: Category[]; services: Service[] }) {
  const [lang, setLang] = useState<Lang>('EN')
  const [qrOpen, setQrOpen] = useState(false)

  const t = useCallback((key: DictKey) => DICT[lang][key] as string, [lang])
  const toggleQr = useCallback(() => setQrOpen((o) => !o), [])

  return (
    <SiteContext.Provider value={{ lang, setLang, t, qrOpen, toggleQr, categories, services }}>
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
