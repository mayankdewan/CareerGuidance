import { useEffect, useRef } from 'react'

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  remove: (id: string) => void
}
declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let loading: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = SRC
      s.async = true
      s.defer = true
      s.onload = () => resolve()
      s.onerror = () => { loading = null; reject(new Error('turnstile script failed')) }
      document.head.appendChild(s)
    })
  }
  return loading
}

// The token is only a client-side value. Real verification happens at Formspree,
// which checks it with the secret key stored in the Formspree dashboard.
export default function Turnstile({ siteKey, onToken }: { siteKey: string; onToken: (t: string | null) => void }) {
  const box = useRef<HTMLDivElement>(null)
  const cb = useRef(onToken)
  useEffect(() => { cb.current = onToken })

  useEffect(() => {
    let id: string | undefined
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile) return
        id = window.turnstile.render(box.current, {
          sitekey: siteKey,
          callback: (t: string) => cb.current(t),
          'expired-callback': () => cb.current(null),
          'error-callback': () => cb.current(null),
        })
      })
      .catch(() => cb.current(null))
    return () => {
      cancelled = true
      if (id && window.turnstile) window.turnstile.remove(id)
    }
  }, [siteKey])

  return <div ref={box} className="turnstile" />
}
