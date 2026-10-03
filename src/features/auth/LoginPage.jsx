import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../shared/ui/Button.jsx'
import { TextField } from '../../shared/ui/Fields.jsx'
import { isFirebaseConfigured } from '../../shared/firebase/client.js'
import { useAuth } from './AuthProvider.jsx'
import { signIn, signUp, signInGoogle, authErrorMessage } from './services/authService.js'

export default function LoginPage() {
  const nav = useNavigate()
  const { state } = useLocation()
  const { user, loading } = useAuth()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  // Already signed in, or just signed in: go back to where the user came from.
  useEffect(() => { if (!loading && user) nav(state?.from ?? '/', { replace: true }) }, [loading, user, nav, state])

  const run = async (fn) => {
    setBusy(true); setError(null)
    try { await fn() } catch (e) { setError(authErrorMessage(e)) } finally { setBusy(false) }
  }
  if (!isFirebaseConfigured) return <p className="container-page py-16 text-paper/70">تسجيل الدخول هيشتغل بعد ضبط ملف .env (راجع .env.example).</p>

  return (
    <div className="container-page max-w-md space-y-5 py-12">
      <h1 className="text-4xl font-bold">{mode === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}</h1>
      {mode === 'signup' && <TextField label="الاسم" value={f.name} onChange={set('name')} autoComplete="name" />}
      <TextField label="الإيميل" type="email" dir="ltr" value={f.email} onChange={set('email')} autoComplete="email" />
      <TextField label="كلمة السر" type="password" dir="ltr" value={f.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
      {error && <p role="alert" className="text-blood-bright">{error}</p>}
      <Button className="w-full" disabled={busy} onClick={() => run(() => (mode === 'login' ? signIn(f) : signUp(f)))}>
        {mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
      </Button>
      <Button className="w-full" variant="ghost" disabled={busy} onClick={() => run(signInGoogle)}>الدخول بحساب جوجل</Button>
      <button type="button" className="min-h-[44px] text-paper/70 hover:text-white" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'معندكش حساب؟ سجّل' : 'عندك حساب؟ ادخل'}
      </button>
    </div>
  )
}