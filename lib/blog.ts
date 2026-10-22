// Blog: stories from finished tours, guests' own stories (posted on request), and travel tips.
// Posts come from the Plyndi CMS. The CMS API the website expects (to be added in plyndi-cms):
//   GET /api/v1/posts         → 200 { posts: RawPost[] }   published posts, newest first
//   GET /api/v1/posts/:slug   → 200 { post: RawPost }      404 when missing or unpublished
// RawPost fields: slug, kind ('story' | 'guest' | 'tips'), title, titleZh, excerpt, excerptZh, body, bodyZh
// (paragraphs separated by a blank line), mainImage, gallery (image URLs), publishedAt (ISO date),
// plus optional titleZhHans / excerptZhHans / bodyZhHans (Simplified Chinese; converted from the
// Traditional text when missing) and titleJa / titleKo etc. (Japanese and Korean; English when missing),
// author, authorCountry, tourSlug (related tour), rating (1–5, guest stories), seoTitle, seoDescription.
//
// Until the CMS has posts, BLOG_DEMO=1 (in .env.local) shows sample posts so the pages can be shown on localhost.
// Without it, the blog shows a "stories coming soon" message instead of samples.

import { cmsRequest, toSimplified } from './cms'
import type { Text, TextList } from './tours'

import { POST_KINDS, type PostKind } from './blog-kinds'
export { POST_KINDS, type PostKind }

export interface Post {
  slug: string
  kind: PostKind
  title: Text
  excerpt: Text
  body: TextList
  image?: string
  gallery: string[]
  /** YYYY-MM-DD */
  date: string
  author: string
  authorCountry?: string
  tourSlug?: string
  /** Guest stories only, 1 to 5 */
  rating?: number
  seoTitle?: string
  seoDescription?: string
  /** Demo content, labelled as a sample on the page */
  sample?: boolean
}

export const isBlogDemo = () => process.env.BLOG_DEMO === '1'

type Raw = Record<string, any>
const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
const paragraphs = (v: unknown) => (str(v) ? (v as string).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : [])

function toPost(d: Raw): Post {
  const en = (k: string) => str(d[k]) ?? ''
  // All five languages, with the same fallbacks as lib/cms.ts: Simplified Chinese is converted from
  // the Traditional text when the CMS sends none; Japanese and Korean fall back to English
  const both = (k: string): Text => {
    const enVal = en(k)
    const zh = str(d[`${k}Zh`])
    return {
      EN: enVal,
      ZH: zh ?? enVal,
      ZH_HANS: str(d[`${k}ZhHans`]) ?? (zh ? toSimplified(zh) : enVal),
      JA: str(d[`${k}Ja`]) ?? enVal,
      KO: str(d[`${k}Ko`]) ?? enVal,
    }
  }
  const bodyEn = paragraphs(d.body)
  const bodyZh = paragraphs(d.bodyZh)
  const bodyZhHans = paragraphs(d.bodyZhHans)
  const bodyJa = paragraphs(d.bodyJa)
  const bodyKo = paragraphs(d.bodyKo)
  const rating = Number(d.rating)
  return {
    slug: d.slug,
    kind: POST_KINDS.includes(d.kind) ? d.kind : 'story',
    title: both('title'),
    excerpt: both('excerpt'),
    body: {
      EN: bodyEn,
      ZH: bodyZh.length ? bodyZh : bodyEn,
      ZH_HANS: bodyZhHans.length ? bodyZhHans : bodyZh.length ? bodyZh.map((para) => toSimplified(para)) : bodyEn,
      JA: bodyJa.length ? bodyJa : bodyEn,
      KO: bodyKo.length ? bodyKo : bodyEn,
    },
    image: str(d.mainImage),
    gallery: Array.isArray(d.gallery) ? d.gallery.filter((g: unknown): g is string => typeof g === 'string') : [],
    date: (str(d.publishedAt) ?? str(d.createdAt) ?? '').slice(0, 10),
    author: str(d.author) ?? 'Wander Asia',
    authorCountry: str(d.authorCountry),
    tourSlug: str(d.tourSlug),
    rating: rating >= 1 && rating <= 5 ? Math.round(rating) : undefined,
    seoTitle: str(d.seoTitle),
    seoDescription: str(d.seoDescription),
  }
}

