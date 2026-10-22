'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { currencyOf, formatPrice, type Tour } from '@/lib/tours'
import { formatMoney } from '@/lib/booking/types'
import { useSite } from './SiteProvider'
import type { TourBooking } from './TourDetail'

/**
 * Slim booking bar fixed to the bottom on phones: appears once the hero is
 * scrolled past, and hides itself while the booking card (#book) is on screen.
 */
export default function StickyBookBar({ tour, booking }: { tour: Tour; booking?: TourBooking | null }) {
  const { t, href } = useSite()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const target = document.getElementById('book')
    let nearBook = false
    const update = () => setShow(window.scrollY > 560 && !nearBook)
    const observer = target
      ? new IntersectionObserver(
          ([entry]) => {
            nearBook = entry.isIntersecting
            update()
          },
          { rootMargin: '-30% 0px -30% 0px' },
        )
      : null
    if (target && observer) observer.observe(target)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      observer?.disconnect()
    }
  }, [])

  if (tour.comingSoon) return null

  const price = booking
    ? booking.price === 0
      ? t('free')
      : formatMoney(booking.price, booking.currency)
    : tour.price === 0
      ? t('free')
      : tour.price == null
        ? t('priceOnRequest')
        : formatPrice(tour.price, currencyOf(tour))

  return (
    <div className={`sticky-book-bar${show ? ' show' : ''}`} aria-hidden={!show}>
      <div className="sticky-book-info">
        <span>{t('pricePerPerson')}</span>
        <strong>{price}</strong>
      </div>
      {booking ? (
        <Link href={href(`/tours/${tour.slug}/book`)} className="btn btn-primary" tabIndex={show ? 0 : -1}>
          {t('bookNow')}
        </Link>
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          tabIndex={show ? 0 : -1}
          onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          {t('bookNow')}
        </button>
      )}
    </div>
  )
}
