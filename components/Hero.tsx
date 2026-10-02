'use client'

import { useState, type FormEvent } from 'react'
import { scrollToTours, useSite } from './SiteProvider'
import { SearchIcon, ShieldIcon } from './Icons'

export default function Hero() {
  const { t, setFilter } = useSite()
  const [dest, setDest] = useState('ALL')
  const [type, setType] = useState('ALL')
  const [date, setDate] = useState('')

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    setFilter({ dest, type })
    scrollToTours()
  }

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="wa-container hero-content">
        <div className="badge-hero">
          <ShieldIcon size={14} color="#99f6e4" />
          <span>{t('heroTag')}</span>
        </div>
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroSub')}</p>

        <div className="search-card">
          <form onSubmit={handleSearch} className="search-grid">
            <div className="form-group">
              <label htmlFor="search-dest">{t('lblDest')}</label>
              <select id="search-dest" className="form-control" value={dest} onChange={(e) => setDest(e.target.value)}>
                <option value="ALL">{t('allDest')}</option>
                <option value="Japan">Japan (日本)</option>
                <option value="Taiwan">Taiwan (台灣)</option>
                <option value="Korea">South Korea (韓國)</option>
                <option value="Thailand">Thailand (泰國)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="search-date">{t('lblDate')}</label>
              <input id="search-date" type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="search-type">{t('lblType')}</label>
              <select id="search-type" className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="ALL">{t('allTypes')}</option>
                <option value="Sakura">Sakura &amp; Nature</option>
                <option value="Culture">Cultural &amp; Food</option>
                <option value="Winter">Winter &amp; Snow</option>
              </select>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 11 }}>
                <SearchIcon />
                <span>{t('search')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
