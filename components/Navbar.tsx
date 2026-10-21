'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useSite } from './SiteProvider'
import { localePath, stripLang } from '@/lib/i18n'
import { WhatsAppIcon } from './Icons'

export default function Navbar() {
  const { t, lang, href, toggleQr } = useSite()
  // The same page in each language, for the language switch
  const path = stripLang(usePathname() ?? '/')
  const [open, setOpen] = useState(false)

  // Close the phone menu when the page changes
  useEffect(() => setOpen(false), [path])

  // Menu order set by Wander Asia: Tours, Services, Blog, Contact, About Us
  const links = [
    { to: '/tours', label: t('navTours'), current: path === '/tours' || path.startsWith('/tours/') },
    { to: '/#services', label: t('navServices'), current: path.startsWith('/services/') },
    { to: '/blog', label: t('navBlog'), current: path === '/blog' || path.startsWith('/blog/') },
    { to: '#contact', label: t('navContact'), current: false },
    { to: '/#about', label: t('navAbout'), current: false },
  ]

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

        <nav aria-label={t('menu')}>
          <ul id="site-menu" className={`nav-links${open ? ' open' : ''}`}>
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  href={l.to.startsWith('#') ? l.to : href(l.to)}
                  aria-current={l.current ? 'page' : undefined}
                  className={l.current ? 'active' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="lang-switch">
            <Link href={localePath('EN', path)} hrefLang="en" lang="en" className={`lang-btn ${lang === 'EN' ? 'active' : ''}`} aria-current={lang === 'EN' ? 'true' : undefined}>EN</Link>
            <Link href={localePath('ZH', path)} hrefLang="zh-Hant" lang="zh-Hant" className={`lang-btn ${lang === 'ZH' ? 'active' : ''}`} aria-current={lang === 'ZH' ? 'true' : undefined}>中文</Link>
          </div>
          <button onClick={toggleQr} className="btn btn-whatsapp" aria-label="WhatsApp">
            <WhatsAppIcon />
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? t('closeMenu') : t('menu')}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}
