// Text for the private tour page (/services/<private tour>), in all five site languages.
// UI wording lives here; the page's content (prices, packages, itineraries, FAQs, …) comes from the CMS
// service. While a CMS list is empty, the page shows the matching built-in default below, so the page
// never looks empty. Defaults carry no prices: packages show "Price on request" until the CMS has them.

import type { Faq, Itinerary, PriceOption, Text, TextList } from './tours'

const T = (EN: string, ZH: string, ZH_HANS: string, JA: string, KO: string): Text => ({ EN, ZH, ZH_HANS, JA, KO })
const TL = (EN: string[], ZH: string[], ZH_HANS: string[], JA: string[], KO: string[]): TextList => ({ EN, ZH, ZH_HANS, JA, KO })

export const PT = {
  tagline: T('Your Taiwan, your way.', '你的台灣，照你的方式玩。', '你的台湾，照你的方式玩。', 'あなたの台湾を、あなたのペースで。', '나만의 대만, 나만의 방식으로.'),
  ctaPlan: T('Plan my private tour', '規劃我的私人行程', '规划我的私人行程', 'プライベートツアーを計画する', '프라이빗 투어 계획하기'),
  howSub: T('Simple from start to finish', '從頭到尾都很簡單', '从头到尾都很简单', '最初から最後までシンプル', '처음부터 끝까지 간단하게'),
  howTitle: T('How it works', '預訂流程', '预订流程', 'ご予約の流れ', '이용 방법'),
  steps: [
    {
      title: T('Tell us your plan', '告訴我們你的想法', '告诉我们你的想法', 'ご希望を教えてください', '원하는 일정을 알려 주세요'),
      text: T(
        'Pick a tour length and the things you love. It takes about a minute.',
        '選擇行程長度和你喜歡的體驗，大約一分鐘。',
        '选择行程长度和你喜欢的体验，大约一分钟。',
        'ツアーの長さとやりたいことを選ぶだけ。約1分で完了します。',
        '투어 길이와 하고 싶은 것을 고르세요. 1분이면 충분합니다.',
      ),
    },
    {
      title: T('Get your route and price', '收到路線與報價', '收到路线与报价', 'ルートと料金をお届け', '코스와 가격을 받아 보세요'),
      text: T(
        'We reply with a route planned around your group and one clear price.',
        '我們會依你的團體規劃路線，並給你一個清楚的價格。',
        '我们会依你的团体规划路线，并给你一个清楚的价格。',
        'グループに合わせたルートと、わかりやすい料金をお送りします。',
        '그룹에 맞춘 코스와 명확한 가격을 보내 드립니다.',
      ),
    },
    {
      title: T('Confirm and explore', '確認後出發', '确认后出发', '確定して出発', '확정하고 출발'),
      text: T(
        'Pay securely online, then meet your own local guide.',
        '線上安全付款，然後與你的專屬在地導遊見面。',
        '在线安全付款，然后与你的专属本地导游见面。',
        'オンラインで安全にお支払い。あとは専属の地元ガイドと出発です。',
        '온라인으로 안전하게 결제하고 전담 현지 가이드를 만나세요.',
      ),
    },
  ],
  builderSub: T('Takes about a minute', '大約一分鐘', '大约一分钟', '約1分', '약 1분'),
  builderTitle: T('Build your private tour', '打造你的私人行程', '打造你的私人行程', 'プライベートツアーを組み立てる', '나만의 프라이빗 투어 만들기'),
  stepLength: T('How long?', '想玩多久？', '想玩多久？', 'どのくらいの長さ？', '얼마나 오래?'),
  stepDo: T('What would you love to do?', '想做些什麼？', '想做些什么？', '何をしたいですか？', '무엇을 하고 싶으세요?'),
  stepDoHint: T('Pick as many as you like, or none and we’ll suggest a plan.', '可以多選，也可以不選，我們會推薦行程。', '可以多选，也可以不选，我们会推荐行程。', 'いくつでも選べます。選ばなければこちらからご提案します。', '원하는 만큼 고르세요. 고르지 않으면 저희가 추천해 드립니다.'),
  stepWho: T('Who’s coming?', '有幾位？', '有几位？', '何名様ですか？', '몇 분이세요?'),
  guests: T('Guests', '人數', '人数', '人数', '인원'),
  date: T('Travel date', '旅遊日期', '旅游日期', '旅行日', '여행 날짜'),
  optional: T('optional', '選填', '选填', '任意', '선택'),
  stepExtras: T('Extras', '加購', '加购', 'オプション', '추가 옵션'),
  notes: T('Anything else we should know?', '還有什麼想告訴我們的嗎？', '还有什么想告诉我们的吗？', 'ほかに伝えたいことはありますか？', '그 밖에 알려 주실 것이 있나요?'),
  notesPlaceholder: T(
    'e.g. hotel area, kids’ ages, walking limits, places you’d love to see',
    '例：住宿地區、小孩年齡、步行限制、想去的地方',
    '例：住宿地区、小孩年龄、步行限制、想去的地方',
    '例：ホテルのエリア、お子さまの年齢、歩ける距離、行きたい場所',
    '예: 숙소 지역, 아이 나이, 걷기 가능 거리, 가고 싶은 곳',
  ),
  summary: T('Your private tour', '你的私人行程', '你的私人行程', 'あなたのプライベートツアー', '나의 프라이빗 투어'),
  nothingPicked: T('No experiences picked yet. That’s fine, we’ll suggest some.', '還沒選擇體驗也沒關係，我們會推薦。', '还没选择体验也没关系，我们会推荐。', 'まだ選んでいなくても大丈夫。こちらからご提案します。', '아직 고르지 않아도 괜찮아요. 저희가 추천해 드립니다.'),
  estimate: T('Estimated price', '預估價格', '预估价格', '概算料金', '예상 가격'),
  estimateNote: T(
    'An estimate for your whole group. We confirm the final price in our reply, before you pay anything.',
    '這是整團的預估價格。我們會在回覆中確認最終價格，確認前不需付款。',
    '这是整团的预估价格。我们会在回复中确认最终价格，确认前不需付款。',
    'グループ全体の概算です。最終料金はご返信でお知らせし、お支払いはその後です。',
    '그룹 전체의 예상 가격입니다. 최종 가격은 답장에서 확정되며, 그 전에는 결제하지 않습니다.',
  ),
  priceToFollow: T('We’ll send one clear price for your group.', '我們會提供整團的明確報價。', '我们会提供整团的明确报价。', 'グループの料金をはっきりお伝えします。', '그룹에 맞는 명확한 가격을 보내 드립니다.'),
  extraGuests: T('{n} extra guests', '加 {n} 人', '加 {n} 人', '追加 {n} 名', '추가 {n}명'),
  sendPlan: T('Send my plan', '送出我的行程', '提交我的行程', 'このプランで問い合わせる', '이 일정으로 문의하기'),
  sendWhatsApp: T('Send on WhatsApp', '用 WhatsApp 傳送', '用 WhatsApp 发送', 'WhatsAppで送る', 'WhatsApp으로 보내기'),
  noPayment: T('Free to ask. No payment needed now.', '詢問免費，現在不需付款。', '咨询免费，现在不需付款。', 'お問い合わせは無料。今はお支払い不要です。', '문의는 무료이며 지금 결제할 필요가 없습니다.'),
  ideasSub: T('Ideas from around Taiwan', '台灣各地的行程靈感', '台湾各地的行程灵感', '台湾各地のプランアイデア', '대만 곳곳의 일정 아이디어'),
  ideasTitle: T('Sample private days', '私人行程範例', '私人行程范例', 'モデルプラン', '추천 프라이빗 일정'),
  ideasLead: T('Use one as it is, or mix and match.', '可以照著走，也可以自由搭配。', '可以照着走，也可以自由搭配。', 'そのままでも、組み合わせても。', '그대로 이용하거나 자유롭게 조합하세요.'),
  useThis: T('Plan this day', '規劃這一天', '规划这一天', 'このプランで相談', '이 일정으로 계획하기'),
  perfectFor: T('Perfect for', '適合對象', '适合对象', 'こんな方に', '이런 분께 추천'),
  guidesSub: T('Local people, local knowledge', '在地人，在地知識', '本地人，本地知识', '地元の人だから知っている台湾', '현지인이 아는 진짜 대만'),
  guidesTitle: T('Meet your guides', '認識你的導遊', '认识你的导游', 'ガイドのご紹介', '가이드를 소개합니다'),
  reviewsTitle: T('What guests say', '旅客怎麼說', '旅客怎么说', 'ゲストの声', '고객 후기'),
  faqTitle: T('Questions, answered', '常見問題', '常见问题', 'よくある質問', '자주 묻는 질문'),
  finalTitle: T('Ready to plan your day?', '準備好規劃你的行程了嗎？', '准备好规划你的行程了吗？', 'プランを作りませんか？', '일정을 계획해 볼까요?'),
  finalLead: T(
    'Send your plan and we’ll reply with a route and a price for your group.',
    '送出你的想法，我們會回覆路線與整團報價。',
    '提交你的想法，我们会回复路线与整团报价。',
    'プランを送っていただければ、ルートとグループ料金をご返信します。',
    '일정을 보내 주시면 코스와 그룹 가격을 답장으로 보내 드립니다.',
  ),
  planFilled: T('Your plan is in the message below. Add your details and send.', '你的行程已填入下方留言，填寫聯絡方式後送出即可。', '你的行程已填入下方留言，填写联系方式后提交即可。', 'プランは下のメッセージに入っています。連絡先を入力して送信してください。', '일정이 아래 메시지에 들어 있습니다. 연락처를 입력하고 보내 주세요.'),
  // Lines of the plan written into the inquiry message and the WhatsApp text
  msgIntro: T('Hi Wander Asia! I’d like a private tour.', '你好 Wander Asia！我想預訂私人行程。', '你好 Wander Asia！我想预订私人行程。', 'こんにちは、Wander Asiaさん！プライベートツアーをお願いしたいです。', '안녕하세요 Wander Asia! 프라이빗 투어를 원합니다.'),
  msgLength: T('Length', '行程長度', '行程长度', '長さ', '길이'),
  msgDo: T('Interested in', '想體驗', '想体验', 'やりたいこと', '관심 있는 것'),
  msgExtras: T('Extras', '加購', '加购', 'オプション', '추가 옵션'),
  msgNotes: T('Notes', '備註', '备注', '備考', '메모'),
  msgEstimate: T('Website estimate', '網站預估', '网站预估', 'サイトの概算', '웹사이트 예상 가격'),
  msgIdea: T('Sample day', '行程範例', '行程范例', 'モデルプラン', '추천 일정'),
}

