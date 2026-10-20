'use client'

import { useSite } from '../SiteProvider'

/** Shown on every booking page while BOOKING_DEMO=1, so nobody mistakes the sample flow for a real booking */
export default function DemoNotice({ show }: { show: boolean }) {
  const { t } = useSite()
  if (!show) return null
  return <p className="demo-notice" role="note">{t('demoNotice')}</p>
}
