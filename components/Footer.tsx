'use client'

import Link from 'next/link'
import { useSite } from './SiteProvider'
import { CONTACT } from '@/lib/contact'

export default function Footer() {
  const { toggleQr, lang, t, href, categories, services } = useSite()
  const open = categories.filter((c) => !c.comingSoon)
  return (
    <footer id="contact">
      <div className="wa-container">
        <div className="footer-grid">
          <div className="footer-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-light.svg" alt="Wander Asia 漫遊亞洲 – Tour in Taiwan" style={{ width: 200, marginBottom: 16 }} />
            <p>{t('footerTagline')}</p>
          </div>

          <div className="footer-col">
            <h4>{t('footerQuickLinks')}</h4>
            <ul className="footer-links">
              {open.map((c) => (
                <li key={c.key}><Link href={href(`/#tours-${c.key}`)}>{c.title[lang]}</Link></li>
              ))}
              {services.map((s) => (
                <li key={s.id}><Link href={href(`/services/${s.slug}`)}>{s.title[lang]}</Link></li>
              ))}
              <li><Link href={href('/services')}>{t('navServices')}</Link></li>
              <li><Link href={href('/blog')}>{t('navBlog')}</Link></li>
              <li><Link href={href('/contact')}>{t('navContact')}</Link></li>
              <li><Link href={href('/about')}>{t('navAbout')}</Link></li>
              <li><Link href={href('/inquire')}>{t('sendInquiry')}</Link></li>
              <li><Link href={href('/terms')}>{t('bookingTerms')}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('navContact')}</h4>
            <p>Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
          </div>

          <div className="footer-col">
            <h4>{t('footerWhatsApp')}</h4>
            <p>WhatsApp: <a href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer">{CONTACT.whatsapp}</a></p>
            <button onClick={toggleQr} className="btn btn-whatsapp" style={{ marginTop: 10, width: '100%' }}>
              {t('footerQr')}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: 20, fontSize: 11 }}>
          © {new Date().getFullYear()} Wander Asia Travel Agency. All rights reserved.
          <span className="footer-credit">
            {' · '}Website by{' '}
            <a href="https://plyndi.com/?utm_source=wanderasia&utm_medium=footer_credit" target="_blank" rel="noopener">Plyndi</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
