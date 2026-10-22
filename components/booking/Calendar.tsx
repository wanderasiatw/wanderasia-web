'use client'

import { useMemo, useState } from 'react'
import { INTL_LOCALE, fill } from '@/lib/i18n'
import { formatDate, monthTitle, type Departure } from '@/lib/booking/types'
import { useSite } from '../SiteProvider'

/** Few enough seats to warn about */
export const LOW_SEATS = 3

type Day = { seatsLeft: number }

/** A month calendar of the tour's dates: open dates can be picked, full ones show "Sold out" */
export default function Calendar({ departures, selected, onSelect }: { departures: Departure[]; selected: string; onSelect: (date: string) => void }) {
  const { lang, t } = useSite()

  // Most seats left on each date, across its start times
  const days = useMemo(() => {
    const map = new Map<string, Day>()
    for (const d of departures) {
      const day = map.get(d.date)
      map.set(d.date, { seatsLeft: Math.max(day?.seatsLeft ?? 0, d.seatsLeft) })
    }
    return map
  }, [departures])

  const months = useMemo(() => {
    const keys = Array.from(new Set(departures.map((d) => d.date.slice(0, 7)))).sort()
    return keys.map((k) => ({ year: Number(k.slice(0, 4)), month: Number(k.slice(5, 7)) - 1 }))
  }, [departures])

  const firstOpen = departures.find((d) => d.seatsLeft > 0)?.date
  const startKey = (selected || firstOpen || departures[0]?.date || '').slice(0, 7)
  const [index, setIndex] = useState(() => Math.max(0, months.findIndex((m) => `${m.year}-${String(m.month + 1).padStart(2, '0')}` === startKey)))
  const view = months[index]
  if (!view) return null

  // Sunday-first weeks
  const first = new Date(Date.UTC(view.year, view.month, 1))
  const daysInMonth = new Date(Date.UTC(view.year, view.month + 1, 0)).getUTCDate()
  const blanks = first.getUTCDay()
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(INTL_LOCALE[lang], { weekday: lang === 'EN' ? 'short' : 'narrow', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 4 + i, 12))),
  )

  return (
    <div>
      <div className="cal-head">
        <button type="button" className="cal-nav" onClick={() => setIndex((i) => i - 1)} disabled={index === 0} aria-label={t('prevMonth')}>‹</button>
        <strong aria-live="polite">{monthTitle(view.year, view.month, lang)}</strong>
        <button type="button" className="cal-nav" onClick={() => setIndex((i) => i + 1)} disabled={index >= months.length - 1} aria-label={t('nextMonth')}>›</button>
      </div>
      <div className="cal-grid" role="grid">
        {weekdays.map((w) => <div key={w} className="cal-dow" role="columnheader">{w}</div>)}
        {Array.from({ length: blanks }, (_, i) => <div key={`b${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const n = i + 1
          const date = `${view.year}-${String(view.month + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`
          const day = days.get(date)
          if (!day) return <div key={date} className="cal-day" aria-hidden="true">{n}</div>
          const full = day.seatsLeft === 0
          const low = !full && day.seatsLeft <= LOW_SEATS
          const cls = ['cal-day', full ? 'full' : 'open', low ? 'low' : '', selected === date ? 'selected' : ''].join(' ')
          const note = full ? t('soldOut') : low ? fill(t('seatsLeftShort'), { n: day.seatsLeft }) : ''
          return (
            <button
              key={date}
              type="button"
              className={cls}
              disabled={full}
              aria-pressed={selected === date}
              aria-label={`${formatDate(date, lang)}${note ? `, ${note}` : ''}`}
              onClick={() => onSelect(date)}
            >
              {n}
              {note && <small>{note}</small>}
            </button>
          )
        })}
      </div>
      <div className="cal-legend" aria-hidden="true">
        <span className="l-open">{t('legendOpen')}</span>
        <span className="l-low">{t('legendLow')}</span>
        <span className="l-full">{t('legendFull')}</span>
      </div>
    </div>
  )
}
