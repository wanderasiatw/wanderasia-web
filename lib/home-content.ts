import type { Text } from '@/lib/tours'

/** Home page copy in all five languages (kept here so the home page reads as one piece) */
export const HERO = {
  tag: { EN: 'Local guides across Taiwan', ZH: '台灣在地導遊帶路', ZH_HANS: '台湾在地导游带路', JA: '台湾各地の地元ガイド', KO: '대만 현지 가이드' } as Text,
  title: { EN: 'Taiwan, the way locals live it', ZH: '用在地人的方式，認識台灣', ZH_HANS: '用在地人的方式，认识台湾', JA: '台湾を、地元の人と同じように', KO: '현지인처럼 살아보는 대만' } as Text,
  sub: {
    EN: 'Food, culture and city walks led by people who call Taiwan home. Pick a date and book in one WhatsApp message.',
    ZH: '由住在台灣的在地導遊帶你吃美食、看文化、走街區。選好日期，一則 WhatsApp 訊息就能預約。',
    ZH_HANS: '由住在台湾的在地导游带你吃美食、看文化、走街区。选好日期，一则 WhatsApp 信息就能预约。',
    JA: '台湾に暮らす地元ガイドがご案内するグルメ、文化、街歩き。日付を選んで、WhatsAppメッセージ1通で予約できます。',
    KO: '대만에 사는 현지 가이드가 안내하는 음식, 문화, 도보 투어. 날짜를 정해 WhatsApp 메시지 하나로 예약하세요.',
  } as Text,
  /** Credit required by the photo's CC BY 3.0 license */
  photo: {
    place: { EN: 'Jiufen, New Taipei', ZH: '新北・九份', ZH_HANS: '新北・九份', JA: '新北・九份', KO: '신베이・지우펀' } as Text,
    author: 'Jordy Meow',
    source: 'https://commons.wikimedia.org/wiki/File:Jiufen.jpg',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
}

export const HOW_IT_WORKS = {
  sub: { EN: 'Simple from start to finish', ZH: '從預約到出發都很簡單', ZH_HANS: '从预约到出发都很简单', JA: '予約から出発まで簡単', KO: '예약부터 출발까지 간단합니다' } as Text,
  title: { EN: 'How it works', ZH: '如何預約', ZH_HANS: '如何预约', JA: 'ご予約の流れ', KO: '예약 방법' } as Text,
  steps: [
    {
      title: { EN: 'Choose your tour', ZH: '選擇行程', ZH_HANS: '选择行程', JA: 'ツアーを選ぶ', KO: '투어 선택하기' },
      text: {
        EN: 'Browse our tours, or tell us what you would like to see and we will suggest one.',
        ZH: '瀏覽我們的行程，或告訴我們你想去哪裡，我們幫你推薦。',
        ZH_HANS: '浏览我们的行程，或告诉我们你想去哪里，我们帮你推荐。',
        JA: 'ツアーをご覧いただくか、ご希望を教えていただければおすすめをご提案します。',
        KO: '투어를 둘러보거나 가고 싶은 곳을 알려 주시면 추천해 드립니다.',
      },
    },
    {
      title: { EN: 'Message us on WhatsApp', ZH: '用 WhatsApp 聯絡我們', ZH_HANS: '用 WhatsApp 联络我们', JA: 'WhatsAppで連絡する', KO: 'WhatsApp으로 연락하기' },
      text: {
        EN: 'Send your date and group size. We reply with availability and the price for your group.',
        ZH: '告訴我們日期和人數，我們會回覆可預約時段與團體價格。',
        ZH_HANS: '告诉我们日期和人数，我们会回复可预约时段与团体价格。',
        JA: '日付と人数をお知らせください。空き状況とグループ料金をお返事します。',
        KO: '날짜와 인원을 알려 주시면 예약 가능 여부와 그룹 요금을 답변드립니다.',
      },
    },
    {
      title: { EN: 'Meet your local guide', ZH: '與在地導遊會合', ZH_HANS: '与在地导游会合', JA: '地元ガイドと合流', KO: '현지 가이드와 만나기' },
      text: {
        EN: 'Your guide meets you at the starting point, ready to show you their Taiwan.',
        ZH: '導遊會在集合地點等你，帶你認識他們眼中的台灣。',
        ZH_HANS: '导游会在集合地点等你，带你认识他们眼中的台湾。',
        JA: 'ガイドが集合場所でお待ちし、自分の台湾をご案内します。',
        KO: '가이드가 만남 장소에서 기다리며 자신만의 대만을 안내합니다.',
      },
    },
  ] as { title: Text; text: Text }[],
}

export const WHY_FEATURES: { icon: 'pin' | 'dollar' | 'pen' | 'chat'; title: Text; text: Text }[] = [
  {
    icon: 'pin',
    title: { EN: 'Local Taiwan Expertise', ZH: '在地台灣專業', ZH_HANS: '在地台湾专业', JA: '台湾現地の専門知識', KO: '대만 현지 전문성' },
    text: {
      EN: 'Headquartered in Taipei with guides who know hidden gems, night markets, and authentic culture.',
      ZH: '總部位於台北，導遊熟悉私房景點、夜市與道地文化。',
      ZH_HANS: '总部位于台北，导游熟悉私房景点、夜市与道地文化。',
      JA: '台北に拠点を置き、穴場スポット、夜市、本物の文化を知るガイドがご案内します。',
      KO: '타이베이에 본사를 두고 숨은 명소, 야시장, 진짜 문화를 아는 가이드가 안내합니다.',
    },
  },
  {
    icon: 'dollar',
    title: { EN: 'Transparent Pricing', ZH: '價格透明', ZH_HANS: '价格透明', JA: '透明な料金', KO: '투명한 요금' },
    text: {
      EN: '100% upfront pricing with zero mandatory shopping stops or unexpected extra fees.',
      ZH: '價格事先說清楚，沒有強迫購物站，也沒有額外隱藏費用。',
      ZH_HANS: '价格事先说清楚，没有强迫购物站，也没有额外隐藏费用。',
      JA: '料金は事前に100%明示し、強制的な買い物立ち寄りや想定外の追加料金はありません。',
      KO: '요금은 사전에 100% 공개하며, 강제 쇼핑이나 예상치 못한 추가 요금이 없습니다.',
    },
  },
  {
    icon: 'pen',
    title: { EN: 'Tailor-Made Trips', ZH: '量身打造', ZH_HANS: '量身打造', JA: 'オーダーメイドの旅', KO: '맞춤형 여행' },
    text: {
      EN: 'Custom itineraries for families, couples, and corporate groups with full flexibility.',
      ZH: '為家庭、情侶與企業團體安排客製行程，彈性十足。',
      ZH_HANS: '为家庭、情侣与企业团体安排客制行程，弹性十足。',
      JA: 'ご家族、カップル、企業グループ向けに柔軟なカスタム日程をご用意します。',
      KO: '가족, 커플, 기업 단체를 위한 맞춤 일정을 유연하게 준비합니다.',
    },
  },
  {
    icon: 'chat',
    title: { EN: '24/7 Dedicated Support', ZH: '24/7 專屬客服', ZH_HANS: '24/7 专属客服', JA: '24時間専属サポート', KO: '24시간 전담 지원' },
    text: {
      EN: 'Real-time WhatsApp messaging support throughout your entire journey in Taiwan.',
      ZH: '旅途中隨時可透過 WhatsApp 即時聯繫我們。',
      ZH_HANS: '旅途中随时可通过 WhatsApp 即时联系我们。',
      JA: '台湾での旅の間ずっと、WhatsAppでリアルタイムにサポートします。',
      KO: '대만 여행 내내 WhatsApp으로 실시간 지원해 드립니다.',
    },
  },
]
