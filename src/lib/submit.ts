import { getService } from '../data/services'
import type { EnquiryValues } from './validation'

export type SubmitResult = { ok: true } | { ok: false; error: string }

export function getEndpoint(): string {
  return (import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined)?.trim() ?? ''
}

export function getTurnstileSiteKey(): string {
  return (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() ?? ''
}

// Never logs form contents. Only reports success when the server returns a 2xx response.
// captchaToken is verified by Formspree (secret key lives in the Formspree dashboard).
export async function submitEnquiry(values: EnquiryValues, honeypot: string, captchaToken = ''): Promise<SubmitResult> {
  const endpoint = getEndpoint()
  if (!endpoint.startsWith('https://')) {
    return { ok: false, error: 'The enquiry form is not configured yet. Please contact us by email instead.' }
  }
  const title = getService(values.service)?.title ?? ''
  const body = new FormData()
  const fields: Record<string, string> = {
    name: values.name.trim(),
    email: values.email.trim(),
    service: title,
    message: values.message.trim(),
    privacy_consent: 'yes',
    phone: values.phone.trim(),
    preferred_contact: values.contactMethod,
    intended_intake: values.intake.trim(),
    education_level: values.education,
    _gotcha: honeypot,
    _subject: `New enquiry: ${title}`,
  }
  for (const [k, v] of Object.entries(fields)) body.append(k, v)
  if (captchaToken) body.append('cf-turnstile-response', captchaToken)
  try {
    const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body })
    if (res.ok) return { ok: true }
    if (res.status === 429) return { ok: false, error: 'Too many submissions. Please wait a moment and try again.' }
    return { ok: false, error: 'We could not send your enquiry. Please try again or contact us by email.' }
  } catch {
    return { ok: false, error: 'Network error. Please check your connection and try again.' }
  }
}
