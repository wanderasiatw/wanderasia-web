import { Star } from 'lucide-react'
import { ChatIcon, PinIcon } from './Icons'
import { RatingStars } from './TourExtras'
import { fill, translate, type Lang } from '@/lib/i18n'
import { ratingSourceLabel } from '@/lib/tours'

/** The strongest real rating across the tours (most reviews wins), for the home page's proof item */
export interface TrustProof {
  rating: number
  count: number
  source: string
  url?: string
}

export default function TrustBar({ lang, proof }: { lang: Lang; proof?: TrustProof | null }) {
  const t = (key: Parameters<typeof translate>[1]) => translate(lang, key)
  const proofInner = proof ? (
    <>
      <div className="trust-icon" style={{ color: 'var(--gold-text)', background: '#f7ecd7' }}>
        <Star size={24} fill="currentColor" strokeWidth={0} />
      </div>
      <div>
        <h4>{t('ratingsTitle')}</h4>
        <p>
          <RatingStars value={proof.rating} size={13} />
          {fill(t('ratingSummary'), { rating: proof.rating, count: proof.count, source: ratingSourceLabel(proof.source) })}
        </p>
      </div>
    </>
  ) : null

  return (
    <section className={proof ? 'trust-bar trust-bar-proof' : 'trust-bar'}>
      <div className="wa-container trust-grid">
        <div className="trust-item">
          <div className="trust-icon"><PinIcon size={24} /></div>
          <div>
            <h4>{t('trustLocalTitle')}</h4>
            <p>{t('trustLocalText')}</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon" style={{ color: 'var(--whatsapp-green)', background: '#dcfce7' }}><ChatIcon size={24} /></div>
          <div>
            <h4>{t('trustChatTitle')}</h4>
            <p>{t('trustChatText')}</p>
          </div>
        </div>
        {proof &&
          (proof.url ? (
            <a className="trust-item trust-proof" href={proof.url} target="_blank" rel="noreferrer">
              {proofInner}
            </a>
          ) : (
            <div className="trust-item trust-proof">{proofInner}</div>
          ))}
      </div>
    </section>
  )
}
