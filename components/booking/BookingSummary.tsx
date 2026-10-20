'use client'

import { fill, type DictKey } from '@/lib/i18n'
import type { Tour } from '@/lib/tours'
import { bookingTotal, formatDate, formatMoney, formatTime } from '@/lib/booking/types'
import TourCover from '../TourCover'
import { useSite } from '../SiteProvider'

export interface SummaryData {
  date?: string
  time?: string
  adults: number
  children: number
  price: number
  childPrice: number
  currency: string
  /** A saved booking's total, as worked out by the CMS; per-guest prices are then left out */
  total?: number
}

export function guestsText(t: (k: DictKey) => string, adults: number, children: number) {
  const parts = [fill(t(adults === 1 ? 'guestAdult' : 'guestAdults'), { n: adults })]
  if (children > 0) parts.push(fill(t(children === 1 ? 'guestChild' : 'guestChildren'), { n: children }))
  return parts.join(', ')
}

/** The tour, date, guests and total, beside every booking step */
export default function BookingSummary({ tour, data }: { tour: Pick<Tour, 'title' | 'image' | 'category' | 'meetingPoint' | 'duration'>; data: SummaryData }) {
  const { lang, t } = useSite()
  const saved = data.total !== undefined
  const total = data.total ?? bookingTotal(data, data.adults, data.children)
  const money = (n: number) => (n === 0 ? t('free') : formatMoney(n, data.currency))

  return (
    <aside className="panel summary-panel" aria-label={t('summary')}>
      <h3>{t('summary')}</h3>
      <div className="summary-tour">
        <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
          <TourCover category={tour.category} image={tour.image} alt="" />
        </div>
        <strong>{tour.title[lang]}</strong>
      </div>
      <ul className="summary-lines">
        {data.date && <li><span>{t('date')}</span><span>{formatDate(data.date, lang)}</span></li>}
        {data.time && <li><span>{t('starts')}</span><span>{formatTime(data.time, lang)}</span></li>}
        {tour.duration && <li><span>{t('duration')}</span><span>{tour.duration[lang]}</span></li>}
        {tour.meetingPoint && <li><span>{t('meet')}</span><span>{tour.meetingPoint[lang]}</span></li>}
        {saved ? (
          <li><span>{t('guests')}</span><span>{guestsText(t, data.adults, data.children)}</span></li>
        ) : (
          <>
        <li>
          <span>{fill(t(data.adults === 1 ? 'guestAdult' : 'guestAdults'), { n: data.adults })}{data.price > 0 && ` × ${formatMoney(data.price, data.currency)}`}</span>
          <span>{money(data.price * data.adults)}</span>
        </li>
        {data.children > 0 && (
          <li>
            <span>{fill(t(data.children === 1 ? 'guestChild' : 'guestChildren'), { n: data.children })}{data.childPrice > 0 && ` × ${formatMoney(data.childPrice, data.currency)}`}</span>
            <span>{money(data.childPrice * data.children)}</span>
          </li>
        )}
          </>
        )}
      </ul>
      <div className="summary-total">
        <span>{t('total')}</span>
        <strong>{money(total)}</strong>
      </div>
    </aside>
  )
}
