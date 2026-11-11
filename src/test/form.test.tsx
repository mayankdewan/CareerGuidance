import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import EnquiryForm from '../components/EnquiryForm'

const wrap = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>)

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), 'Test Person')
  await user.type(screen.getByLabelText(/^email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/what help do you need/i), 'Please help me plan my application.')
  await user.click(screen.getByLabelText(/privacy policy/i))
}

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('EnquiryForm', () => {
  it('preselects the service from props and keeps it editable', async () => {
    const user = userEvent.setup()
    wrap(<EnquiryForm initialService="job-docs" />)
    expect((screen.getByLabelText('Help with Job Documentation') as HTMLInputElement).checked).toBe(true)
    await user.click(screen.getByLabelText('Full End-to-End Service'))
    expect((screen.getByLabelText('Full End-to-End Service') as HTMLInputElement).checked).toBe(true)
  })

  it('offers exactly three services', () => {
    wrap(<EnquiryForm />)
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('preselects from the URL when routed to /contact?service=end-to-end', () => {
    render(<MemoryRouter initialEntries={['/contact?service=end-to-end']}><App /></MemoryRouter>)
    expect((screen.getByLabelText('Full End-to-End Service') as HTMLInputElement).checked).toBe(true)
  })

  it('shows inline errors and does not submit when invalid', async () => {
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test')
    wrap(<EnquiryForm />)
    await userEvent.setup().click(screen.getByRole('button', { name: /send enquiry/i }))
    expect(screen.queryByText(/enter your full name/i)).not.toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows success only after a 2xx response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 }); vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test')
    const user = userEvent.setup()
    wrap(<EnquiryForm initialService="guidance" />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))
    await waitFor(() => expect(screen.queryByText(/your enquiry was sent/i)).not.toBeNull())
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe('https://formspree.io/f/test')
  })

  it('shows an error on server failure and does not claim success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test')
    const user = userEvent.setup()
    wrap(<EnquiryForm initialService="guidance" />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not send/i)
    expect(screen.queryByText(/your enquiry was sent/i)).toBeNull()
  })

  it('shows an error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test')
    const user = userEvent.setup()
    wrap(<EnquiryForm initialService="guidance" />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/network error/i)
  })

  it('refuses to fake success when the endpoint is not configured', async () => {
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', '')
    const user = userEvent.setup()
    wrap(<EnquiryForm initialService="guidance" />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/not configured/i)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('EnquiryForm with Turnstile enabled', () => {
  afterEach(() => { delete window.turnstile })

  it('blocks submission until the challenge is solved', async () => {
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test')
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'site-key')
    window.turnstile = { render: () => 'id', remove: vi.fn() }
    const user = userEvent.setup()
    wrap(<EnquiryForm initialService="guidance" />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))
    expect(await screen.findByText(/complete the verification/i)).not.toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends the Turnstile token to Formspree once solved', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 }); vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test')
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'site-key')
    window.turnstile = {
      render: (_el: HTMLElement, o: Record<string, unknown>) => { (o.callback as (t: string) => void)('tok-123'); return 'id' },
      remove: vi.fn(),
    }
    const user = userEvent.setup()
    wrap(<EnquiryForm initialService="guidance" />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const body = fetchMock.mock.calls[0][1].body as FormData
    expect(body.get('cf-turnstile-response')).toBe('tok-123')
  })
})

describe('privacy policy round trip', () => {
  it('keeps typed answers when visiting the privacy page and going back', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/contact']}><App /></MemoryRouter>)
    await user.type(screen.getByLabelText(/full name/i), 'Round Trip')
    await user.type(screen.getByLabelText(/what help do you need/i), 'Keep this message please.')
    await user.click(screen.getByRole('link', { name: /privacy policy/i }))
    await user.click(await screen.findByRole('button', { name: /back to the enquiry form/i }))
    expect((await screen.findByLabelText(/full name/i) as HTMLInputElement).value).toBe('Round Trip')
    expect((screen.getByLabelText(/what help do you need/i) as HTMLTextAreaElement).value).toBe('Keep this message please.')
  })

  it('does not restore stale answers on a fresh visit', () => {
    render(<MemoryRouter initialEntries={['/contact']}><App /></MemoryRouter>)
    expect((screen.getByLabelText(/full name/i) as HTMLInputElement).value).toBe('')
  })
})
