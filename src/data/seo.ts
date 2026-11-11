// Per-page SEO copy. Titles ~50-60 chars, descriptions ~150-160 chars.
// TODO(owner): review wording once the business name and real service scope are final.
export interface PageMeta {
  title: string
  description: string
  keywords: string[]
  index?: boolean
  label: string
}

export const siteDescription =
  'Clear, honest guidance for students and parents on the journey to higher education in Germany: planning, applications, arrival preparation and job documents.'

export const baseKeywords = [
  'study in Germany',
  'Germany education guidance',
  'German university application help',
  'study abroad Germany',
  'Germany student journey',
  'career coach Germany',
]

export const pageMeta: Record<string, PageMeta> = {
  '/': {
    label: 'Home',
    title: 'Study in Germany: Guidance for Students and Parents',
    description: siteDescription,
    keywords: [...baseKeywords, 'Germany study consultant', 'education guidance for parents'],
  },
  '/journey': {
    label: 'The Journey',
    title: 'Study in Germany Step by Step: The Journey',
    description:
      'An eight-step guide to studying in Germany: goals, programmes, language tests, applications, budgeting, visa preparation, housing and enrolment, with official sources.',
    keywords: [...baseKeywords, 'how to study in Germany', 'Germany application timeline', 'uni-assist', 'DAAD', 'Germany student visa preparation'],
  },
  '/services': {
    label: 'Services',
    title: 'Services: Study Guidance, End-to-End Support, Job Documents',
    description:
      'Three ways to get help: Guidance for Study in Germany, a Full End-to-End Service, and Help with Job Documentation (CV and cover letter) for Germany-focused applications.',
    keywords: [...baseKeywords, 'Germany admission support', 'CV for Germany', 'cover letter Germany', 'Germany job application documents'],
  },
  '/contact': {
    label: 'Enquiry',
    title: 'Enquiry: Get Guidance on Studying in Germany',
    description:
      'Send an enquiry about studying in Germany or job documentation. Choose a service, tell us what help you need and we will reply by email.',
    keywords: ['contact Germany education advisor', 'Germany study enquiry', 'get guidance study in Germany'],
  },
  '/faq': {
    label: 'FAQ',
    title: 'FAQ: Studying in Germany, Answered for Parents and Students',
    description:
      'Practical answers on planning, language, costs, visas and our services, separating general guidance from official rules that change.',
    keywords: [...baseKeywords, 'Germany study FAQ', 'Germany student visa questions', 'is study in Germany free'],
  },
  '/privacy': {
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    description: 'How enquiry information sent through this website is collected, used and protected.',
    keywords: [],
  },
  '*': {
    label: 'Page not found',
    title: 'Page not found',
    description: 'This page could not be found.',
    keywords: [],
    index: false,
  },
}

export const routes = ['/', '/journey', '/services', '/contact', '/faq', '/privacy']

export function metaFor(path: string): PageMeta {
  return pageMeta[path] ?? pageMeta['*']
}
