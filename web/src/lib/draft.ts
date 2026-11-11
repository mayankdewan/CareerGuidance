import type { EnquiryValues } from './validation'

// In-memory only (never localStorage/sessionStorage): lets a visitor read the privacy
// policy and come back without retyping. Lost on page reload and cleared once restored.
let draft: EnquiryValues | null = null

export const saveDraft = (v: EnquiryValues) => { draft = { ...v } }
export const peekDraft = () => draft
export const clearDraft = () => { draft = null }
