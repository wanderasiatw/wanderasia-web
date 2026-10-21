import { BookOpen, Lightbulb, Quote, type LucideIcon } from 'lucide-react'
import type { PostKind } from '@/lib/blog'

const ICONS: Record<PostKind, LucideIcon> = { story: BookOpen, guest: Quote, tips: Lightbulb }
const TILE: Record<PostKind, string> = { story: 'food', guest: 'special', tips: 'hiking' }

/** The post's photo, or a branded tile for its kind until one is added */
export default function PostCover({ kind, image, alt, className = 'tour-img' }: { kind: PostKind; image?: string; alt: string; className?: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} className={className} loading="lazy" />
  }
  const Icon = ICONS[kind]
  return (
    <div className={`tour-cover tour-cover-${TILE[kind]}`} role="img" aria-label={alt}>
      <Icon size={48} strokeWidth={1.4} />
    </div>
  )
}
