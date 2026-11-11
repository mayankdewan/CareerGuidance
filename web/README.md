# Germany Study Guidance Website

A mobile-first marketing site for a small business that helps families and students understand the journey to higher education in Germany. Visitors can read a step-by-step Germany study journey, compare three services, meet the career coach and send an enquiry.

Built with **React 19 + TypeScript + Vite**, hosted as a static site on **Cloudflare Pages**. Enquiries are sent from the browser to **Formspree**. There is no backend, database, login, payments or admin portal in version 1.

> The content is informational only. It makes no promise of admission, visa approval, employment or any other outcome, and the site carries a visible disclaimer.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Editing content](#editing-content)
- [Enquiry form](#enquiry-form)
- [Spam protection](#spam-protection)
- [Animations and accessibility](#animations-and-accessibility)
- [SEO](#seo)
- [Testing](#testing)
- [Deployment](#deployment)
- [Privacy](#privacy)
- [Assumptions and TODOs](#assumptions-and-todos)

---

## Features

- **Home**: hero, three service cards, eight-stage journey overview, career coach section, FAQ teaser.
- **The Journey**: scroll-driven timeline with a progress bar, checklists and links to official sources (DAAD, uni-assist, German missions in India, Make it in Germany). It shows no fees or statistics, which change over time.
- **Services**: exactly three services with what each includes and does not include.
- **Enquiry**: validated form; service buttons across the site open it with the matching service preselected.
- **FAQ**: practical questions, each tagged as general guidance or official rules.
- **Privacy Policy**: owner-reviewable draft with placeholders.
- Original SVG logo and illustrations, scroll-reveal animations, responsive navigation.
- No analytics, no tracking cookies, no external fonts.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19, React Router |
| Language | TypeScript (strict) |
| Build | Vite |
| Tests | Vitest, Testing Library, jsdom |
| Lint | ESLint, typescript-eslint, react-hooks rules |
| Styling | Plain CSS (`src/styles/global.css`), system font stacks |
| Hosting | Cloudflare Pages (static) |
| Forms | Formspree (+ optional Cloudflare Turnstile) |

## Getting started

Requires **Node.js 20+**.

```bash
npm install
cp .env.example .env     # then fill in the values (see below)
npm run dev              # http://localhost:5173
```

Vite reads `.env` only at startup, so restart the dev server after changing it.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm test` | Run all tests once |

## Environment variables

Set in `.env` locally and in Cloudflare Pages → Settings → Variables for production. They are baked in at build time, so redeploy after changing them. Both are **public values, not secrets**.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_FORMSPREE_ENDPOINT` | Yes | Formspree form URL, e.g. `https://formspree.io/f/xxxxxxxx` |
| `VITE_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile **site** key. Enables the CAPTCHA when set |

Never put the Turnstile **secret** key, or any other private credential, in this repo. It belongs in the Formspree dashboard. `.env` is gitignored; `.env.example` is the template.

If `VITE_FORMSPREE_ENDPOINT` is missing, the form shows a "not configured" error. It never pretends a submission succeeded.

## Project structure

```
web/
├─ public/
│  ├─ _redirects          SPA fallback for Cloudflare Pages (/* -> /index.html 200)
│  ├─ favicon.svg
│  └─ robots.txt
├─ src/
│  ├─ main.tsx            App entry, router
│  ├─ App.tsx             Route table
│  ├─ components/
│  │  ├─ Layout.tsx       Header, footer, disclaimer, scroll-reveal observer
│  │  ├─ EnquiryForm.tsx  The enquiry form
│  │  ├─ Turnstile.tsx    Cloudflare Turnstile widget wrapper
│  │  ├─ ServiceCards.tsx Service cards with preselecting CTAs
│  │  ├─ Logo.tsx         Original SVG logo
│  │  ├─ ImageSlot.tsx    Owner photo or labelled placeholder
│  │  └─ Reveal.tsx       Scroll fade-in helper
│  ├─ pages/              Home, Journey, Services, Contact, Faq, Privacy, NotFound
│  ├─ data/               Editable content (see below)
│  ├─ lib/
│  │  ├─ validation.ts    Field rules and limits
│  │  ├─ submit.ts        POST to Formspree
│  │  ├─ draft.ts         In-memory form draft for the privacy round trip
│  │  └─ seo.ts           Per-page title and meta tags
│  ├─ styles/global.css
│  └─ test/               Vitest tests and setup
├─ index.html
├─ .env.example
├─ vite.config.ts · tsconfig.json · eslint.config.js
├─ README.md
└─ DEPLOYMENT_HANDOFF.md
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/journey` | Study in Germany: The Journey |
| `/services` | Services |
| `/contact` | Enquiry. Accepts `?service=guidance`, `end-to-end` or `job-docs` |
| `/faq` | FAQ |
| `/privacy` | Privacy Policy |
| `*` | Not found |

Direct navigation and refresh work on Cloudflare Pages through `public/_redirects`.

## Editing content

All business details and copy live in `src/data/`:

| File | Contents |
| --- | --- |
| `site.ts` | Business name, contact details, legal entity, disclaimer, official source links, career coach details |
| `services.ts` | The three services (id, summary, includes, does not include) |
| `journey.ts` | The eight journey steps, checklists and official links |
| `faq.ts` | FAQ entries |

Search the repo for `TODO(owner)` to find every placeholder that needs real information. Do not invent partnerships, success rates, fees, testimonials or guarantees.

**Adding images:** put licensed images in `public/images/` and pass `src="/images/<file>"` to `ImageSlot` (or set `coach.photo` in `site.ts`). Always supply alt text. Check each image's licence and keep a note of its source.

## Enquiry form

- **Required**: full name, email, service (one of the three), description of the help needed, privacy consent.
- **Optional**: phone/WhatsApp, preferred contact method, intended intake, education level.
- The form warns visitors not to send passport numbers, full academic records, visa files, dates of birth or children's names.
- Input limits, inline validation, accessible labels and errors, a loading state and duplicate-click protection are built in.
- **Service preselection**: service buttons link to `/contact?service=<id>`. The choice stays editable.
- **Submission**: `POST` over HTTPS to `VITE_FORMSPREE_ENDPOINT`. Success is shown only after a 2xx response; network and server errors show an error message.
- **Privacy round trip**: when a visitor opens the privacy policy from the form, their answers are held **in memory only** (no localStorage, sessionStorage or cookies). The privacy page then offers "Back to the enquiry form", and the answers are restored once and cleared. A page reload clears them.
- Form contents are never logged to the console.

## Spam protection

1. **Honeypot**: a hidden `_gotcha` field is sent with every submission and recognised by Formspree.
2. **Cloudflare Turnstile (optional)**: when `VITE_TURNSTILE_SITE_KEY` is set, the form shows the widget and will not send until it is solved. The token is sent as `cf-turnstile-response`, and **Formspree verifies it** with the secret key you enter in the Formspree form settings (CAPTCHA → Cloudflare Turnstile). A token checked only in the browser would not be secure, so verification relies on Formspree.
3. **Formspree settings**: enable its spam filtering in the dashboard and check your plan's limits.

There is no verified per-IP rate limit in this app. Do not claim one unless you have confirmed enforcement on the Formspree or Cloudflare side.

## Animations and accessibility

- Scroll-reveal animations use `IntersectionObserver` and `data-reveal` attributes (`up`, `left`, `right`, `scale`). The hero has an entrance animation and a gently floating illustration.
- **`prefers-reduced-motion` is respected**: animations and transitions are disabled and all content is visible.
- Semantic headings and landmarks, a skip link, visible focus states, keyboard-friendly navigation and accordion, labelled form controls with `aria-invalid` and error messages, and an accessible journey progress indicator.

## SEO

- Each page sets its own title and meta description (`src/lib/seo.ts`), plus Open Graph title and description.
- `public/robots.txt` allows crawling.
- Still to add once the domain is known: `sitemap.xml`, the `Sitemap:` line in `robots.txt`, `og:url` and `og:image`.

## Testing

```bash
npm test
```

Tests cover:

- Field validation rules and limits.
- Exactly three services; preselection from props and from the URL; the selection staying editable.
- Success, server-error, network-error and not-configured submission flows (without faking success).
- Turnstile gating and token submission.
- The privacy round trip, and no stale answers on a fresh visit.

Before pushing, run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`.

## Deployment

Cloudflare Pages settings:

| Setting | Value |
| --- | --- |
| Root directory | `web` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20 |

Add the environment variables above, deploy, then work through the live test checklist in [DEPLOYMENT_HANDOFF.md](./DEPLOYMENT_HANDOFF.md). It also covers the Formspree and Turnstile setup, domain and DNS steps, and the inputs the owner still needs to provide.

## Privacy

The site sets no tracking cookies and uses no analytics by default. Enquiries pass through Formspree. The privacy policy page is a draft with placeholders for the legal entity, legal basis, processors and retention period. Have it reviewed before publishing.

## Assumptions and TODOs

- Business name, logo, contact details, legal entity and the real service scope are placeholders until the owner supplies them.
- The logo is an original placeholder mark.
- The career coach section uses only facts supplied by the owner; the photo is a placeholder until provided. Confirm that naming the listed employers publicly is acceptable.
- Official links were not re-verified at build time; check them before launch.
- No About page, sitemap or Open Graph image yet.
- Nothing has been purchased, registered or deployed on the owner's behalf.
