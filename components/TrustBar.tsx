import { ChatIcon, PinIcon } from './Icons'
import { translate, type Lang } from '@/lib/i18n'

export default function TrustBar({ lang }: { lang: Lang }) {
  const t = (key: Parameters<typeof translate>[1]) => translate(lang, key)
  return (
    <section className="trust-bar">
      <div className="wa-container trust-grid">
        <div className="trust-item">
          <div className="trust-icon"><PinIcon size={24} /></div>
          <div>
            <h4>{t('trustLocalTitle')}</h4>
            <p>{t('trustLocalText')}</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon" style={{ color: 'var(--whatsapp-green)', background: '#dcfce7' }}><ChatIcon size={24} /></div>
          <div>
            <h4>{t('trustChatTitle')}</h4>
            <p>{t('trustChatText')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
