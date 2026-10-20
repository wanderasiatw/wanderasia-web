import type { Booking } from './types'

/** Tour length in minutes from text like "About 2.5 hours"; 2 hours when it can't be read */
function minutes(duration?: string) {
  const m = duration?.match(/(\d+(?:\.\d+)?)\s*(hour|hr|h|小時)/i)
  return m ? Math.round(Number(m[1]) * 60) : 120
}

/** Start and end in UTC, as 20261024T110000Z (tour times are Taiwan time, UTC+8) */
function times(b: Pick<Booking, 'date' | 'time'>, duration?: string) {
  const start = new Date(`${b.date}T${b.time}:00+08:00`)
  const end = new Date(start.getTime() + minutes(duration) * 60_000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  return { start: fmt(start), end: fmt(end) }
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')

export interface CalendarEvent {
  title: string
  details: string
  location?: string
  duration?: string
}

/** An .ics file for Apple Calendar, Outlook and others */
export function icsFile(b: Booking, e: CalendarEvent) {
  const { start, end } = times(b, e.duration)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wander Asia//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${b.ref}@wanderasia.tw`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.details)}`,
    ...(e.location ? [`LOCATION:${esc(e.location)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function googleCalendarUrl(b: Booking, e: CalendarEvent) {
  const { start, end } = times(b, e.duration)
  const q = new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates: `${start}/${end}`, details: e.details })
  if (e.location) q.set('location', e.location)
  return `https://calendar.google.com/calendar/render?${q}`
}
