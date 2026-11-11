import { faqs } from '../data/faq'
import { services } from '../data/services'
import { buildJsonLd } from '../lib/jsonld'
import { headSpec } from '../lib/seo-core'

describe('seo', () => {
  it('has no canonical or urls until a site url is known', () => {
    expect(headSpec('/journey').canonical).toBeUndefined()
    expect(JSON.stringify(buildJsonLd('/journey'))).not.toContain('"url"')
  })
  it('builds canonical and og:url from the site url', () => {
    const s = headSpec('/journey', { siteUrl: 'https://example.com/' })
    expect(s.canonical).toBe('https://example.com/journey')
    expect(s.meta.find((m) => m.key === 'og:url')?.content).toBe('https://example.com/journey')
  })
  it('emits FAQPage schema matching the FAQ content', () => {
    const faq = buildJsonLd('/faq').find((j) => j['@type'] === 'FAQPage') as { mainEntity: unknown[] }
    expect(faq.mainEntity).toHaveLength(faqs.length)
  })
  it('lists exactly the three services', () => {
    const list = buildJsonLd('/services').find((j) => j['@type'] === 'ItemList') as { itemListElement: unknown[] }
    expect(list.itemListElement).toHaveLength(services.length)
  })
  it('noindexes unknown pages and honours the noindex option', () => {
    expect(headSpec('/nope').meta.find((m) => m.key === 'robots')?.content).toContain('noindex')
    expect(headSpec('/', { noindex: true }).meta.find((m) => m.key === 'robots')?.content).toBe('noindex,nofollow')
  })
});
