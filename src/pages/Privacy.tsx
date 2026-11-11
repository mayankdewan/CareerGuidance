import { useLocation, useNavigate } from 'react-router-dom'
import { site } from '../data/site'
import { useSeo } from '../lib/seo'

export default function Privacy() {
  const fromForm = (useLocation().state as { fromForm?: boolean } | null)?.fromForm
  const navigate = useNavigate()
  useSeo('/privacy')
  return (
    <section className="page-head">
      <div className="container narrow prose" data-reveal="up">
        {fromForm && (
          <p className="back-bar">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back to the enquiry form</button>
            <span className="fine">Your answers are kept for now and are not sent anywhere.</span>
          </p>
        )}
        <p className="eyebrow">Draft for owner and legal review</p>
        <h1>Privacy Policy</h1>
        <p><em>Last updated: [TODO(owner): date]. This is a draft template and not legal advice. Have it reviewed before publishing.</em></p>
        <h2>Who we are</h2>
        <p>{site.legalEntity}. Contact: {site.email}.</p>
        <h2>What we collect</h2>
        <p>Through the enquiry form: your name, email, selected service, message, and optionally phone/WhatsApp, preferred contact method, intended intake and education level. Please do not submit passport numbers, full academic records, visa files, dates of birth or children’s names.</p>
        <h2>Why we use it</h2>
        <p>To reply to your enquiry and discuss the service you asked about. Legal basis: [TODO(owner/legal): e.g. consent / legitimate interest].</p>
        <h2>Who processes it</h2>
        <p>Form submissions are delivered through Formspree (a third-party form service) and then to our email. The site is hosted on Cloudflare Pages. [TODO(owner): confirm processors, locations and transfer safeguards.]</p>
        <h2>Cookies and analytics</h2>
        <p>This site does not set tracking cookies or use analytics by default. [TODO(owner): update if this changes.]</p>
        <h2>How long we keep it</h2>
        <p>[TODO(owner): retention period, e.g. “up to X months after our last contact”.]</p>
        <h2>Your rights</h2>
        <p>You may ask to access, correct or delete your data by emailing {site.email}. [TODO(legal): add rights applicable to your jurisdiction and any complaint authority.]</p>
      </div>
    </section>
  )
}
