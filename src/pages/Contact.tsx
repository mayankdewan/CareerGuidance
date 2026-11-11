import { useSearchParams } from 'react-router-dom'
import EnquiryForm from '../components/EnquiryForm'
import { site } from '../data/site'
import { useSeo } from '../lib/seo'

export default function Contact() {
  useSeo('/contact')
  const [params] = useSearchParams()
  const service = params.get('service')
  return (
    <section className="page-head">
      <div className="container contact-grid">
        <div data-reveal="up">
          <p className="eyebrow">Enquiry</p>
          <h1>Tell us how we can help.</h1>
          <p className="lead">Share a few details and we will reply by email. You can change the selected service at any time.</p>
          <p className="fine">Email: {site.email}<br />WhatsApp/Phone: {site.whatsapp}</p>
        </div>
        <div className="panel" data-reveal="up">
          <EnquiryForm key={service ?? 'none'} initialService={service} />
        </div>
      </div>
    </section>
  )
}
