import { Link } from 'react-router-dom'
import { faqs } from '../data/faq'
import { useSeo } from '../lib/seo'

export default function Faq() {
  useSeo('FAQ', 'Practical answers for parents and students about studying in Germany, separating general guidance from official rules.')
  return (
    <>
      <section className="page-head">
        <div className="container narrow" data-reveal="up">
          <p className="eyebrow">FAQ</p>
          <h1>Frequently asked questions</h1>
          <p className="lead">Answers marked “Official rules” depend on rules that change. Always verify them with the university or German authorities.</p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          {faqs.map((f) => (
            <details key={f.q} className="faq" data-reveal="left">
              <summary>{f.q} <span className={`tag tag-${f.type}`}>{f.type === 'official' ? 'Official rules' : 'General guidance'}</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
          <p><Link to="/contact" className="btn btn-primary">Ask your own question</Link></p>
        </div>
      </section>
    </>
  )
}