async function cmsJson<T>(path: string): Promise<T | null> {
  const res = await cmsRequest(path)
  if (!res || !res.ok) return null
  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

/** Published posts, newest first */
export async function getPosts(): Promise<Post[]> {
  const docs = (await cmsJson<{ posts: Raw[] }>('/api/v1/posts'))?.posts
  const posts = (docs ?? []).filter((d) => str(d.slug)).map(toPost)
  if (posts.length === 0 && isBlogDemo()) return SAMPLE_POSTS
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPost(slug: string): Promise<Post | null> {
  const doc = (await cmsJson<{ post: Raw }>(`/api/v1/posts/${encodeURIComponent(slug)}`))?.post
  if (doc && str(doc.slug)) return toPost(doc)
  return isBlogDemo() ? (SAMPLE_POSTS.find((p) => p.slug === slug) ?? null) : null
}

// ---------------------------------------------------------------------------
// Sample posts for demo mode only. Photos are the Dongmen tour's own photos from the CMS.

const MEDIA = 'https://wanderasia-cms.wanderasia.workers.dev/media'
const IMG = {
  dongmen: `${MEDIA}/533704bd-3321-45b1-b505-e034a22b9775.jpg`,
  xlb: `${MEDIA}/69bf7fa9-2807-44ba-bdf3-b808548d9052.jpg`,
  tea: `${MEDIA}/44d05c65-beb2-4e26-925e-ca81be8986d5.jpg`,
  pancake: `${MEDIA}/aee0e040-520d-4f59-84e0-cf131a3fcaae.jpg`,
  mungbean: `${MEDIA}/975e8788-3d4a-4ec3-94f6-1065a526d8a4.jpg`,
  balls: `${MEDIA}/e85e3b2e-3e23-452b-a9ad-f2da83dde9ee.jpg`,
}

type SampleText = { EN: string; ZH: string }
type SamplePost = Omit<Post, 'title' | 'excerpt' | 'body'> & { title: SampleText; excerpt: SampleText; body: { EN: string[]; ZH: string[] } }

const expandSample = (t: SampleText) => ({ EN: t.EN, ZH: t.ZH, ZH_HANS: toSimplified(t.ZH), JA: t.EN, KO: t.EN })

const RAW_SAMPLE_POSTS: SamplePost[] = [
  {
    sample: true,
    slug: 'a-night-of-street-food-at-dongmen',
    kind: 'story',
    title: { EN: 'A Night of Street Food at Dongmen', ZH: '東門的街頭小吃之夜' },
    excerpt: {
      EN: 'Five tastings, one busy market street and a group of hungry travellers. Here’s how our latest Dongmen food tour went.',
      ZH: '五道小吃、一條熱鬧的市場街，還有一群飢腸轆轆的旅人。來看看我們最近一次東門美食導覽的精彩時刻。',
    },
    body: {
      EN: [
        'We met at Dongmen Station Exit 3 just before seven. Our group came from four countries, and for most of them it was their first evening in Taipei.',
        'First stop was xiao long bao, eaten standing at the counter while the steam rolled out of the kitchen. Everyone learned the trick: a small bite at the side, sip the soup, then the rest.',
        'Bubble milk tea came next, and a short story about how it started in Taiwan in the 1980s. Then the scallion pancake, crispy at the edges, made right in front of us.',
        'We finished with mung bean cake and sweet potato balls, walking slowly back towards Daan Park. Thank you to everyone who joined us. See you on the next one!',
      ],
      ZH: [
        '晚上七點前，我們在東門站 3 號出口集合。這一團的旅客來自四個國家，對大部分人來說，這是他們在台北的第一個夜晚。',
        '第一站是小籠包，大家站在櫃檯邊吃，廚房的蒸氣不斷飄出來。每個人都學會了吃法：先在旁邊咬一小口，喝湯，再吃剩下的部分。',
        '接著是珍珠奶茶，順便聽聽它在 1980 年代於台灣誕生的故事。然後是現煎的蔥油餅，邊緣酥脆。',
        '最後我們吃了綠豆糕和地瓜球，慢慢散步走向大安森林公園。謝謝每一位參加的旅客，下次見！',
      ],
    },
    image: IMG.dongmen,
    gallery: [IMG.xlb, IMG.tea, IMG.pancake, IMG.balls],
    date: '2026-10-12',
    author: 'Wander Asia',
    tourSlug: 'dongmen-street-food-tour',
  },
  {
    sample: true,
    slug: 'sample-guest-story-first-night-in-taipei',
    kind: 'guest',
    title: { EN: 'Our First Night in Taipei', ZH: '我們在台北的第一晚' },
    excerpt: {
      EN: 'A guest story, written in the guest’s own words. Guests can send us their story after a tour, and we post it with their permission.',
      ZH: '旅客以自己的文字分享的故事。旅客在行程結束後可以把故事寄給我們，經同意後我們會刊登。',
    },
    body: {
      EN: [
        'This is a sample of how a guest story will look. The real ones are written by guests after their tour and posted with their permission.',
        'We landed in the afternoon, dropped our bags and went straight to Dongmen. We had no idea what to order on our own, so having a guide made all the difference.',
        'The xiao long bao were the highlight for us, and the sweet potato balls were a surprise. We’d never have found half of these places by ourselves.',
      ],
      ZH: [
        '這是旅客故事的範例。正式的故事由旅客在行程結束後撰寫，經同意後刊登。',
        '我們下午抵達，放下行李就直接前往東門。自己完全不知道該點什麼，有導遊帶路真的差很多。',
        '小籠包是我們的最愛，地瓜球則是意外的驚喜。這些店有一半我們自己絕對找不到。',
      ],
    },
    image: IMG.xlb,
    gallery: [],
    date: '2026-10-08',
    author: 'Sample guest',
    authorCountry: 'Canada',
    tourSlug: 'dongmen-street-food-tour',
    rating: 5,
  },
  {
    sample: true,
    slug: 'five-taipei-snacks-to-try',
    kind: 'tips',
    title: { EN: 'Five Taipei Snacks You Have to Try', ZH: '來台北必吃的五種小吃' },
    excerpt: {
      EN: 'From soup dumplings to sweet potato balls: what they are, how to eat them, and where locals line up for them.',
      ZH: '從小籠包到地瓜球：它們是什麼、怎麼吃，以及在地人排隊的地方。',
    },
    body: {
      EN: [
        'Xiao long bao: thin-skinned dumplings with hot soup inside. Bite a small hole first and let them cool for a moment.',
        'Bubble milk tea: black tea, milk and chewy tapioca pearls. You can choose how sweet it is and how much ice.',
        'Scallion pancake: flaky, pan-fried dough with green onion. Ask for an egg on top.',
        'Mung bean cake: a soft, crumbly sweet that melts in your mouth. A good one to take home as a gift.',
        'Sweet potato balls: puffed and chewy, fried until golden. Best eaten right away while they’re warm.',
      ],
      ZH: [
        '小籠包：皮薄、內有熱湯。先咬一個小洞，稍微放涼再吃。',
        '珍珠奶茶：紅茶、牛奶加上Q彈的粉圓，甜度和冰塊都可以自己選。',
        '蔥油餅：層層酥脆的煎餅加上青蔥，可以加一顆蛋。',
        '綠豆糕：口感綿密、入口即化，很適合帶回家當伴手禮。',
        '地瓜球：外酥內Q，炸到金黃，趁熱吃最好吃。',
      ],
    },
    image: IMG.pancake,
    gallery: [IMG.xlb, IMG.tea, IMG.pancake, IMG.mungbean, IMG.balls],
    date: '2026-10-01',
    author: 'Wander Asia',
    tourSlug: 'dongmen-street-food-tour',
  },
  {
    sample: true,
    slug: 'getting-around-taipei-by-mrt',
    kind: 'tips',
    title: { EN: 'Getting Around Taipei by MRT', ZH: '搭捷運暢遊台北' },
    excerpt: {
      EN: 'Taipei’s metro is clean, cheap and easy. A few tips for your first ride, and how to reach our meeting points.',
      ZH: '台北捷運乾淨、便宜又方便。第一次搭乘的小技巧，以及如何抵達我們的集合地點。',
    },
    body: {
      EN: [
        'Get an EasyCard at any MRT station. It works on the metro, buses and in convenience stores, and you can top it up with cash.',
        'Don’t eat or drink inside stations or trains, including water and gum. Stand on the right on escalators.',
        'Most of our tours meet right outside an MRT exit, so you can find us easily. The exit number is on your booking confirmation.',
      ],
      ZH: [
        '在任何捷運站都能買到悠遊卡，可搭捷運、公車，也能在便利商店使用，用現金即可加值。',
        '捷運站內和車廂內禁止飲食，包括喝水和嚼口香糖。搭手扶梯請靠右站。',
        '我們大部分的行程都在捷運出口外集合，很容易找到。出口編號會寫在您的預訂確認中。',
      ],
    },
    gallery: [],
    date: '2026-09-24',
    author: 'Wander Asia',
  },
]

const SAMPLE_POSTS: Post[] = RAW_SAMPLE_POSTS.map((p) => ({
  ...p,
  title: expandSample(p.title),
  excerpt: expandSample(p.excerpt),
  body: {
    EN: p.body.EN,
    ZH: p.body.ZH,
    ZH_HANS: p.body.ZH.map((para) => toSimplified(para)),
    JA: p.body.EN,
    KO: p.body.EN,
  },
}))
