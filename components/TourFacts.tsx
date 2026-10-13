import { Clock, Hourglass, MapPin } from 'lucide-react'
import type { Tour } from '@/lib/tours'

/** Meeting point, start time and duration, for whichever of them the tour has */
export default function TourFacts({ tour }: { tour: Tour }) {
  const facts = [
    { Icon: MapPin, label: 'Meet', value: tour.meetingPoint },
    { Icon: Clock, label: 'Starts', value: tour.startTime },
    { Icon: Hourglass, label: 'Duration', value: tour.duration },
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
