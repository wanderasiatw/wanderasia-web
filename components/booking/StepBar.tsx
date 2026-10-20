'use client'

import { Check } from 'lucide-react'
import { useSite } from '../SiteProvider'

const STEPS = ['stepDate', 'stepGuests', 'stepDetails', 'stepReview', 'stepPayment'] as const

/** Date → Guests → Details → Review → Payment, with the current step highlighted. Free tours skip Payment. */
export default function StepBar({ current, withPayment = true }: { current: number; withPayment?: boolean }) {
  const { t } = useSite()
  const steps = withPayment ? STEPS : STEPS.slice(0, 4)
  return (
    <ol className="steps" aria-label={t('bookingTitle')}>
      {steps.map((key, i) => {
        const n = i + 1
        const state = n < current ? 'done' : n === current ? 'current' : ''
        return (
          <li key={key} className={state} aria-current={n === current ? 'step' : undefined}>
            <span className="num">{n < current ? <Check size={13} strokeWidth={3} /> : n}</span>
            <span className="label">{t(key)}</span>
          </li>
        )
      })}
    </ol>
  )
}
