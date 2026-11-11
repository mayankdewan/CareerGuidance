// Runs after `vite build`. Creates one static HTML file per route with its own <title>,
// meta tags, canonical, JSON-LD and a <noscript> text version of the page, plus
// sitemap.xml, robots.txt and llms.txt. Crawlers that do not run JavaScript (many AI
// crawlers) can then read each page. Run with: tsx scripts/prerender.ts
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { faqs } from '../src/data/faq'
import { journeyNote, journeySteps } from '../src/data/journey'
import { metaFor, routes, siteDescription } from '../src/data/seo'
import { services } from '../src/data/services'
import { coach, disclaimer, officialSources, site } from '../src/data/site'
import { absUrl } from '../src/lib/jsonld'
import { headSpec } from '../src/lib/seo-core'

const dist = join(process.cwd(), 'dist')
const siteUrl = (process.env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '') || undefined
const noindex = process.env.VITE_NOINDEX === 'true'
const ogImage = existsSync(join(process.cwd(), 'public', 'og-image.png')) ? absUrl(siteUrl, '/og-image.png') : undefined

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const ul = (items: string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`

function headHtml(path: string): string {
  const spec = headSpec(path, { siteUrl, noindex, ogImage })
  const lines = [`<title>${esc(spec.title)}</title>`]
  for (const m of spec.meta) lines.push(`<meta ${m.attr}="${esc(m.key)}" content="${esc(m.content)}" />`)
  if (spec.canonical) lines.push(`<link rel="canonical" href="${esc(spec.canonical)}" />`)
  for (const j of spec.jsonLd) {
    lines.push(`<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`)
  }
  return lines.join('\n    ')
}

function bodyHtml(path: string): string {
  const m = metaFor(path)
  const nav = routes.filter((r) => r !== '/privacy').map((r) => `<a href="${r}">${esc(metaFor(r).label)}</a>`).join(' | ')
  let main = `<h1>${esc(m.title)}</h1><p>${esc(m.description)}</p>`
  if (path === '/') {
    main += `<h2>Services</h2>${ul(services.map((s) => `${s.title}: ${s.summary}`))}`
    main += `<h2>The Germany study journey</h2>${ul(journeySteps.map((s) => `${s.title}: ${s.short}`))}`
    main += `<h2>${esc(coach.name)}, ${esc(coach.role)}</h2><p>${esc(coach.name)} studied in Germany and has lived and worked there for around ${coach.yearsInGermany} years.</p>`
  } else if (path === '/journey') {
    main += `<p>${esc(journeyNote)}</p>`
    journeySteps.forEach((s, i) => {
      main += `<h2>Step ${i + 1}: ${esc(s.title)}</h2><p>${esc(s.body)}</p>${ul(s.checklist)}`
      main += `<p>Official sources: ${s.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join(', ')}</p>`
    })
    main += `<h2>Official sources</h2>${ul(officialSources.map((o) => `${o.label}: ${o.note}`))}`
  } else if (path === '/services') {
    for (const s of services) {
      main += `<h2>${esc(s.title)}</h2><p>${esc(s.summary)} Best for: ${esc(s.forWhom)}</p><h3>Includes</h3>${ul(s.includes)}<h3>Does not include</h3>${ul(s.notIncluded)}`
    }
  } else if (path === '/faq') {
    for (const f of faqs) main += `<h2>${esc(f.q)}</h2><p>${esc(f.a)}</p>`
  }
  return `<header><strong>${esc(site.name)}</strong> <nav>${nav}</nav></header><main>${main}</main><footer><p>${esc(disclaimer)}</p></footer>`
}

function render(template: string, path: string): string {
  let html = template.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${headHtml(path)}\n    <!--seo:end-->`)
  html = html.replace('<!--seo:noscript-->', bodyHtml(path))
  return html
}

const template = readFileSync(join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--seo:start-->')) throw new Error('index.html is missing the seo markers')

for (const path of routes) {
  const html = render(template, path)
  if (path === '/') writeFileSync(join(dist, 'index.html'), html)
  else {
    mkdirSync(join(dist, path.slice(1)), { recursive: true })
    writeFileSync(join(dist, path.slice(1), 'index.html'), html)
  }
}

// robots.txt: welcome search and AI crawlers explicitly (owner wants discoverability).
const bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot', 'CCBot']
let robots = noindex
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\n${bots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}\n`
if (siteUrl && !noindex) robots += `\nSitemap: ${siteUrl}/sitemap.xml\n`
writeFileSync(join(dist, 'robots.txt'), robots)

if (siteUrl && !noindex) {
  const day = new Date().toISOString().slice(0, 10)
  const urls = routes.map((r) => `  <url><loc>${esc(absUrl(siteUrl, r)!)}</loc><lastmod>${day}</lastmod></url>`).join('\n')
  writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
}

// llms.txt: a plain summary for AI assistants (see llmstxt.org).
const link = (r: string) => (siteUrl ? `[${metaFor(r).label}](${absUrl(siteUrl, r)})` : metaFor(r).label)
const llms = [
  `# ${site.name}`,
  '',
  `> ${siteDescription}`,
  '',
  'Informational guidance only. Requirements change and differ by university, programme and applicant; always confirm with universities and official German authorities. No guarantee of admission, visa approval or employment.',
  '',
  '## Pages',
  ...routes.map((r) => `- ${link(r)}: ${metaFor(r).description}`),
  '',
  '## Services',
  ...services.map((s) => `- ${s.title}: ${s.summary} Includes: ${s.includes.join('; ')}. Does not include: ${s.notIncluded.join('; ')}.`),
  '',
  '## Career coach',
  `- ${coach.name}, ${coach.role}: studied in Germany and has lived and worked there for around ${coach.yearsInGermany} years.`,
  '',
  '## Official sources we point to',
  ...officialSources.map((o) => `- [${o.label}](${o.href}): ${o.note}`),
  '',
  '## FAQ',
  ...faqs.map((f) => `- ${f.q} ${f.a}`),
  '',
].join('\n')
writeFileSync(join(dist, 'llms.txt'), llms)

console.log(`prerendered ${routes.length} routes${siteUrl ? ` for ${siteUrl}` : ' (no VITE_SITE_URL: no canonical/sitemap)'}${noindex ? ' [noindex]' : ''}${ogImage ? ' with og:image' : ''}`)