// ---------------------------------------------------------------------------
// Built-in content, shown while the matching CMS list is empty

export const DEFAULT_TRUST: TextList = TL(
  ['Just your group, no strangers', 'Anywhere in Taiwan', 'Your pace, your start time', 'Pay securely online'],
  ['只有你們，沒有陌生人', '全台灣都能去', '你的步調，你決定出發時間', '線上安全付款'],
  ['只有你们，没有陌生人', '全台湾都能去', '你的节奏，你决定出发时间', '在线安全付款'],
  ['貸切で、ほかの参加者なし', '台湾全土どこでも', '出発時間もペースも自由', 'オンラインで安全に支払い'],
  ['우리 그룹만, 다른 참가자 없음', '대만 어디든', '원하는 속도와 출발 시간', '안전한 온라인 결제'],
)

export const DEFAULT_PACKAGES: PriceOption[] = [
  {
    label: T('Half day', '半日', '半日', '半日', '반나절'),
    duration: T('About 4 hours', '約 4 小時', '约 4 小时', '約4時間', '약 4시간'),
    detail: T('One or two experiences in or near Taipei', '台北市區或近郊一到兩個體驗', '台北市区或近郊一到两个体验', '台北市内・近郊で1〜2つの体験', '타이베이 시내나 근교에서 1~2가지 체험'),
    price: null,
    unit: 'group',
  },
  {
    label: T('Full day', '全日', '全日', '1日', '하루'),
    duration: T('About 8 hours', '約 8 小時', '约 8 小时', '約8時間', '약 8시간'),
    detail: T('Mix city sights, food and a day trip', '城市景點、美食與近郊一日遊自由搭配', '城市景点、美食与近郊一日游自由搭配', '街歩き・グルメ・日帰り旅を自由に組み合わせ', '도시 명소, 음식, 근교 여행을 자유롭게 조합'),
    price: null,
    unit: 'group',
  },
  {
    label: T('Multi-day', '多日行程', '多日行程', '複数日', '여러 날'),
    duration: T('2 days or more', '2 天以上', '2 天以上', '2日以上', '2일 이상'),
    detail: T('Sun Moon Lake, Tainan, the east coast and more', '日月潭、台南、東海岸等地', '日月潭、台南、东海岸等地', '日月潭、台南、東海岸など', '일월담, 타이난, 동부 해안 등'),
    price: null,
    unit: 'group',
  },
  {
    label: T('Layover', '轉機行程', '转机行程', 'トランジット', '경유 투어'),
    duration: T('3 to 6 hours', '3 到 6 小時', '3 到 6 小时', '3〜6時間', '3~6시간'),
    detail: T('See the best of Taipei between flights', '轉機空檔暢遊台北精華', '转机空档畅游台北精华', '乗り継ぎの合間に台北のハイライトを', '환승 시간에 타이베이의 핵심을'),
    price: null,
    unit: 'group',
  },
]

