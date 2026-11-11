import { faqs } from '../data/faq'
import { metaFor, siteDescription } from '../data/seo'
import { services } from '../data/services'
import { coach, site } from '../data/site'

type Json = Record<string, unknown>

const isPlaceholder = (s: string) => s.trim().startsWith('[')

export function absUrl(siteUrl: string | undefined, path: string): string | undefined {
  if (!siteUrl) return undefined
  return siteUrl.replace(/\/+$/, '') + (path === '/' ? '/' : path)
}

// Structured data built only from facts already on the site. No ratings, prices, reviews or awards.
export function buildJsonLd(path: string, siteUrl?: string): Json[] {
  const home = absUrl(siteUrl, '/')
  const org: Json = {
    '@type': 'Organization',
    '@id': home ? `${home}#organization` : '#organization',
    name: site.name,
    description: siteDescription,
    knowsAbout: ['Studying in Germany', 'German university applications', 'Job application documents for Germany'],
    ...(home && { url: home }),
    ...(!isPlaceholder(site.email) && { email: site.email }),
  }
  const out: Json[] = []

  out.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    description: siteDescription,
    inLanguage: 'en',
    ...(home && { url: home }),
    publisher: { '@id': org['@id'] },
  })
  out.push({ '@context': 'https://schema.org', ...org })

  if (path === '/') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: coach.name,
      jobTitle: coach.role,
      description: `${coach.role}. Studied in Germany and has lived and worked there for around ${coach.yearsInGermany} years.`,
      worksFor: { '@id': org['@id'] },
    })
  }

  if (path === '/services') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Services',
      itemListElement: services.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: s.title,
          description: `${s.summary} ${s.forWhom}`,
          provider: { '@id': org['@id'] },
          ...(absUrl(siteUrl, '/services') && { url: absUrl(siteUrl, '/services') }),
        },
      })),
    })
  }

  if (path === '/faq') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  if (path !== '/' && path !== '*') {
    const crumbs = [{ name: 'Home', path: '/' }, { name: metaFor(path).label, path }]
    out.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        ...(absUrl(siteUrl, c.path) && { item: absUrl(siteUrl, c.path) }),
      })),
    })
  }
  return out
}
