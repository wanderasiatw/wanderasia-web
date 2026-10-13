import { Footprints, Martini, Mountain, Soup, Sparkles, Users, type LucideIcon } from 'lucide-react'
import type { TourCategory } from '@/lib/tours'

export const CATEGORY_ICONS: Record<TourCategory | 'private', LucideIcon> = {
  free: Footprints,
  food: Soup,
  night: Martini,
  hiking: Mountain,
  special: Sparkles,
  private: Users,
}

/** Tour photo, or a branded tile for the category until a photo is added */
export default function TourCover({ category, image, alt }: { category: TourCategory; image?: string; alt: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} className="tour-img" />
  }
  const Icon = CATEGORY_ICONS[category]
  return (
    <div className={`tour-cover tour-cover-${category}`} role="img" aria-label={alt}>
      <Icon size={52} strokeWidth={1.4} />
    </div>
  )
}
