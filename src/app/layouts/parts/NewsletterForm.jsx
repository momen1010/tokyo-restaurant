import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'success' | 'error'

  const submit = (e) => {
    e.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!valid) {
      setStatus('error')
      return
    }
    // TODO: connect to backend (Firebase collection / Mailchimp / etc.)
    console.log('[newsletter] subscribe:', email)
    setStatus('success')
    setEmail('')
    setTimeout(() => setStatus(null), 4000)
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md" noValidate>
      <label htmlFor="newsletter-email" className="mb-2 block text-sm font-bold text-white">
        اشترك في نشرتنا البريدية
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus(null) }}
          placeholder="بريدك الإلكتروني"
          className="min-h-[48px] flex-1 rounded-md border border-coal-line bg-coal-soft px-4 text-paper placeholder:text-paper/40 focus:border-blood-bright focus:outline-none"
        />
        <button
          type="submit"
          className="min-h-[48px] rounded-md bg-blood px-5 font-bold text-white transition-colors hover:bg-blood-bright"
        >
          اشترك
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className="mt-2 min-h-[1.25rem] text-sm"
      >
        {status === 'success' && <span className="text-emerald-400">✓ تم الاشتراك بنجاح</span>}
        {status === 'error' && <span className="text-blood-bright">✗ من فضلك أدخل بريدًا صحيحًا</span>}
      </p>
    </form>
  )
}