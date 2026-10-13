import { Car, Map, Plane, Sparkles, Users, type LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = { 'private-tour': Users, transfer: Plane, car: Car, planning: Map }
const STYLES: Record<string, string> = { 'private-tour': 'food', transfer: 'night', car: 'hiking', planning: 'special' }

/** Service photo, or a branded tile with the service's icon until a photo is added */
export default function ServiceCover({ kind, image, alt }: { kind: string; image?: string; alt: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} className="tour-img" />
  }
  const Icon = ICONS[kind] ?? Sparkles
  return (
    <div className={`tour-cover tour-cover-${STYLES[kind] ?? 'special'}`} role="img" aria-label={alt}>
      <Icon size={52} strokeWidth={1.4} />
    </div>
  )
}
