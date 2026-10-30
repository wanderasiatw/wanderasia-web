'use client'

import Link from 'next/link'
import { BadgeCheck, Check, ExternalLink, Star, X } from 'lucide-react'
import { ratingSourceLabel, type Tour } from '@/lib/tours'
import { fill, type DictKey } from '@/lib/i18n'
import { useSite } from './SiteProvider'
import { TourCard } from './TourRows'

/** Display names for the review platforms the CMS ratings rows can name (shared with the home page) */
const sourceLabel = ratingSourceLabel

/** Five stars with the filled ones matching the score, rounded to the nearest star */
export function RatingStars({ value, size = 14 }: { value: number; size?: number }) {
  const full = Math.round(value)
  return (
    <span className="stars" role="img" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= full ? 'currentColor' : 'none'} strokeWidth={1.8} />
      ))}
    </span>
  )
}

/** One-line summary of a ratings row, using whichever of score / count the CMS has */
export function ratingText(t: (key: DictKey) => string, r: Tour['ratings'][number]): string {
  const source = sourceLabel(r.source)
  if (r.rating != null && r.count != null) return fill(t('ratingSummary'), { rating: r.rating, count: r.count, source })
  if (r.rating != null) return `${r.rating} · ${source}`
  if (r.count != null) return `${r.count} · ${source}`
  return source
}

/** Compact rating chips for the essentials band under the hero; real CMS ratings only */
export function RatingChips({ tour }: { tour: Tour }) {
  const { t } = useSite()
  if (tour.ratings.length === 0) return null
  return (
    <div className="rating-chips">
      {tour.ratings.map((r) => {
        const inner = (
          <>
            <Star size={13} fill="currentColor" strokeWidth={0} />
            <span>{ratingText(t, r)}</span>
          </>
        )
        return r.url ? (
          <a key={r.source} href={r.url} target="_blank" rel="noreferrer" className="rating-chip">
            {inner}
          </a>
        ) : (
          <span key={r.source} className="rating-chip">
            {inner}
          </span>
        )
      })}
    </div>
  )
}

