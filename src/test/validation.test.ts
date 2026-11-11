import { emptyValues, validateAll, validateField, LIMITS } from '../lib/validation'

const valid = { ...emptyValues, name: 'A Person', email: 'a@b.co', service: 'guidance' as const, message: 'I need help planning.', consent: true }

describe('validation', () => {
  it('accepts a valid enquiry', () => expect(validateAll(valid)).toEqual({}))
  it('requires the five mandatory fields', () => {
    expect(Object.keys(validateAll(emptyValues)).sort()).toEqual(['consent', 'email', 'message', 'name', 'service'])
  })
  it('rejects bad email', () => expect(validateField('email', { ...valid, email: 'nope' })).toBeTruthy())
  it('rejects unknown service', () => expect(validateField('service', { ...valid, service: 'x' as never })).toBeTruthy())
  it('rejects over-long message', () => expect(validateField('message', { ...valid, message: 'a'.repeat(LIMITS.message + 1) })).toBeTruthy())
  it('validates optional phone only when present', () => {
    expect(validateField('phone', { ...valid, phone: '' })).toBeUndefined()
    expect(validateField('phone', { ...valid, phone: 'abc' })).toBeTruthy()
  })
})
