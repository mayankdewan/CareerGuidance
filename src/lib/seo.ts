import { useEffect } from 'react'
import { headSpec } from './seo-core'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string | undefined) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!href) { el?.remove(); return }
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(items: object[]) {
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove())
  for (const item of items) {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.setAttribute('data-seo-jsonld', '')
    s.textContent = JSON.stringify(item)
    document.head.appendChild(s)
  }
}

// `path` is the route key from src/data/seo.ts ('*' for unknown pages).
export function useSeo(path: string) {
  useEffect(() => {
    const spec = headSpec(path, {
      siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || undefined,
      noindex: import.meta.env.VITE_NOINDEX === 'true',
    })
    document.title = spec.title
    spec.meta.forEach((m) => setMeta(m.attr, m.key, m.content))
    setCanonical(spec.canonical)
    setJsonLd(spec.jsonLd)
  }, [path])
}
