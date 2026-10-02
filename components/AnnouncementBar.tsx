'use client'

import { useSite } from './SiteProvider'

export default function AnnouncementBar() {
  const { t } = useSite()
  return (
    <div className="announcement-bar">
      <div className="wa-container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span>{t('announcement')}</span>
        </div>
        <div className="flex gap-4">
          <span>📞 +886 2 2345 6789</span>
        </div>
      </div>
    </div>
  )
}
