// Company contact details, shared by the header, footer and chat widgets.
export const CONTACT = {
  whatsapp: '+1 440 785 5187',
  whatsappUrl: 'https://wa.me/14407855187',
  email: 'tourwithus@wanderasia.tw',
  /** Google Maps link to the Google Business Profile — paste the "Share" link once the profile is verified */
  googleMapsUrl: '',
  /** Other official profiles (Instagram, Facebook, TripAdvisor…) — full URLs */
  socialProfiles: [] as string[],
}

/** WhatsApp chat link, optionally with a pre-filled message */
export function whatsappLink(text?: string) {
  return text ? `${CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}` : CONTACT.whatsappUrl
}

/** WhatsApp link asking to hear when a tour's details are out */
export function askAboutLink(name: string) {
  return whatsappLink(`Hi Wander Asia! I'm interested in ${name}. Please let me know when details are available.`)
}
