export interface JourneyLink {
  label: string
  href: string
}

export interface JourneyStep {
  title: string
  short: string
  body: string
  checklist: string[]
  links: JourneyLink[]
}

const DAAD = { label: 'DAAD – Study in Germany', href: 'https://www.daad.de/en/' }
const UNI_ASSIST = { label: 'uni-assist', href: 'https://www.uni-assist.de/en/' }
const MISSIONS = { label: 'German Missions in India', href: 'https://india.diplo.de/' }
const MIG = { label: 'Make it in Germany', href: 'https://www.make-it-in-germany.com/en/' }

export const journeySteps: JourneyStep[] = [
  {
    title: 'Define your goals',
    short: 'Subject, degree, language',
    body: 'Start with the person, not the country. What does the student want to study, at what level (Bachelor’s or Master’s), and in which language of instruction? Honest answers here save months later.',
    checklist: ['Interests and strengths', 'Degree level and subject area', 'English- or German-taught programmes', 'Family expectations and constraints'],
    links: [DAAD],
  },
  {
    title: 'Research institutions and programmes',
    short: 'Find recognised options',
    body: 'Germany has public and private institutions. Check that the institution and programme are recognised, then read each programme’s own entry requirements carefully. Eligibility is decided by the university, so verify it with them.',
    checklist: ['Shortlist programmes', 'Confirm recognition and accreditation', 'Read entry requirements on the programme page', 'Note tuition policy per institution'],
    links: [DAAD],
  },
  {
    title: 'Language tests, documents and planning',
    short: 'Prepare the application',
    body: 'Language tests, academic documents and timelines depend on the programme. Some documents need certified copies or translations, which can take time, so plan backwards from deadlines.',
    checklist: ['Required language certificates', 'Academic transcripts and certificates', 'Statement of purpose / CV if requested', 'A calendar of deadlines'],
    links: [DAAD, UNI_ASSIST],
  },
  {
    title: 'Apply and evaluate offers',
    short: 'Routes, deadlines, offers',
    body: 'Some universities take applications directly; many use uni-assist or their own portal. Deadlines differ by programme and intake. When offers arrive, compare them against your goals and budget, and check any conditions.',
    checklist: ['Confirm the application route per university', 'Submit before each deadline', 'Track responses', 'Read offer conditions closely'],
    links: [UNI_ASSIST, DAAD],
  },
  {
    title: 'Budget, funding and finances',
    short: 'Plan the money',
    body: 'Living costs, funding options and any blocked-account requirement are set by official sources and change over time. We deliberately show no figures here; check the current amounts with the official sources below.',
    checklist: ['Estimate tuition (if any) and living costs', 'Explore scholarships and funding', 'Check current financial-proof rules', 'Plan how money will be transferred'],
    links: [DAAD, MISSIONS],
  },
  {
    title: 'Visa and residence preparation',
    short: 'Official documents',
    body: 'Visa rules depend on nationality, programme and circumstances. Use the German mission’s official checklist, prepare documents early and double-check each one. No adviser can promise a visa outcome.',
    checklist: ['Read the official checklist', 'Book appointments early', 'Check every document against the list', 'Keep copies'],
    links: [MISSIONS, MIG],
  },
  {
    title: 'Housing, insurance and travel',
    short: 'Arrival planning',
    body: 'Student housing can be in high demand, so begin early. Health insurance is required in Germany, and the right type depends on your situation. Plan travel and first-week essentials.',
    checklist: ['Apply for student housing or search privately', 'Arrange health insurance per official guidance', 'Book travel', 'Prepare an arrival-week plan'],
    links: [DAAD, MIG],
  },
  {
    title: 'Enrol and settle in',
    short: 'Begin your studies',
    body: 'On arrival you will typically register your address, complete enrolment and handle residence formalities. Your university’s international office is the best first contact.',
    checklist: ['Enrol at the university', 'Register your address as required', 'Handle residence permit formalities', 'Meet the international office'],
    links: [DAAD, MIG],
  },
]

export const journeyNote =
  'The order of these steps varies by applicant and programme. Some steps overlap, and some may not apply to you.'
