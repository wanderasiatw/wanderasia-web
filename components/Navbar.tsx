'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useSite } from './SiteProvider'
import { HTML_LANG, LANGS, LANG_LABEL, localePath, stripLang } from '@/lib/i18n'
import { WhatsAppIcon } from './Icons'

export default function Navbar() {
  const { t, lang, href, toggleQr } = useSite()
  // The same page in each language, for the language switch
  const path = stripLang(usePathname() ?? '/')
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  // Close the phone menu and the language switch when the page changes
  useEffect(() => {
    setOpen(false)
    setLangOpen(false)
  }, [path])

  // Menu order set by Wander Asia: Tours, Services, Blog, Contact, About Us
  const links = [
    { to: '/tours', label: t('navTours'), current: path === '/tours' || path.startsWith('/tours/') },
    { to: '/services', label: t('navServices'), current: path === '/services' || path.startsWith('/services/') },
    { to: '/blog', label: t('navBlog'), current: path === '/blog' || path.startsWith('/blog/') },
    { to: '/contact', label: t('navContact'), current: path === '/contact' },
    { to: '/about', label: t('navAbout'), current: path === '/about' },
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
                  href={href(l.to)}
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
          {/* Five languages no longer fit as buttons, so the switch is a compact dropdown
              showing the current language and linking to the same page in each language */}
          <div className="lang-menu">
            <button
              type="button"
              className="lang-btn lang-current"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={t('langLabel')}
              onClick={() => setLangOpen((o) => !o)}
            >
              {LANG_LABEL[lang]}
              <ChevronDown size={14} />
            </button>
            {langOpen && (
              <ul className="lang-dropdown" role="listbox" aria-label={t('langLabel')}>
                {LANGS.map((l) => (
                  <li key={l} role="option" aria-selected={l === lang}>
                    <Link
                      href={localePath(l, path)}
                      hrefLang={HTML_LANG[l]}
                      lang={HTML_LANG[l]}
                      className={l === lang ? 'active' : undefined}
                      aria-current={l === lang ? 'true' : undefined}
                      onClick={() => setLangOpen(false)}
                    >
                      {LANG_LABEL[l]}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
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
