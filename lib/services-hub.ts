// Text for the Services page (/services) and the standard service page, in all five site languages.
// The heading, intro and hero photo can be replaced in the CMS (Page text → Services page); the services,
// packages, prices, FAQs and reviews come from the CMS. Everything else is the page's built-in wording.

import type { Text } from './tours'

const T = (EN: string, ZH: string, ZH_HANS: string, JA: string, KO: string): Text => ({ EN, ZH, ZH_HANS, JA, KO })

export const SH = {
  eyebrow: T('Our services', '我們的服務', '我们的服务', 'サービス', '서비스'),
  title: T('Your Taiwan trip, planned by locals', '由在地人為你規劃台灣之旅', '由本地人为你规划台湾之旅', '地元の人がつくる、あなたの台湾旅行', '현지인이 계획하는 나만의 대만 여행'),
  intro: T(
    'Private guides and tailor-made plans across Taiwan. Tell us what you love and we’ll shape the trip around your group.',
    '全台私人導遊與量身規劃。告訴我們你喜歡什麼，我們依你的團體安排行程。',
    '全台私人导游与量身规划。告诉我们你喜欢什么，我们依你的团体安排行程。',
    '台湾全土でプライベートガイドとオーダーメイドのプランをご用意。お好みを教えていただければ、グループに合わせて旅をつくります。',
    '대만 전역의 프라이빗 가이드와 맞춤 계획. 좋아하는 것을 알려 주시면 그룹에 맞춰 여행을 만들어 드립니다.',
  ),
  ctaPlan: T('Plan a private tour', '規劃私人行程', '规划私人行程', 'プライベートツアーを計画', '프라이빗 투어 계획하기'),
  helpSub: T('How we can help', '我們能為你做什麼', '我们能为你做什么', 'できること', '저희가 도와드릴 수 있는 것'),
  helpTitle: T('Choose what you need', '選擇你需要的服務', '选择你需要的服务', '必要なサービスを選ぶ', '필요한 서비스를 선택하세요'),
  bestSeller: T('Most booked', '最多人預訂', '最多人预订', '人気No.1', '가장 많이 예약'),
  buildTour: T('Build your tour', '打造你的行程', '打造你的行程', 'ツアーを組み立てる', '투어 만들기'),
  freeQuote: T('Free quote', '免費報價', '免费报价', '無料見積もり', '무료 견적'),
  details: T('See details', '查看詳情', '查看详情', '詳細を見る', '자세히 보기'),
  waysSub: T('Private tours', '私人行程', '私人行程', 'プライベートツアー', '프라이빗 투어'),
  waysTitle: T('Ways to book a private tour', '私人行程的玩法', '私人行程的玩法', 'プライベートツアーの選び方', '프라이빗 투어 예약 방법'),
  waysLead: T('Pick a starting point. You can change everything in the next step.', '先選一個起點，下一步都可以再調整。', '先选一个起点，下一步都可以再调整。', 'まずは出発点を選んでください。次のステップで自由に変更できます。', '시작점을 고르세요. 다음 단계에서 모두 바꿀 수 있습니다.'),
  start: T('Start here', '從這裡開始', '从这里开始', 'ここから始める', '여기서 시작'),
  notSure: T('Not sure yet?', '還沒決定？', '还没决定？', 'まだ迷っていますか？', '아직 고민 중이세요?'),
  notSureText: T('Tell us your dates and what you enjoy. We’ll suggest a plan.', '告訴我們日期和喜好，我們幫你建議行程。', '告诉我们日期和喜好，我们帮你建议行程。', '日程とお好みを教えてください。プランをご提案します。', '날짜와 취향을 알려 주시면 일정을 제안해 드립니다.'),
  askUs: T('Ask us on WhatsApp', '用 WhatsApp 問我們', '用 WhatsApp 问我们', 'WhatsAppで相談', 'WhatsApp으로 문의'),
  comboSub: T('One request, whole trip', '一次詢問，搞定整趟旅程', '一次咨询，搞定整趟旅程', '一度の相談で旅全体を', '한 번의 문의로 여행 전체를'),
  comboTitle: T('Combine services, we plan it all', '組合服務，我們一起規劃', '组合服务，我们一起规划', 'サービスを組み合わせて、まとめてお任せ', '서비스를 조합하면 모두 계획해 드립니다'),
  comboText: T(
    'Mention everything you need in one message. We put it into one plan with one price.',
    '在一則訊息中告訴我們所有需求，我們整合成一個行程、一個價格。',
    '在一条消息中告诉我们所有需求，我们整合成一个行程、一个价格。',
    '必要なことを一つのメッセージでお知らせください。一つのプラン、一つの料金にまとめます。',
    '필요한 모든 것을 한 메시지로 알려 주세요. 하나의 일정, 하나의 가격으로 정리해 드립니다.',
  ),
  comboCta: T('Send one request', '送出一次詢問', '提交一次咨询', 'まとめて相談する', '한 번에 문의하기'),
  finalTitle: T('Not sure where to start?', '不知道從哪裡開始？', '不知道从哪里开始？', '何から始めればいいか迷ったら', '어디서부터 시작할지 모르겠다면?'),
  finalText: T('Message us. A real local replies, not a bot.', '傳訊息給我們，回覆你的是真正的在地人，不是機器人。', '发消息给我们，回复你的是真正的本地人，不是机器人。', 'メッセージをどうぞ。返信するのはボットではなく地元の人です。', '메시지를 보내 주세요. 봇이 아닌 현지인이 답장합니다.'),
  sendInquiry: T('Send an inquiry', '送出詢問', '提交咨询', 'お問い合わせ', '문의 보내기'),
  // Standard service page
  getQuote: T('Get a free quote', '取得免費報價', '获取免费报价', '無料で見積もる', '무료 견적 받기'),
  options: T('Options and prices', '方案與價格', '方案与价格', 'プランと料金', '옵션과 가격'),
  about: T('About this service', '服務介紹', '服务介绍', 'サービスについて', '서비스 소개'),
  addTourTitle: T('Add a private tour', '加上私人行程', '加上私人行程', 'プライベートツアーも追加', '프라이빗 투어 추가'),
  addTourText: T('Make the most of your day with your own local guide. Ask for both in one request.', '有專屬在地導遊，讓這一天更精彩。可以一次詢問兩項服務。', '有专属本地导游，让这一天更精彩。可以一次咨询两项服务。', '専属の地元ガイドで一日をもっと充実させましょう。まとめてご相談いただけます。', '전담 현지 가이드와 함께 하루를 알차게 보내세요. 한 번에 함께 문의할 수 있습니다.'),
  quoteTitle: T('Get your free quote', '取得你的免費報價', '获取你的免费报价', '無料見積もりを依頼', '무료 견적 받기'),
  quoteText: T('Tell us your dates and group size. We reply with a clear price.', '告訴我們日期和人數，我們會回覆明確的價格。', '告诉我们日期和人数，我们会回复明确的价格。', '日程と人数をお知らせください。わかりやすい料金でご返信します。', '날짜와 인원을 알려 주시면 명확한 가격으로 답장해 드립니다.'),
}
