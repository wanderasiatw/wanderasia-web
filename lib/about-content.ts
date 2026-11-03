import type { Text } from '@/lib/tours'

const T = (EN: string, ZH: string, ZH_HANS: string, JA: string, KO: string): Text => ({ EN, ZH, ZH_HANS, JA, KO })

/** Fixed labels of the About page (the heading, intro, story text and photo come from CMS Page text "About us") */
export const ABOUT = {
  eyebrow: T('About Wander Asia', '關於漫遊亞洲', '关于漫游亚洲', 'Wander Asiaについて', 'Wander Asia 소개'),
  browseTours: T('Browse tours', '瀏覽行程', '浏览行程', 'ツアーを見る', '투어 둘러보기'),
  chatWhatsApp: T('Chat on WhatsApp', '用 WhatsApp 聊聊', '用 WhatsApp 聊聊', 'WhatsAppで相談', 'WhatsApp으로 문의'),
  storySub: T('Our story', '我們的故事', '我们的故事', '私たちのストーリー', '우리의 이야기'),
  storyTitle: T('Small tours, real Taiwan', '小團體，真實的台灣', '小团体，真实的台湾', '少人数で、本当の台湾を', '소규모로 만나는 진짜 대만'),
  glanceTitle: T('Wander Asia at a glance', '漫遊亞洲一覽', '漫游亚洲一览', 'Wander Asiaのポイント', '한눈에 보는 Wander Asia'),
  teamSub: T('The people behind the tours', '行程背後的人', '行程背后的人', 'ツアーを支える人たち', '투어를 만드는 사람들'),
  teamTitle: T('Meet the team', '認識我們的團隊', '认识我们的团队', 'チーム紹介', '팀을 소개합니다'),
  reviewsTitle: T('What guests say', '旅客怎麼說', '旅客怎么说', 'ゲストの声', '고객 후기'),
  ctaSub: T('Your next adventure', '下一段旅程', '下一段旅程', '次の旅へ', '다음 여행'),
  ctaTitle: T('Let’s explore Taiwan together', '一起探索台灣吧', '一起探索台湾吧', '一緒に台湾を旅しましょう', '함께 대만을 여행해요'),
  ctaText: T(
    'Pick a tour and book online in about a minute, or message us and we’ll help you plan.',
    '選好行程，大約一分鐘就能線上預約；也可以傳訊息給我們，我們幫你規劃。',
    '选好行程，大约一分钟就能在线预约；也可以发消息给我们，我们帮你规划。',
    'ツアーを選んで約1分でオンライン予約。メッセージをいただければプランのご相談も承ります。',
    '투어를 고르고 약 1분 만에 온라인으로 예약하거나, 메시지를 보내 주시면 일정을 함께 계획해 드립니다.',
  ),
}

/** The four quick points beside the story */
export const ABOUT_POINTS: { title: Text; text: Text }[] = [
  {
    title: T('Small groups', '小團體', '小团体', '少人数制', '소규모 그룹'),
    text: T(
      'No big buses or rushed schedules, so there’s always time for questions, detours and second helpings.',
      '沒有大型遊覽車、不趕行程，隨時都有時間發問、繞路和多吃一份。',
      '没有大型游览车、不赶行程，随时都有时间提问、绕路和多吃一份。',
      '大型バスや慌ただしい日程はなし。質問や寄り道、おかわりの時間もたっぷりあります。',
      '대형 버스도, 바쁜 일정도 없어 질문하고 들르고 한 입 더 먹을 시간이 충분합니다.',
    ),
  },
  {
    title: T('All of Taiwan', '走遍全台灣', '走遍全台湾', '台湾全土へ', '대만 전역'),
    text: T(
      'Night markets and old streets, mountain trails and small towns, well beyond Taipei.',
      '從夜市、老街到山徑與小鎮，不只在台北。',
      '从夜市、老街到山径与小镇，不只在台北。',
      '夜市や老街から山道、小さな町まで。台北の外へも足を延ばします。',
      '야시장과 옛 거리부터 산길과 작은 마을까지, 타이베이 너머로 떠납니다.',
    ),
  },
  {
    title: T('Guided in English', '英語導覽', '英语导览', '英語でご案内', '영어 가이드'),
    text: T(
      'Every tour is led in English by people who call Taiwan home.',
      '每個行程都由以台灣為家的導遊以英語帶領。',
      '每个行程都由以台湾为家的导游用英语带领。',
      'すべてのツアーを、台湾に暮らすガイドが英語でご案内します。',
      '모든 투어는 대만에 사는 가이드가 영어로 안내합니다.',
    ),
  },
  {
    title: T('Easy to book', '輕鬆預約', '轻松预约', 'かんたん予約', '간편한 예약'),
    text: T(
      'See the full price before you pay and book online in about a minute, or ask us on WhatsApp.',
      '付款前就能看到總金額，大約一分鐘完成線上預約，也可以用 WhatsApp 問我們。',
      '付款前就能看到总金额，大约一分钟完成在线预约，也可以用 WhatsApp 问我们。',
      'お支払い前に合計金額を確認でき、約1分でオンライン予約。WhatsAppでのご相談も歓迎です。',
      '결제 전에 총 금액을 확인하고 약 1분 만에 온라인으로 예약하거나 WhatsApp으로 문의하세요.',
    ),
  },
]
