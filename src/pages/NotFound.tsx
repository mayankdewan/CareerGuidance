import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'

export default function NotFound() {
  useSeo('Page not found', 'This page could not be found.')
  return (
    <section className="page-head">
      <div className="container narrow">
        <h1>Page not found</h1>
        <p><Link to="/">Back to the home page</Link></p>
      </div>
    </section>
  )
}
