'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSite } from './SiteProvider'
import { localePath, stripLang } from '@/lib/i18n'
import { WhatsAppIcon } from './Icons'

export default function Navbar() {
  const { t, lang, href, toggleQr } = useSite()
  // The same page in each language, for the language switch
  const path = stripLang(usePathname() ?? '/')

  return (
    <header>
      <div className="wa-container flex justify-between items-center header-inner">
        <Link href={href('/')} className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-symbol.svg" alt="" className="logo-symbol" />
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wordmark.svg" alt="Wander Asia 漫遊亞洲" className="logo-wordmark" />
            <span className="logo-sub">Tour in Taiwan</span>
          </div>
        </Link>

        <ul className="nav-links">
          <li><Link href={href('/#tours')}>{t('navTours')}</Link></li>
          <li><Link href={href('/#services')}>{t('navServices')}</Link></li>
          <li><Link href={href('/#about')}>{t('navAbout')}</Link></li>
          <li><Link href="#contact">{t('navContact')}</Link></li>
        </ul>

        <div className="flex items-center gap-3">
          <div className="lang-switch">
            <Link href={localePath('EN', path)} hrefLang="en" lang="en" className={`lang-btn ${lang === 'EN' ? 'active' : ''}`} aria-current={lang === 'EN' ? 'true' : undefined}>EN</Link>
            <Link href={localePath('ZH', path)} hrefLang="zh-Hant" lang="zh-Hant" className={`lang-btn ${lang === 'ZH' ? 'active' : ''}`} aria-current={lang === 'ZH' ? 'true' : undefined}>中文</Link>
          </div>
          <button onClick={toggleQr} className="btn btn-whatsapp" aria-label="WhatsApp">
            <WhatsAppIcon />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  )
}
