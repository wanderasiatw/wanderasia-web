// Company contact details, shared by the header, footer and chat widgets.
export const CONTACT = {
  phone: '+886 963 066 395',
  phoneHref: 'tel:+886963066395',
  whatsapp: '+1 440 785 5187',
  whatsappUrl: 'https://wa.me/14407855187',
  email: 'tourwithus@wanderasia.tw',
  addressZh: '新北市新店區中央路179號1F',
  addressEn: '1F, No. 179, Zhongyang Rd., Xindian Dist., New Taipei City, Taiwan',
}

/** WhatsApp chat link, optionally with a pre-filled message */
export function whatsappLink(text?: string) {
  return text ? `${CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}` : CONTACT.whatsappUrl
}
