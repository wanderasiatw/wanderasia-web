'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { fill } from '@/lib/i18n'
import type { Tour } from '@/lib/tours'
import { useSite } from './SiteProvider'

interface GalleryItem {
  kind: 'photo' | 'video'
  /** Photo address, or the embed address for a video */
  src: string
  caption: string
}

/** Turns a YouTube or Vimeo page link into the address its player can be embedded with; null when it isn't one */
function embedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') || u.hostname === 'youtu.be') {
      const id = u.hostname === 'youtu.be' ? u.pathname.slice(1) : u.pathname.startsWith('/embed/') ? u.pathname.slice(7) : u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop() ?? ''
      return /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {
    // Not a link we can embed
  }
  return null
}

/**
 * The tour page's photo mosaic: the cover photo large, the next CMS photos beside it (and the video
 * when it fits), each cell opening the full-screen viewer — with arrows, keyboard and swipe to move
 * through everything. Shown only when the tour has at least one photo of its own.
 */
export default function TourGallery({ tour }: { tour: Tour }) {
  const { lang, t } = useSite()
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const touchX = useRef<number | null>(null)

  const items: GalleryItem[] = []
  if (tour.image) items.push({ kind: 'photo', src: tour.image, caption: '' })
  for (const p of tour.photos) items.push({ kind: 'photo', src: p.image, caption: p.caption[lang] })
  const embed = tour.videoUrl ? embedUrl(tour.videoUrl) : null
  if (embed) items.push({ kind: 'video', src: embed, caption: t('videoLabel') })
  const photoCount = items.filter((i) => i.kind === 'photo').length

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + items.length) % items.length),
    [items.length],
  )

  // Arrow keys move through the photos while the viewer is open, Escape closes it, and the page
  // behind it stays put
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, go])

  // The mosaic needs at least one photo of the tour's own; a video alone leaves the page as it was
  if (photoCount === 0) return null

  const current = items[Math.min(index, items.length - 1)]
  // The cells the mosaic shows: the first photos, plus the video when it fits; everything stays reachable in the viewer
  const cells = items.slice(0, 3)
  const lastPhotoCell = cells.reduce((acc, item, i) => (item.kind === 'photo' ? i : acc), -1)
  const counter = `${Math.min(index, items.length - 1) + 1} / ${items.length}`

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => {
      touchX.current = e.touches[0].clientX
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current == null) return
      const dx = e.changedTouches[0].clientX - touchX.current
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
      touchX.current = null
    },
  }

  const arrows = (cls: string) => (
    <>
      <button type="button" className={`${cls} gallery-prev`} aria-label={t('prevPhoto')} onClick={(e) => { e.stopPropagation(); go(-1) }}>
        <ChevronLeft size={20} />
      </button>
      <button type="button" className={`${cls} gallery-next`} aria-label={t('nextPhoto')} onClick={(e) => { e.stopPropagation(); go(1) }}>
        <ChevronRight size={20} />
      </button>
    </>
  )

  return (
    <div className={`tp-mosaic tp-mosaic-${cells.length}`}>
      {cells.map((item, i) => (
        <button
          key={`${item.kind}-${item.src}`}
          type="button"
          className={i === 0 ? 'tp-cell tp-cell-main' : 'tp-cell'}
          aria-label={item.kind === 'video' ? t('videoLabel') : item.caption || tour.title[lang]}
          onClick={() => { setIndex(i); setOpen(true) }}
        >
          {item.kind === 'photo' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.src} alt="" loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
          ) : (
            <span className="tp-cell-video">
              <Play size={20} />
              {t('videoLabel')}
            </span>
          )}
          {item.kind === 'photo' && item.caption && <span className="tp-cell-caption">{item.caption}</span>}
          {i === lastPhotoCell && photoCount > 1 && <span className="tp-viewall">{fill(t('viewAllPhotos'), { n: photoCount })}</span>}
        </button>
      ))}

      {open && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <button type="button" className="gallery-close" aria-label={t('closeLabel')} onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
          <div className="gallery-lightbox-body" {...swipe} onClick={(e) => e.stopPropagation()}>
            {current.kind === 'photo' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.src} alt={current.caption || tour.title[lang]} />
            ) : (
              <iframe src={current.src} title={t('videoLabel')} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            )}
            {arrows('gallery-arrow lightbox')}
          </div>
          <div className="gallery-lightbox-meta" onClick={(e) => e.stopPropagation()}>
            <span>{counter}</span>
            {current.kind === 'photo' && current.caption && <span>{current.caption}</span>}
          </div>
        </div>
      )}
    </div>
  )
}
