import type { Lang } from './i18n'

// Booking terms and cancellation policy shown at /terms and linked from the booking form.
// DRAFT: Wander Asia needs to confirm these (refund windows, minimum group size, payment rules) before launch.

export interface TermsSection {
  title: string
  points: string[]
}

export const TERMS: Record<Lang, TermsSection[]> = {
  EN: [
    {
      title: 'Booking',
      points: [
        'Your booking is confirmed when you see your booking reference on screen. Please save the page or take a screenshot.',
        'For paid tours, your seats are held for 30 minutes while you pay. If payment isn’t completed in that time, the seats are released.',
        'Please give a phone or WhatsApp number we can reach you on during the tour day.',
      ],
    },
    {
      title: 'Prices and payment',
      points: [
        'Prices are per person and shown before you pay. Card payments are handled by Stripe and Taiwan payments by ECPay; we never see or store your card details.',
        'Free tours are free to join. Tips for your guide are welcome but never required.',
      ],
    },
    {
      title: 'Cancelling your booking',
      points: [
        'Free tours: you can cancel at any time. Please let us know so we can give your seat to someone else.',
        'Paid tours: cancel at least 48 hours before the start time for a full refund.',
        'Cancellations less than 48 hours before the start time, and no-shows, are not refunded.',
        'To cancel or change your date, message us on WhatsApp or email tourwithus@wanderasia.tw with your booking reference.',
      ],
    },
    {
      title: 'If we change or cancel a tour',
      points: [
        'We may cancel a tour because of a typhoon, heavy rain, other unsafe conditions, or too few guests. We’ll tell you as early as we can and offer a new date or a full refund.',
        'Small changes to the route or tastings can happen, for example when a vendor is closed that day.',
      ],
    },
    {
      title: 'On the day',
      points: [
        'Please arrive at the meeting point 10 minutes early. We wait up to 15 minutes after the start time, then the tour sets off.',
        'Children must be accompanied by an adult.',
        'Tell us about food allergies or dietary needs when you book, so we can plan around them where possible.',
      ],
    },
    {
      title: 'Your information',
      points: [
        'We use your name and contact details only to run your booking and contact you about it. We don’t sell or share them for marketing.',
      ],
    },
  ],
  ZH: [
    {
      title: '預訂',
      points: [
        '當您在畫面上看到預訂編號時，即表示預訂成立。請儲存頁面或截圖保留。',
        '付費行程在您付款期間會保留名額 30 分鐘；若未在時限內完成付款，名額將自動釋出。',
        '請留下行程當天可聯絡到您的電話或 WhatsApp 號碼。',
      ],
    },
    {
      title: '價格與付款',
      points: [
        '價格以每人計算，並於付款前清楚顯示。信用卡付款由 Stripe 處理，台灣在地付款由綠界科技（ECPay）處理，我們不會看到或儲存您的卡片資料。',
        '免費行程不收費用，小費隨喜，絕不強制。',
      ],
    },
    {
      title: '取消預訂',
      points: [
        '免費行程：可隨時取消，請通知我們，以便將名額讓給其他旅客。',
        '付費行程：於出發前 48 小時以上取消，可全額退款。',
        '出發前 48 小時內取消或未到場，恕不退款。',
        '如需取消或改期，請透過 WhatsApp 或寄信至 tourwithus@wanderasia.tw，並提供預訂編號。',
      ],
    },
    {
      title: '行程變更或取消',
      points: [
        '如遇颱風、大雨、其他安全疑慮或人數不足，我們可能取消行程，並會盡早通知您，提供改期或全額退款。',
        '路線或品嚐內容可能有小幅調整，例如當天店家公休。',
      ],
    },
    {
      title: '行程當天',
      points: [
        '請於出發前 10 分鐘抵達集合地點。我們會在出發時間後等候 15 分鐘，之後準時出發。',
        '兒童須由成人陪同。',
        '如有食物過敏或飲食需求，請於預訂時告知，我們會盡量安排。',
      ],
    },
    {
      title: '個人資料',
      points: ['您的姓名與聯絡資料僅用於處理您的預訂及相關聯繫，我們不會出售或提供給他人作行銷用途。'],
    },
  ],
  ZH_HANS: [
    {
      title: '预订',
      points: [
        '当您在画面上看到预订编号时，即表示预订成立。请保存页面或截图保留。',
        '付费行程在您付款期间会保留名额 30 分钟；若未在时限内完成付款，名额将自动释出。',
        '请留下行程当天可联络到您的电话或 WhatsApp 号码。',
      ],
    },
    {
      title: '价格与付款',
      points: [
        '价格以每人计算，并于付款前清楚显示。信用卡付款由 Stripe 处理，台湾在地付款由绿界科技（ECPay）处理，我们不会看到或储存您的卡片资料。',
        '免费行程不收费用，小费随喜，绝不强制。',
      ],
    },
    {
      title: '取消预订',
      points: [
        '免费行程：可随时取消，请通知我们，以便将名额让给其他旅客。',
        '付费行程：于出发前 48 小时以上取消，可全额退款。',
        '出发前 48 小时内取消或未到场，恕不退款。',
        '如需取消或改期，请通过 WhatsApp 或发送邮件至 tourwithus@wanderasia.tw，并提供预订编号。',
      ],
    },
    {
      title: '行程变更或取消',
      points: [
        '如遇台风、大雨、其他安全疑虑或人数不足，我们可能取消行程，并会尽早通知您，提供改期或全额退款。',
        '路线或品尝内容可能有小幅调整，例如当天店家公休。',
      ],
    },
    {
      title: '行程当天',
      points: [
        '请于出发前 10 分钟抵达集合地点。我们会在出发时间后等候 15 分钟，之后准时出发。',
        '儿童须由成人陪同。',
        '如有食物过敏或饮食需求，请于预订时告知，我们会尽量安排。',
      ],
    },
    {
      title: '个人资料',
      points: ['您的姓名与联络资料仅用于处理您的预订及相关联系，我们不会出售或提供给他人作行销用途。'],
    },
  ],
  JA: [
    {
      title: 'ご予約',
      points: [
        '画面に予約番号が表示された時点でご予約が確定します。ページの保存またはスクリーンショットをお願いします。',
        '有料ツアーは、お支払いの間30分間お席を確保します。その時間内にお支払いが完了しない場合、お席は解放されます。',
        'ツアー当日に連絡のつく電話番号またはWhatsApp番号をお知らせください。',
      ],
    },
    {
      title: '料金とお支払い',
      points: [
        '料金は1名様あたりで、お支払い前に表示されます。カード決済はStripe、台湾でのお支払いはECPayが処理し、当社がカード情報を確認・保存することはありません。',
        '無料ツアーは参加無料です。ガイドへのチップは歓迎しますが、必須ではありません。',
      ],
    },
    {
      title: 'キャンセルについて',
      points: [
        '無料ツアー：いつでもキャンセルできます。お席を他のお客様に譲るため、ご連絡ください。',
        '有料ツアー：開始時刻の48時間前までのキャンセルで全額返金します。',
        '開始時刻の48時間以内のキャンセルおよび無断不参加は返金できません。',
        'キャンセルや日程変更は、予約番号を添えてWhatsApp、またはtourwithus@wanderasia.tw までメールでご連絡ください。',
      ],
    },
    {
      title: '当社による変更・中止',
      points: [
        '台風、大雨、その他の安全上の理由、または最少催行人数に満たない場合、ツアーを中止することがあります。できるだけ早くご連絡し、日程変更または全額返金をご案内します。',
        '当日の店舗の休業などにより、ルートや試食内容が少し変わることがあります。',
      ],
    },
    {
      title: '当日について',
      points: [
        '集合場所には10分前にお越しください。開始時刻から15分までお待ちし、その後出発します。',
        'お子様には必ず大人の同伴が必要です。',
        '食物アレルギーや食事のご希望はご予約時にお知らせください。可能な範囲で対応します。',
      ],
    },
    {
      title: 'お客様の情報',
      points: ['お名前と連絡先は、ご予約の運営とご連絡のためにのみ使用します。マーケティング目的で販売・共有することはありません。'],
    },
  ],
  KO: [
    {
      title: '예약',
      points: [
        '화면에 예약 번호가 표시되면 예약이 확정됩니다. 페이지를 저장하거나 스크린샷으로 보관해 주세요.',
        '유료 투어는 결제하시는 동안 30분간 자리를 확보합니다. 그 시간 안에 결제가 완료되지 않으면 자리가 해제됩니다.',
        '투어 당일 연락 가능한 전화 또는 WhatsApp 번호를 알려 주세요.',
      ],
    },
    {
      title: '가격 및 결제',
      points: [
        '요금은 1인 기준이며 결제 전에 표시됩니다. 카드 결제는 Stripe, 대만 결제는 ECPay가 처리하며 저희는 카드 정보를 보거나 저장하지 않습니다.',
        '무료 투어는 무료로 참여할 수 있습니다. 가이드 팁은 환영하지만 필수는 아닙니다.',
      ],
    },
    {
      title: '예약 취소',
      points: [
        '무료 투어: 언제든 취소할 수 있습니다. 다른 분께 자리를 양보할 수 있도록 알려 주세요.',
        '유료 투어: 시작 시간 48시간 전까지 취소하면 전액 환불합니다.',
        '시작 시간 48시간 이내 취소와 노쇼는 환불되지 않습니다.',
        '취소나 날짜 변경은 예약 번호와 함께 WhatsApp 또는 tourwithus@wanderasia.tw 이메일로 연락해 주세요.',
      ],
    },
    {
      title: '당사가 변경 또는 취소하는 경우',
      points: [
        '태풍, 폭우, 기타 안전상의 이유 또는 최소 인원 미달로 투어를 취소할 수 있습니다. 가능한 한 빨리 알려드리고 날짜 변경이나 전액 환불을 안내합니다.',
        '당일 가게 휴무 등으로 경로와 시식 내용이 조금 바뀔 수 있습니다.',
      ],
    },
    {
      title: '당일 안내',
      points: [
        '만남 장소에 10분 일찍 도착해 주세요. 시작 시간 이후 15분까지 기다린 후 출발합니다.',
        '어린이에게는 반드시 성인이 동반해야 합니다.',
        '음식 알레르기나 식단 요청은 예약 시 알려 주시면 가능한 범위에서 반영하겠습니다.',
      ],
    },
    {
      title: '개인정보',
      points: ['이름과 연락처는 예약 운영과 연락을 위해서만 사용합니다. 마케팅 목적으로 판매하거나 공유하지 않습니다.'],
    },
  ],
}
