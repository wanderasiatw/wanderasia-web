'use client'

import Link from 'next/link'
import { useSite } from './SiteProvider'
import { WhatsAppIcon } from './Icons'

export default function Navbar() {
  const { t, lang, setLang, toggleQr } = useSite()

  return (
    <header>
      <div className="wa-container flex justify-between items-center header-inner">
        <Link href="/" className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-symbol.png" alt="" className="logo-symbol" />
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wordmark.png" alt="Wander Asia" className="logo-wordmark" />
            <span className="logo-sub">Extraordinary Journeys <span className="logo-star">✦</span> Asia</span>
          </div>
        </Link>

        <ul className="nav-links">
          <li><Link href="/#destinations">{t('navDest')}</Link></li>
          <li><Link href="/#tours">{t('navTours')}</Link></li>
          <li><Link href="/#about">{t('navAbout')}</Link></li>
          <li><Link href="/#reviews">{t('navReviews')}</Link></li>
          <li><Link href="#contact">{t('navContact')}</Link></li>
        </ul>

        <div className="flex items-center gap-3">
          <div className="lang-switch">
            <button onClick={() => setLang('EN')} className={`lang-btn ${lang === 'EN' ? 'active' : ''}`}>EN</button>
            <button onClick={() => setLang('ZH')} className={`lang-btn ${lang === 'ZH' ? 'active' : ''}`}>中文</button>
          </div>
          <button onClick={toggleQr} className="btn btn-whatsapp">
            <WhatsAppIcon />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  )
}
