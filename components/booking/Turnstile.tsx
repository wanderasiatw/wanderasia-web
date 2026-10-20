'use client'

import { useEffect, useRef } from 'react'

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  remove: (id: string) => void
}

/** Cloudflare Turnstile spam check (free). Calls onToken with the token, or '' when it expires. */
export default function Turnstile({ siteKey, lang, onToken }: { siteKey: string; lang: 'EN' | 'ZH'; onToken: (token: string) => void }) {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const w = window as unknown as { turnstile?: TurnstileApi }
    let id: string | undefined
    let cancelled = false
    const render = () => {
      if (cancelled || !box.current || !w.turnstile) return
      id = w.turnstile.render(box.current, {
        sitekey: siteKey,
        language: lang === 'ZH' ? 'zh-tw' : 'en',
        callback: onToken,
        'expired-callback': () => onToken(''),
      })
    }
    if (w.turnstile) render()
    else {
      let script = document.querySelector<HTMLScriptElement>('script[data-turnstile]')
      if (!script) {
        script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.dataset.turnstile = ''
        document.head.appendChild(script)
      }
      script.addEventListener('load', render)
    }
    return () => {
      cancelled = true
      if (id && w.turnstile) w.turnstile.remove(id)
    }
  }, [siteKey, lang, onToken])

  return <div ref={box} />
}
