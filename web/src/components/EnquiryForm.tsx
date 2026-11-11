import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getService, services, type ServiceId } from '../data/services'
import Turnstile from './Turnstile'
import { clearDraft, peekDraft, saveDraft } from '../lib/draft'
import { getTurnstileSiteKey, submitEnquiry } from '../lib/submit'
import {
  LIMITS, emptyValues, validateAll, validateField,
  type EnquiryErrors, type EnquiryValues,
} from '../lib/validation'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function EnquiryForm({ initialService }: { initialService?: string | null }) {
  const [values, setValues] = useState<EnquiryValues>(() => peekDraft() ?? {
    ...emptyValues,
    service: getService(initialService)?.id ?? '',
  })
  // A restored draft is used once, then dropped from memory.
  useEffect(() => { clearDraft() }, [])
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const inFlight = useRef(false)
  const siteKey = getTurnstileSiteKey()
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState('')
  const [captchaNonce, setCaptchaNonce] = useState(0)

  const set = <K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K]) => {
    const next = { ...values, [key]: value }
    setValues(next)
    if (errors[key]) setErrors((e) => ({ ...e, [key]: validateField(key, next) }))
  }
  const text = (key: keyof EnquiryValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(key, e.target.value as never)
  const blur = (key: keyof EnquiryValues) => () => setErrors((e) => ({ ...e, [key]: validateField(key, values) }))

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (inFlight.current) return
    const found = validateAll(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    if (siteKey && !captchaToken) {
      setCaptchaError('Please complete the verification before sending.')
      return
    }
    setCaptchaError('')
    inFlight.current = true
    setStatus('submitting')
    setServerError('')
    const result = await submitEnquiry(values, honeypot, captchaToken ?? '')
    inFlight.current = false
    // Tokens are single-use: always get a fresh challenge after an attempt.
    setCaptchaToken(null)
    setCaptchaNonce((n) => n + 1)
    if (result.ok) {
      setStatus('success')
      setValues(emptyValues)
    } else {
      setStatus('error')
      setServerError(result.error)
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status">
        <h2>Thank you, your enquiry was sent.</h2>
        <p>We will reply by email as soon as we can. This is not an offer of admission or any guaranteed outcome.</p>
        <button type="button" className="btn btn-ghost" onClick={() => setStatus('idle')}>Send another enquiry</button>
      </div>
    )
  }

  const err = (k: keyof EnquiryValues) => errors[k]
  const aria = (k: keyof EnquiryValues) => ({
    'aria-invalid': err(k) ? true : undefined,
    'aria-describedby': err(k) ? `e-${k}` : undefined,
  })
  const busy = status === 'submitting'

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-busy={busy}>
      <p className="form-warn">
        Please <strong>do not</strong> include passport numbers, full academic records, visa files, dates of birth or children’s names.
      </p>

      <div className="field">
        <label htmlFor="f-name">Full name *</label>
        <input id="f-name" autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={text('name')} onBlur={blur('name')} {...aria('name')} />
        {err('name') && <p className="field-error" id="e-name">{err('name')}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-email">Email *</label>
        <input id="f-email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={values.email} onChange={text('email')} onBlur={blur('email')} {...aria('email')} />
        {err('email') && <p className="field-error" id="e-email">{err('email')}</p>}
      </div>

      <fieldset className="field" aria-describedby={err('service') ? 'e-service' : undefined}>
        <legend>Which service are you interested in? *</legend>
        <div className="radio-cards">
          {services.map((s) => (
            <label key={s.id} className={`radio-card${values.service === s.id ? ' is-selected' : ''}`}>
              <input
                id={s.id === services[0].id ? 'f-service' : undefined}
                type="radio" name="service" value={s.id}
                checked={values.service === s.id}
                onChange={() => set('service', s.id as ServiceId)}
              />
              <span>{s.title}</span>
            </label>
          ))}
        </div>
        {err('service') && <p className="field-error" id="e-service">{err('service')}</p>}
      </fieldset>

      <div className="field">
        <label htmlFor="f-message">What help do you need? *</label>
        <textarea id="f-message" rows={5} maxLength={LIMITS.message} value={values.message} onChange={text('message')} onBlur={blur('message')} {...aria('message')} />
        <p className="hint">{values.message.length}/{LIMITS.message}</p>
        {err('message') && <p className="field-error" id="e-message">{err('message')}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-phone">Phone / WhatsApp (optional)</label>
          <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} value={values.phone} onChange={text('phone')} onBlur={blur('phone')} {...aria('phone')} />
          {err('phone') && <p className="field-error" id="e-phone">{err('phone')}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-contactMethod">Preferred contact (optional)</label>
          <select id="f-contactMethod" value={values.contactMethod} onChange={text('contactMethod')}>
            <option value="">No preference</option>
            <option value="Email">Email</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Phone call">Phone call</option>
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-intake">Intended intake / year (optional)</label>
          <input id="f-intake" maxLength={LIMITS.intake} placeholder="e.g. Winter 2027" value={values.intake} onChange={text('intake')} />
        </div>
        <div className="field">
          <label htmlFor="f-education">Current education level (optional)</label>
          <select id="f-education" value={values.education} onChange={text('education')}>
            <option value="">Select…</option>
            <option>School (Grades 9–12)</option>
            <option>Undergraduate</option>
            <option>Postgraduate</option>
            <option>Working professional</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div className="hp" aria-hidden="true">
        <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
      </div>

      <div className="field">
        <label className="check">
          <input id="f-consent" type="checkbox" checked={values.consent} onChange={(e) => set('consent', e.target.checked)} {...aria('consent')} />
          <span>I have read the <Link to="/privacy" state={{ fromForm: true }} onClick={() => saveDraft(values)}>privacy policy</Link> and agree to be contacted about my enquiry. *</span>
        </label>
        {err('consent') && <p className="field-error" id="e-consent">{err('consent')}</p>}
      </div>

      {siteKey && (
        <div className="field">
          <Turnstile key={captchaNonce} siteKey={siteKey} onToken={(t) => { setCaptchaToken(t); if (t) setCaptchaError('') }} />
          {captchaError && <p className="field-error" role="alert">{captchaError}</p>}
        </div>
      )}

      {status === 'error' && <p className="form-error" role="alert">{serverError}</p>}

      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}
