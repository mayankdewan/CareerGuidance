# Germany Study Guidance Website

Marketing site for a small business helping families and students plan higher education in Germany.
React + TypeScript + Vite. Static hosting (Cloudflare Pages). Enquiries go to Formspree.

## Layout

- `web/` – the whole project: React site, docs and config. Version 1 has no backend; enquiries go to Formspree.

## Local development

```bash
cd web
npm install
cp .env.example .env     # then set VITE_FORMSPREE_ENDPOINT
npm run dev              # http://localhost:5173
npm run lint
npm run typecheck
npm test
npm run build            # output: web/dist
npm run preview
```

Without `VITE_FORMSPREE_ENDPOINT` the form shows an honest "not configured" error and never fakes success.

## Where to edit content

All business placeholders and copy live in `web/src/data/`:
`site.ts` (name, contact, legal), `services.ts`, `journey.ts`, `faq.ts`. Search the repo for `TODO(owner)`.

## Form and anti-spam

- Required: name, email, service (exactly three), description, privacy consent. Optional: phone, contact method, intake, education level.
- Honeypot field `_gotcha` is sent with each submission (supported by Formspree). Enable spam filtering in the Formspree dashboard.
- Cloudflare Turnstile is supported and turns on only when `VITE_TURNSTILE_SITE_KEY` is set. The widget produces a token that is sent as `cf-turnstile-response`; **Formspree verifies it** with the secret key you enter in the Formspree form settings (CAPTCHA → Cloudflare Turnstile). The secret key never goes in this repo. Without the site key there is no CAPTCHA, only the honeypot.
- There is **no** verified per-IP rate limit. Rate limiting depends on Formspree's own settings.
- Service CTAs link to `/contact?service=<guidance|end-to-end|job-docs>`, which preselects the service (editable).
- Form data is never logged to the console.

## Assumptions

- Optional About page not built: no real founder/team details were supplied.
- `sitemap.xml` and `og:url`/`og:image` are not generated yet: domain unknown.
- No external fonts, analytics or cookies. Typography uses system font stacks.
- Official links (DAAD, uni-assist, German missions in India, Make it in Germany) were not re-verified at build time. Check them before launch.