/** The ratings panel: one row per review platform, linked to the source when the CMS has a URL */
export function RatingsBlock({ tour }: { tour: Tour }) {
  const { t } = useSite()
  if (tour.ratings.length === 0) return null
  return (
    <div className="tp-section">
      <h2>{t('ratingsTitle')}</h2>
      <div className="flex flex-col gap-3">
        {tour.ratings.map((r) => (
          <div key={r.source} className="rating-row">
            {r.rating != null && <RatingStars value={r.rating} />}
            <span style={{ fontSize: 14 }}>{ratingText(t, r)}</span>
            {r.url && (
              <a href={r.url} target="_blank" rel="noreferrer" aria-label={sourceLabel(r.source)} style={{ color: 'var(--primary)', display: 'inline-flex' }}>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const DIFFICULTY_KEYS: Record<string, DictKey> = {
  easy: 'difficulty_easy',
  moderate: 'difficulty_moderate',
  hard: 'difficulty_hard',
  challenging: 'difficulty_challenging',
}

/** The practical-details panel: lists, good-to-know and the hiking pack, all from the CMS */
export function PracticalDetails({ tour }: { tour: Tour }) {
  const { lang, t } = useSite()
  const h = tour.hiking
  const included = tour.included[lang]
  const notIncluded = tour.notIncluded[lang]
  const bring = tour.bring[lang]
  const hasLists = included.length > 0 || notIncluded.length > 0 || bring.length > 0
  const showMeeting = Boolean(tour.meetingPoint && tour.mapUrl)
  if (!hasLists && !tour.importantInfo && !h && !showMeeting) return null

  const difficultyKey = h?.difficulty ? DIFFICULTY_KEYS[h.difficulty.toLowerCase()] : undefined
  const hikeRows: { label: string; value: string }[] = []
  if (h) {
    if (h.difficulty) hikeRows.push({ label: t('difficultyLabel'), value: difficultyKey ? t(difficultyKey) : h.difficulty })
    if (h.distanceKm != null) hikeRows.push({ label: t('distanceLabel'), value: `${h.distanceKm} km` })
    if (h.climbM != null) hikeRows.push({ label: t('climbLabel'), value: `${h.climbM} m` })
    if (h.trailArea) hikeRows.push({ label: t('trailAreaLabel'), value: h.trailArea[lang] })
    if (h.fitness) hikeRows.push({ label: t('fitnessLabel'), value: h.fitness[lang] })
  }

  return (
    <div className="tp-section">
      <h2>{t('detailsTitle')}</h2>

      {showMeeting && (
        <p style={{ fontSize: 14, color: 'var(--stone-600)', marginBottom: 14 }}>
          <strong style={{ color: 'var(--dark)' }}>{t('meetingPointLabel')}:</strong> {tour.meetingPoint?.[lang]}{' '}
          <a href={tour.mapUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            {t('mapLink')}
          </a>
        </p>
      )}

      {(included.length > 0 || notIncluded.length > 0) && (
        <div className="details-cols">
          {included.length > 0 && (
            <div>
              <h3 className="detail-list-title">{t('included')}</h3>
              <ul className="detail-list">
                {included.map((item) => (
                  <li key={item}>
                    <Check size={15} className="detail-icon-ok" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {notIncluded.length > 0 && (
            <div>
              <h3 className="detail-list-title">{t('notIncluded')}</h3>
              <ul className="detail-list">
                {notIncluded.map((item) => (
                  <li key={item}>
                    <X size={15} className="detail-icon-no" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {bring.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3 className="detail-list-title">{t('bringTitle')}</h3>
          <ul className="detail-list">
            {bring.map((item) => (
              <li key={item}>
                <Check size={15} className="detail-icon-ok" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tour.importantInfo && (
        <div style={{ marginTop: 16 }}>
          <h3 className="detail-list-title">{t('goodToKnow')}</h3>
          <p style={{ fontSize: 14, color: 'var(--stone-600)' }}>{tour.importantInfo[lang]}</p>
        </div>
      )}

      {h && (
        <div style={{ marginTop: 18 }}>
          {hikeRows.length > 0 && (
            <div className="fact-rows">
              {hikeRows.map((row) => (
                <div key={row.label} className="fact-row">
                  <span className="fact-row-label">{row.label}</span>
                  <span className="fact-row-value">{row.value}</span>
                </div>
              ))}
            </div>
          )}
          {h.gear[lang].length > 0 && (
            <div style={{ marginTop: 14 }}>
              <h3 className="detail-list-title">{t('gearLabel')}</h3>
              <ul className="detail-list">
                {h.gear[lang].map((item) => (
                  <li key={item}>
                    <Check size={15} className="detail-icon-ok" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {h.amenities[lang].length > 0 && (
            <div style={{ marginTop: 14 }}>
              <h3 className="detail-list-title">{t('amenitiesLabel')}</h3>
              <ul className="detail-list">
                {h.amenities[lang].map((item) => (
                  <li key={item}>
                    <Check size={15} className="detail-icon-ok" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {h.safety && (
            <div style={{ marginTop: 14 }}>
              <h3 className="detail-list-title">{t('safetyLabel')}</h3>
              <p style={{ fontSize: 14, color: 'var(--stone-600)' }}>{h.safety[lang]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** The cancellation panel, plus who runs the tour; shown only when the CMS states a policy */
export function PoliciesBlock({ tour }: { tour: Tour }) {
  const { lang, t, href } = useSite()
  if (!tour.freeCancellation && !tour.cancellationPolicy) return null
  return (
    <div className="tp-section">
      <h2>{t('cancellationTitle')}</h2>
      {tour.freeCancellation && (
        <p className="cancel-note" style={{ marginBottom: tour.cancellationPolicy ? 10 : 0 }}>
          <BadgeCheck size={16} />
          <span>{tour.cancelHours ? fill(t('freeCancelUntil'), { hours: tour.cancelHours }) : t('freeCancellation')}</span>
        </p>
      )}
      {tour.cancellationPolicy && <p style={{ fontSize: 14, color: 'var(--stone-600)', whiteSpace: 'pre-line' }}>{tour.cancellationPolicy[lang]}</p>}
      <p style={{ fontSize: 13, marginTop: 10 }}>
        <Link href={href('/terms')} style={{ color: 'var(--primary)', fontWeight: 700 }}>
          {t('fullTerms')}
        </Link>
      </p>
      <p style={{ fontSize: 13, color: 'var(--stone-600)', marginTop: 14 }}>
        {t('operatedBy')}{' '}
        <Link href={href('/about')} style={{ color: 'var(--primary)', fontWeight: 700 }}>
          {t('aboutUs')}
        </Link>
        {' · '}
        <Link href={href('/contact')} style={{ color: 'var(--primary)', fontWeight: 700 }}>
          {t('contactUs')}
        </Link>
      </p>
    </div>
  )
}

/** Related tours from the CMS list, as the usual tour cards; hidden when the list is empty */
export function RelatedTours({ tours }: { tours: Tour[] }) {
  const { t, lang, href } = useSite()
  if (tours.length === 0) return null
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wa-container">
        <h2 className="section-title" style={{ fontSize: 22, marginBottom: 16 }}>
          {t('relatedTitle')}
        </h2>
        <div className="tour-grid">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} t={t} lang={lang} href={href(`/tours/${tour.slug}`)} />
          ))}
        </div>
      </div>
    </section>
  )
}
