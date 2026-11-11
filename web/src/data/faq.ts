export interface Faq {
  q: string
  a: string
  type: 'general' | 'official'
}

export const faqs: Faq[] = [
  { type: 'general', q: 'When should we start planning?', a: 'Earlier is generally easier. Language preparation, documents and deadlines take time, so many families start well over a year before the intended start. Your own timeline depends on the programme.' },
  { type: 'general', q: 'Can you guarantee admission?', a: 'No. Admission decisions are made by universities. We help you prepare and plan; we cannot promise any outcome.' },
  { type: 'official', q: 'Do I need German language skills?', a: 'It depends on the programme. Some are taught in English, others in German. The programme page states the language requirement, so confirm it with the university.' },
  { type: 'official', q: 'Is study in Germany free?', a: 'Tuition policy differs by institution and state, and other costs still apply. Check the current rules for your chosen university and the official sources.' },
  { type: 'official', q: 'What are the visa requirements?', a: 'They are set by German authorities and can change. Use the official German mission website for current requirements. We can help you get organised but cannot promise a visa outcome.' },
  { type: 'general', q: 'Which service is right for us?', a: 'If you want a plan to follow yourselves, Guidance fits. If you want broader support through the process, consider the Full End-to-End Service. For job applications, choose Help with Job Documentation. Not sure? Send an enquiry and describe your situation.' },
  { type: 'general', q: 'Can you help my child find a job in Germany?', a: 'We help prepare CVs, cover letters and supporting documents. We do not place candidates or promise job offers or work visas.' },
  { type: 'general', q: 'What should I not send in the enquiry form?', a: 'Please do not send passport numbers, full academic records, visa files, dates of birth or children’s names. We will tell you how to share documents safely if needed.' },
]
