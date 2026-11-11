import { serviceIds, type ServiceId } from '../data/services'

export const LIMITS = { name: 100, email: 254, phone: 30, message: 1000, intake: 40, other: 60 }
export const MIN_MESSAGE = 10

export interface EnquiryValues {
  name: string
  email: string
  service: ServiceId | ''
  message: string
  consent: boolean
  phone: string
  contactMethod: string
  intake: string
  education: string
}

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>

export const emptyValues: EnquiryValues = {
  name: '', email: '', service: '', message: '', consent: false,
  phone: '', contactMethod: '', intake: '', education: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+()\d][\d\s()+-]{5,}$/

export function validateField(key: keyof EnquiryValues, v: EnquiryValues): string | undefined {
  switch (key) {
    case 'name':
      if (!v.name.trim()) return 'Please enter your full name.'
      if (v.name.length > LIMITS.name) return `Name must be ${LIMITS.name} characters or fewer.`
      return
    case 'email':
      if (!v.email.trim()) return 'Please enter your email address.'
      if (!EMAIL_RE.test(v.email.trim()) || v.email.length > LIMITS.email) return 'Please enter a valid email address.'
      return
    case 'service':
      if (!v.service) return 'Please choose a service.'
      if (!serviceIds.includes(v.service)) return 'Please choose one of the listed services.'
      return
    case 'message':
      if (v.message.trim().length < MIN_MESSAGE) return `Please describe what help you need (at least ${MIN_MESSAGE} characters).`
      if (v.message.length > LIMITS.message) return `Please keep this under ${LIMITS.message} characters.`
      return
    case 'consent':
      return v.consent ? undefined : 'Please confirm you have read the privacy policy.'
    case 'phone':
      if (v.phone.trim() && !PHONE_RE.test(v.phone.trim())) return 'Please enter a valid phone number.'
      return
    default:
      return
  }
}

export const requiredKeys: (keyof EnquiryValues)[] = ['name', 'email', 'service', 'message', 'consent']
const allKeys: (keyof EnquiryValues)[] = [...requiredKeys, 'phone']

export function validateAll(v: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {}
  for (const k of allKeys) {
    const e = validateField(k, v)
    if (e) errors[k] = e
  }
  return errors
}
