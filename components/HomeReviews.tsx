'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { ratingSourceLabel, type Tour, type TourRating } from '@/lib/tours'
import { RatingStars, ratingText } from './TourExtras'
import { useSite } from './SiteProvider'

/** One platform rating, paired with the tour it belongs to */
export interface HomeReviewRow {
  tour: Tour
  rating: TourRating
}

/**
 * The home page's guest-ratings section: every platform rating the CMS holds, tour by tour.
 * Scores and counts only — the CMS stores no review text. Renders nothing while no tour has ratings.
 */
export default function HomeReviews({ rows }: { rows: HomeReviewRow[] }) {
  const { t, lang, href } = useSite()
  if (rows.length === 0) return null

  return (
    <section className="section home-reviews">
      <div className="wa-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">{t('ratingsTitle')}</h2>
          </div>
        </div>
        <div className="review-rows">
          {rows.map(({ tour, rating }) => (
            <div key={`${tour.slug}-${rating.source}`} className="review-row">
              <div className="review-row-main">
                <Link href={href(`/tours/${tour.slug}`)} className="review-tour">
                  {tour.title[lang]}
                </Link>
                <span className="review-text">{ratingText(t, rating)}</span>
              </div>
              <div className="review-row-side">
                {rating.rating != null && <RatingStars value={rating.rating} />}
                {rating.url && (
                  <a href={rating.url} target="_blank" rel="noreferrer" aria-label={ratingSourceLabel(rating.source)}>
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
