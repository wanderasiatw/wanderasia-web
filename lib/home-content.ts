import type { Text } from '@/lib/tours'

/** Home page copy in both languages (kept here so the home page reads as one piece) */
export const HERO = {
  tag: { EN: 'Local guides in Taipei', ZH: '台北在地導遊帶路' } as Text,
  title: { EN: 'Taipei, the way locals live it', ZH: '用在地人的方式，認識台北' } as Text,
  sub: {
    EN: 'Food, culture and city walks led by people who call Taipei home. Pick a date and book in one WhatsApp message.',
    ZH: '由住在台北的在地導遊帶你吃美食、看文化、走街區。選好日期，一則 WhatsApp 訊息就能預約。',
  } as Text,
  /** Credit required by the photo's CC BY 3.0 license */
  photo: {
    place: { EN: 'Jiufen, New Taipei', ZH: '新北・九份' } as Text,
    author: 'Jordy Meow',
    source: 'https://commons.wikimedia.org/wiki/File:Jiufen.jpg',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
}

export const HOW_IT_WORKS = {
  sub: { EN: 'Simple from start to finish', ZH: '從預約到出發都很簡單' } as Text,
  title: { EN: 'How it works', ZH: '如何預約' } as Text,
  steps: [
    {
      title: { EN: 'Choose your tour', ZH: '選擇行程' },
      text: {
        EN: 'Browse our tours, or tell us what you would like to see and we will suggest one.',
        ZH: '瀏覽我們的行程，或告訴我們你想去哪裡，我們幫你推薦。',
      },
    },
    {
      title: { EN: 'Message us on WhatsApp', ZH: '用 WhatsApp 聯絡我們' },
      text: {
        EN: 'Send your date and group size. We reply with availability and the price for your group.',
        ZH: '告訴我們日期和人數，我們會回覆可預約時段與團體價格。',
      },
    },
    {
      title: { EN: 'Meet your local guide', ZH: '與在地導遊會合' },
      text: {
        EN: 'Your guide meets you at the starting point, ready to show you their Taipei.',
        ZH: '導遊會在集合地點等你，帶你認識他們眼中的台北。',
      },
    },
  ] as { title: Text; text: Text }[],
}

export const WHY_FEATURES: { icon: 'pin' | 'dollar' | 'pen' | 'chat'; title: Text; text: Text }[] = [
  {
    icon: 'pin',
    title: { EN: 'Local Taiwan Expertise', ZH: '在地台灣專業' },
    text: {
      EN: 'Headquartered in Taipei with guides who know hidden gems, night markets, and authentic culture.',
      ZH: '總部位於台北，導遊熟悉私房景點、夜市與道地文化。',
    },
  },
  {
    icon: 'dollar',
    title: { EN: 'Transparent Pricing', ZH: '價格透明' },
    text: {
      EN: '100% upfront pricing with zero mandatory shopping stops or unexpected extra fees.',
      ZH: '價格事先說清楚，沒有強迫購物站，也沒有額外隱藏費用。',
    },
  },
  {
    icon: 'pen',
    title: { EN: 'Tailor-Made Trips', ZH: '量身打造' },
    text: {
      EN: 'Custom itineraries for families, couples, and corporate groups with full flexibility.',
      ZH: '為家庭、情侶與企業團體安排客製行程，彈性十足。',
    },
  },
  {
    icon: 'chat',
    title: { EN: '24/7 Dedicated Support', ZH: '24/7 專屬客服' },
    text: {
      EN: 'Real-time WhatsApp messaging support throughout your entire journey in Taiwan.',
      ZH: '旅途中隨時可透過 WhatsApp 即時聯繫我們。',
    },
  },
]
