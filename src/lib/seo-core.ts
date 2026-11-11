import { metaFor } from '../data/seo'
import { site } from '../data/site'
import { absUrl, buildJsonLd } from './jsonld'

export interface MetaTag { attr: 'name' | 'property'; key: string; content: string }
export interface HeadSpec {
  title: string
  canonical?: string
  meta: MetaTag[]
  jsonLd: object[]
}
export interface HeadOptions { siteUrl?: string; noindex?: boolean; ogImage?: string }

// Shared by the runtime hook (browser) and the build-time prerender script (Node).
export function headSpec(path: string, opts: HeadOptions = {}): HeadSpec {
  const m = metaFor(path)
  const title = path === '/' ? m.title : `${m.title} | ${site.name}`
  const canonical = m.index === false ? undefined : absUrl(opts.siteUrl, path)
  const robots = opts.noindex
    ? 'noindex,nofollow'
    : m.index === false
      ? 'noindex,follow'
      : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'

  const meta: MetaTag[] = [
    { attr: 'name', key: 'description', content: m.description },
    { attr: 'name', key: 'robots', content: robots },
    { attr: 'name', key: 'author', content: site.name },
    { attr: 'name', key: 'application-name', content: site.name },
    { attr: 'property', key: 'og:type', content: 'website' },
    { attr: 'property', key: 'og:site_name', content: site.name },
    { attr: 'property', key: 'og:locale', content: 'en' },
    { attr: 'property', key: 'og:title', content: title },
    { attr: 'property', key: 'og:description', content: m.description },
    { attr: 'name', key: 'twitter:card', content: opts.ogImage ? 'summary_large_image' : 'summary' },
    { attr: 'name', key: 'twitter:title', content: title },
    { attr: 'name', key: 'twitter:description', content: m.description },
  ]
  if (m.keywords.length) meta.push({ attr: 'name', key: 'keywords', content: m.keywords.join(', ') })
  if (canonical) meta.push({ attr: 'property', key: 'og:url', content: canonical })
  if (opts.ogImage) {
    meta.push(
      { attr: 'property', key: 'og:image', content: opts.ogImage },
      { attr: 'property', key: 'og:image:alt', content: `${site.name}: guidance for studying in Germany` },
      { attr: 'name', key: 'twitter:image', content: opts.ogImage },
    )
  }
  return { title, canonical, meta, jsonLd: m.index === false ? [] : buildJsonLd(path, opts.siteUrl) }
}
