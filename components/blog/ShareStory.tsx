'use client'

import { Mail } from 'lucide-react'
import { CONTACT, whatsappLink } from '@/lib/contact'
import { WhatsAppIcon } from '../Icons'
import { useSite } from '../SiteProvider'

/** Invites guests to send their own story; the team posts it with their permission */
export default function ShareStory({ tourTitle }: { tourTitle?: string }) {
  const { t } = useSite()
  const about = tourTitle ? ` from the ${tourTitle}` : ''
  const mail = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`My Wander Asia story${about}`)}`
  return (
    <div className="share-story">
      <div>
        <h3>{t('shareStoryTitle')}</h3>
        <p>{t('shareStoryText')}</p>
      </div>
      <div className="share-story-actions">
        <a href={mail} className="btn btn-primary"><Mail size={16} /> {t('shareStoryEmail')}</a>
        <a href={whatsappLink(`Hi Wander Asia! I'd like to share my story${about}.`)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
          <WhatsAppIcon />
          <span>{t('shareStoryWhatsApp')}</span>
        </a>
      </div>
    </div>
  )
}
