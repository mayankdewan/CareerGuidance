import ServiceCards from '../components/ServiceCards'
import { disclaimer } from '../data/site'
import { useSeo } from '../lib/seo'

export default function Services() {
  useSeo('/services')
  return (
    <>
      <section className="page-head">
        <div className="container narrow" data-reveal="up">
          <p className="eyebrow">Services</p>
          <h1>Three services, clearly different.</h1>
          <p className="lead">Pick the one that matches where you are. Not sure? Send an enquiry and we will help you choose.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ServiceCards detailed />
          <p className="fine center" data-reveal="up">{disclaimer}</p>
          <p className="fine center">TODO(owner): confirm the exact inclusions of each service before launch.</p>
        </div>
      </section>
    </>
  )
}
