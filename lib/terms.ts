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
        'Your booking is confirmed when you see your booking reference on screen and receive our confirmation email.',
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
        'To cancel or change your date, reply to your confirmation email or message us on WhatsApp with your booking reference.',
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
        '當您在畫面上看到預訂編號並收到確認信時，即表示預訂成立。',
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
        '如需取消或改期，請回覆確認信，或透過 WhatsApp 提供預訂編號與我們聯繫。',
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
}
