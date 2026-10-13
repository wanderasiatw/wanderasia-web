'use client'

import { Clock, Hourglass, MapPin } from 'lucide-react'
import type { Tour } from '@/lib/tours'
import { useSite } from './SiteProvider'

/** Meeting point, start time and duration, for whichever of them the tour has */
export default function TourFacts({ tour }: { tour: Tour }) {
  const { lang, t } = useSite()
  const facts = [
    { Icon: MapPin, label: t('meet'), value: tour.meetingPoint?.[lang] },
    { Icon: Clock, label: t('starts'), value: tour.startTime?.[lang] },
    { Icon: Hourglass, label: t('duration'), value: tour.duration?.[lang] },
  ].filter((f) => f.value)
  if (facts.length === 0) return null

  return (
    <ul className="tour-facts">
      {facts.map(({ Icon, label, value }) => (
        <li key={label}>
          <Icon size={16} />
          <span><strong>{label}:</strong> {value}</span>
        </li>
      ))}
    </ul>
  )
}