export const DEFAULT_ITINERARIES: Itinerary[] = [
  {
    title: T('Taipei classics', '台北經典', '台北经典', '台北の定番', '타이베이 클래식'),
    region: T('Taipei', '台北', '台北', '台北', '타이베이'),
    duration: T('Full day', '全日', '全日', '1日', '하루'),
    stops: TL(
      ['Longshan Temple', 'Bopiliao Historic Block', 'Chiang Kai-shek Memorial Hall', 'Lunch in Dongmen', 'Taipei 101', 'Night market dinner'],
      ['龍山寺', '剝皮寮歷史街區', '中正紀念堂', '東門午餐', '台北 101', '夜市晚餐'],
      ['龙山寺', '剥皮寮历史街区', '中正纪念堂', '东门午餐', '台北 101', '夜市晚餐'],
      ['龍山寺', '剥皮寮歴史街区', '中正紀念堂', '東門でランチ', '台北101', '夜市でディナー'],
      ['룽산사', '보피랴오 역사 거리', '중정기념당', '둥먼에서 점심', '타이베이 101', '야시장 저녁'],
    ),
  },
  {
    title: T('Jiufen, Shifen and the coast', '九份、十分與北海岸', '九份、十分与北海岸', '九份・十分と海岸線', '지우펀, 스펀과 해안'),
    region: T('New Taipei', '新北', '新北', '新北', '신베이'),
    duration: T('Full day', '全日', '全日', '1日', '하루'),
    stops: TL(
      ['Shifen Old Street and sky lanterns', 'Shifen Waterfall', 'Jiufen Old Street', 'Teahouse with sea views'],
      ['十分老街放天燈', '十分瀑布', '九份老街', '海景茶樓'],
      ['十分老街放天灯', '十分瀑布', '九份老街', '海景茶楼'],
      ['十分老街でランタン上げ', '十分瀑布', '九份老街', '海を望む茶藝館'],
      ['스펀 라오제와 천등 날리기', '스펀 폭포', '지우펀 라오제', '바다가 보이는 찻집'],
    ),
  },
  {
    title: T('Sun Moon Lake', '日月潭', '日月潭', '日月潭', '일월담'),
    region: T('Nantou', '南投', '南投', '南投', '난터우'),
    duration: T('1 to 2 days', '1 到 2 天', '1 到 2 天', '1〜2日', '1~2일'),
    stops: TL(
      ['Boat across the lake', 'Lakeside cycling path', 'Wenwu Temple', 'Ita Thao village', 'Black tea farm'],
      ['遊湖船', '環湖自行車道', '文武廟', '伊達邵', '紅茶園'],
      ['游湖船', '环湖自行车道', '文武庙', '伊达邵', '红茶园'],
      ['遊覧船で湖を渡る', '湖畔のサイクリングロード', '文武廟', '伊達邵', '紅茶農園'],
      ['유람선으로 호수 건너기', '호숫가 자전거길', '원우묘', '이다사오 마을', '홍차 농장'],
    ),
  },
  {
    title: T('Tainan, the old capital', '台南古都', '台南古都', '古都・台南', '옛 수도 타이난'),
    region: T('Tainan', '台南', '台南', '台南', '타이난'),
    duration: T('1 to 2 days', '1 到 2 天', '1 到 2 天', '1〜2日', '1~2일'),
    stops: TL(
      ['Chihkan Tower', 'Anping Old Fort', 'Shennong Street', 'Tainan street food'],
      ['赤崁樓', '安平古堡', '神農街', '台南小吃'],
      ['赤崁楼', '安平古堡', '神农街', '台南小吃'],
      ['赤崁楼', '安平古堡', '神農街', '台南グルメ'],
      ['츠칸러우', '안핑 고보', '선눙제', '타이난 길거리 음식'],
    ),
  },
]

