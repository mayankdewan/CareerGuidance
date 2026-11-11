# Deployment Handoff

Nothing has been deployed, purchased or registered. Every step below is for the owner.

## Cloudflare Pages build settings

| Setting | Value |
| --- | --- |
| Framework preset | None / Vite |
| Root directory | `/` (repo root) |
| Deploy command (only if shown) | `npx wrangler deploy` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20 (set `NODE_VERSION=20` if needed) |

SPA routing: `wrangler.jsonc` sets `not_found_handling: single-page-application`, so unknown paths serve `index.html`. Direct navigation to `/journey`, `/services`, `/contact`, `/faq` and `/privacy` returned 200 in a local preview of the production build. Re-test on the live domain.

## Environment variables (Cloudflare Pages → Settings → Variables)

- `VITE_SITE_URL` = your public address with no trailing slash, e.g. `https://yourproject.pages.dev` (enables canonical URLs and the sitemap)
- `VITE_NOINDEX` = `true` while testing with placeholders (blocks indexing); remove or set `false` at launch
- `VITE_TURNSTILE_SITE_KEY` = Turnstile site key (optional, public)
- `VITE_FORMSPREE_ENDPOINT` = your Formspree form URL (`https://formspree.io/f/...`). This is public, not a secret. It is baked in at build time, so redeploy after changing it.

## Owner inputs still needed

- [ ] Business name, logo, brand colours (current navy/gold is a placeholder palette)
- [ ] Contact email, WhatsApp/phone
- [ ] Legal entity name and address (footer, privacy policy)
- [ ] Confirmed inclusions for the three services (`src/data/services.ts`)
- [ ] Privacy policy review: legal basis, processors, retention period, rights
- [ ] Optional: founder/team details for an About page; owner-supplied photos
- [ ] Re-verify official links in `journey.ts` and `site.ts`

## Turnstile CAPTCHA (optional but recommended)

1. In the Cloudflare dashboard, create a Turnstile widget for your domain (and `localhost` for testing). Copy the **site key** and **secret key**.
2. In Formspree → your form → Settings → CAPTCHA, choose Cloudflare Turnstile and paste the **secret key** there. This is what makes verification real.
3. In Cloudflare Pages, add the env var `VITE_TURNSTILE_SITE_KEY` (site key only) and redeploy.
4. Check Formspree's pricing page for any plan requirement. The setup guide does not state one.
5. Live test: submit with the widget solved (arrives) and confirm the form refuses to send when it is not solved.

Setup guide: https://help.formspree.io/hc/en-us/articles/46614263949331-Protecting-your-Forms-with-Cloudflare-Turnstile

## Formspree

1. Create a form on formspree.io (owner account) and set the notification email.
2. Check the current free-plan submission limits on Formspree's pricing page.
3. Enable spam filtering/reCAPTCHA options in the dashboard. The app already sends a `_gotcha` honeypot.
4. Restrict allowed domains in Formspree if the plan supports it.

## Domain and DNS

1. Buy the domain (owner).
2. Cloudflare Pages project → Custom domains → add the domain and follow the DNS instructions shown.
3. After the domain is live: set `VITE_SITE_URL` to it and redeploy. The build then generates canonical tags, `sitemap.xml`, the `Sitemap:` line in `robots.txt` and `llms.txt` automatically.

## Live test checklist

- [ ] Home, Journey, Services, Contact, FAQ, Privacy load. Direct URL loads and refresh work
- [ ] Each service button opens `/contact` with the matching service selected, and it can be changed
- [ ] Submit a real test enquiry: it arrives in your inbox; the success message shows only after it is sent
- [ ] With the endpoint disabled/offline, the form shows an error and not success
- [ ] Validation errors appear for empty and invalid fields
- [ ] Mobile layout and menu, keyboard-only navigation, visible focus
- [ ] Reduced-motion setting disables animation
- [ ] Disclaimer visible in the footer and hero; all placeholders replaced (`[` brackets and `TODO(owner)` are gone)
- [ ] Official links open the correct sites

## Search and AI visibility checklist (at launch)

- [ ] Replace every placeholder (`[Business Name]`, contact details) and set `VITE_NOINDEX` to `false`
- [ ] Set `VITE_SITE_URL` and redeploy; check `/sitemap.xml`, `/robots.txt` and `/llms.txt` load
- [ ] Add `public/og-image.png` (1200x630) and redeploy
- [ ] Add the site to Google Search Console and Bing Webmaster Tools, verify ownership and submit `sitemap.xml`
- [ ] Test pages with Google's Rich Results Test (FAQ, breadcrumbs) and a social share preview
- [ ] View page source of `/journey` and `/faq` to confirm each has its own title, canonical and structured data
- [ ] Keep content original and accurate; rankings and AI citations cannot be guaranteed
