'use client'

import Link from 'next/link'
import { useSite } from '@/components/SiteProvider'

export default function NotFound() {
  const { t, href } = useSite()
  return (
    <main>
      <div className="page-banner">
        <div className="wa-container">
          <h1>{t('notFoundTitle')}</h1>
          <p>{t('notFoundText')}</p>
        </div>
      </div>
      <section className="section">
        <div className="wa-container" style={{ textAlign: 'center' }}>
          <Link href={href('/tours')} className="btn btn-primary">{t('allToursHeading')}</Link>
        </div>
      </section>
    </main>
  )
}
