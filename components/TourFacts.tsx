'use client'

import {
  Baby,
  CalendarDays,
  Car,
  Clock,
  Globe,
  Hourglass,
  Info,
  Languages,
  MapPin,
  Users,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { Tour } from '@/lib/tours'
import { useSite } from './SiteProvider'

/** Icons the CMS offers for its key-facts rows, matched to lucide icons by name */
const FACT_ICONS: Record<string, LucideIcon> = {
  users: Users,
  user: Users,
  group: Users,
  globe: Globe,
  language: Languages,
  languages: Languages,
  clock: Clock,
  pin: MapPin,
  'map-pin': MapPin,
  calendar: CalendarDays,
  wallet: Wallet,
  baby: Baby,
  car: Car,
  food: UtensilsCrossed,
}

/**
 * The facts row under the photo mosaic: meeting point, start time and duration,
 * plus the tour's key facts from the CMS (group size, language, …) — each one a
 * circled icon with its value and label, shown only when the data exists.
 */
export default function TourFacts({ tour }: { tour: Tour }) {
  const { lang, t } = useSite()
  const facts = [
    { Icon: MapPin, label: t('meet'), value: tour.meetingPoint?.[lang] },
    { Icon: Clock, label: t('starts'), value: tour.startTime?.[lang] },
    { Icon: Hourglass, label: t('duration'), value: tour.duration?.[lang] },
  ].filter((f) => f.value)
  const extra = tour.facts
    .map((f) => ({ Icon: (f.icon && FACT_ICONS[f.icon.toLowerCase()]) || Info, value: f.text[lang] }))
    .filter((f) => f.value)
  if (facts.length === 0 && extra.length === 0) return null

  return (
    <ul className="tp-facts">
      {facts.map(({ Icon, label, value }) => (
        <li key={label}>
          <span className="tp-fact-ico">
            <Icon size={15} />
          </span>
          <span className="tp-fact-text">
            <strong>{value}</strong>
            <small>{label}</small>
          </span>
        </li>
      ))}
      {extra.map(({ Icon, value }, i) => (
        <li key={`${value}-${i}`}>
          <span className="tp-fact-ico">
            <Icon size={15} />
          </span>
          <span className="tp-fact-text">
            <strong>{value}</strong>
          </span>
        </li>
      ))}
    </ul>
  )
}