export const DEFAULT_INTERESTS: TextList = TL(
  ['Street food', 'Night markets', 'Temples and culture', 'History and old streets', 'Nature and hiking', 'Tea', 'Hot springs', 'Photo spots', 'Shopping', 'Kid-friendly stops'],
  ['街頭小吃', '夜市', '廟宇與文化', '歷史老街', '自然健行', '茶', '溫泉', '拍照景點', '購物', '親子景點'],
  ['街头小吃', '夜市', '庙宇与文化', '历史老街', '自然徒步', '茶', '温泉', '拍照景点', '购物', '亲子景点'],
  ['屋台グルメ', '夜市', '寺院と文化', '歴史と老街', '自然・ハイキング', 'お茶', '温泉', 'フォトスポット', 'ショッピング', '子ども向けスポット'],
  ['길거리 음식', '야시장', '사원과 문화', '역사와 옛 거리', '자연과 하이킹', '차', '온천', '사진 명소', '쇼핑', '아이와 가기 좋은 곳'],
)

export const DEFAULT_PERFECT_FOR: TextList = TL(
  ['Families with kids or grandparents', 'Couples and honeymoons', 'Friends travelling together', 'Layovers and short stays', 'First-time visitors', 'Company and school groups'],
  ['帶小孩或長輩的家庭', '情侶與蜜月旅行', '結伴同行的朋友', '轉機與短暫停留', '第一次來台灣', '公司與學校團體'],
  ['带小孩或长辈的家庭', '情侣与蜜月旅行', '结伴同行的朋友', '转机与短暂停留', '第一次来台湾', '公司与学校团体'],
  ['お子さまやご年配の方とのご家族', 'カップル・ハネムーン', '友人同士の旅行', 'トランジット・短期滞在', '初めての台湾', '会社・学校のグループ'],
  ['아이나 어르신과 함께하는 가족', '커플과 신혼여행', '함께 여행하는 친구들', '경유 및 짧은 일정', '대만이 처음인 분', '회사 및 학교 단체'],
)

