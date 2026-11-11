export type ServiceId = 'guidance' | 'end-to-end' | 'job-docs'

export interface Service {
  id: ServiceId
  title: string
  summary: string
  forWhom: string
  includes: string[]
  notIncluded: string[]
}

// TODO(owner): confirm the exact scope of each service before launch.
export const services: Service[] = [
  {
    id: 'guidance',
    title: 'Guidance for Study in Germany',
    summary: 'A focused consultation to turn a broad idea into a realistic plan.',
    forWhom: 'Families and students at the start who want clarity before committing to anything.',
    includes: [
      'Consultation on goals, subject and degree level',
      'Pathway planning (language, timing, budget awareness)',
      'Guidance on researching universities and programmes',
      'A written application roadmap to follow yourself',
    ],
    notIncluded: ['Preparing or submitting applications on your behalf', 'Any promise of admission'],
  },
  {
    id: 'end-to-end',
    title: 'Full End-to-End Service',
    summary: 'Broader support from first plan through to arrival preparation.',
    forWhom: 'Families who want structured support at every stage.',
    includes: [
      'Everything in Guidance, plus ongoing planning support',
      'Application document preparation support',
      'Submission guidance and deadline tracking',
      'Pre-departure and arrival preparation',
    ],
    notIncluded: ['Guarantee of admission or visa approval', 'Legal or immigration advice'],
  },
  {
    id: 'job-docs',
    title: 'Help with Job Documentation',
    summary: 'Application-ready documents for Germany-focused job applications.',
    forWhom: 'Students and graduates preparing to apply for jobs or internships in Germany.',
    includes: [
      'CV / resume tailored for the German market',
      'Cover letter drafting support',
      'Review of supporting documents',
      'Application-readiness check',
    ],
    notIncluded: ['Job placement or employer introductions', 'Work visa assistance or approval'],
  },
]

export const serviceIds = services.map((s) => s.id)

export function getService(id: string | null | undefined): Service | undefined {
  return services.find((s) => s.id === id)
}