export const DEFAULT_INCLUDED: TextList = TL(
  ['Your own private local guide', 'A route planned around your group', 'A start time that suits you', 'Local tips for the rest of your trip'],
  ['專屬私人在地導遊', '依你的團體規劃的路線', '依你方便的時間出發', '其他行程的在地建議'],
  ['专属私人本地导游', '依你的团体规划的路线', '依你方便的时间出发', '其他行程的本地建议'],
  ['専属の地元ガイド', 'グループに合わせたルート', 'ご都合のよい出発時間', '旅の残りに役立つ地元のヒント'],
  ['전담 현지 가이드', '그룹에 맞춘 코스', '편한 출발 시간', '남은 여행을 위한 현지 팁'],
)

export const DEFAULT_FAQS: Faq[] = [
  {
    question: T('How much does a private tour cost?', '私人行程多少錢？', '私人行程多少钱？', 'プライベートツアーの料金は？', '프라이빗 투어 가격은 얼마인가요?'),
    answer: T(
      'It depends on the length, your group size and where you want to go. Send us your plan and we reply with one price for your whole group, before you pay anything.',
      '價格依行程長度、人數與目的地而定。送出你的想法後，我們會回覆整團的價格，確認前不需付款。',
      '价格依行程长度、人数与目的地而定。提交你的想法后，我们会回复整团的价格，确认前不需付款。',
      '長さ・人数・行き先によって変わります。プランを送っていただければ、グループ全体の料金をご返信します。お支払いはその後です。',
      '길이, 인원, 목적지에 따라 달라집니다. 일정을 보내 주시면 그룹 전체 가격을 답장으로 보내 드리며, 그 전에는 결제하지 않습니다.',
    ),
  },
  {
    question: T('Can we choose the start time?', '可以自己決定出發時間嗎？', '可以自己决定出发时间吗？', '出発時間は選べますか？', '출발 시간을 정할 수 있나요?'),
    answer: T(
      'Yes. Private tours start when it suits you. Tell us your preferred time when you send your plan.',
      '可以。私人行程依你方便的時間出發，送出行程時告訴我們即可。',
      '可以。私人行程依你方便的时间出发，提交行程时告诉我们即可。',
      'はい。ご都合のよい時間に出発できます。プランを送る際にご希望の時間をお知らせください。',
      '네. 원하시는 시간에 출발합니다. 일정을 보내실 때 희망 시간을 알려 주세요.',
    ),
  },
  {
    question: T('Can you plan a tour outside Taipei?', '可以安排台北以外的行程嗎？', '可以安排台北以外的行程吗？', '台北以外のツアーも可能ですか？', '타이베이 밖의 투어도 가능한가요?'),
    answer: T(
      'Yes. We plan private days all over Taiwan, and longer trips can run over several days.',
      '可以。我們安排全台灣的私人行程，也可以安排多日旅程。',
      '可以。我们安排全台湾的私人行程，也可以安排多日旅程。',
      'はい。台湾全土でプライベートツアーを企画しています。複数日の旅も可能です。',
      '네. 대만 전역에서 프라이빗 일정을 기획하며, 여러 날 일정도 가능합니다.',
    ),
  },
  {
    question: T('Is it good for kids and older travellers?', '適合小孩和長輩嗎？', '适合小孩和长辈吗？', 'お子さまやご年配の方でも大丈夫？', '아이나 어르신도 괜찮나요?'),
    answer: T(
      'Yes. Tell us who is coming and we plan the pace, walking and stops to fit your group.',
      '適合。告訴我們同行成員，我們會依此安排步調、步行距離與停留點。',
      '适合。告诉我们同行成员，我们会依此安排节奏、步行距离与停留点。',
      'はい。参加される方を教えていただければ、ペースや歩く距離、立ち寄り先を調整します。',
      '네. 함께하는 분들을 알려 주시면 속도, 걷는 거리, 방문지를 맞춰 계획합니다.',
    ),
  },
  {
    question: T('How do we pay?', '如何付款？', '如何付款？', '支払い方法は？', '어떻게 결제하나요?'),
    answer: T(
      'Once you’re happy with the plan, you pay securely online by card or PayPal.',
      '確認行程後，可用信用卡或 PayPal 線上安全付款。',
      '确认行程后，可用信用卡或 PayPal 在线安全付款。',
      'プランにご納得いただいたら、カードまたはPayPalでオンラインで安全にお支払いいただけます。',
      '일정이 마음에 드시면 카드나 PayPal로 안전하게 온라인 결제하시면 됩니다.',
    ),
  },
]
