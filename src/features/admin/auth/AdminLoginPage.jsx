import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../../shared/ui/Button.jsx'
import { TextField } from '../../../shared/ui/Fields.jsx'
import { isFirebaseConfigured } from '../../../shared/firebase/client.js'
import { useAuth } from '../../auth/AuthProvider.jsx'
import { signInStaff, authErrorMessage } from '../../auth/services/authService.js'

export default function AdminLoginPage() {
  const nav = useNavigate()
  const { state } = useLocation()
  const { user, isAdmin, loading, logout } = useAuth()
  const [f, setF] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => { if (!loading && user && isAdmin) nav(state?.from ?? '/admin', { replace: true }) }, [loading, user, isAdmin, nav, state])

  const submit = async () => {
    setBusy(true); setError(null)
    try { await signInStaff(f) } catch (e) { setError(authErrorMessage(e)) } finally { setBusy(false) }
  }
  if (!isFirebaseConfigured) return <p className="container-page py-16 text-paper/70">ضبط ملف .env الأول.</p>

  return (
    <div className="container-page max-w-md space-y-5 py-16">
      <h1 className="text-4xl font-bold">دخول الإدارة</h1>
      {user && !isAdmin && !loading ? (
        <div className="space-y-3">
          <p role="alert" className="text-blood-bright">الحساب ده ليس له صلاحية إدارة.</p>
          <Button variant="dark" onClick={logout}>تسجيل الخروج</Button>
        </div>
      ) : (
        <>
          <TextField label="الإيميل" type="email" dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
          <TextField label="كلمة السر" type="password" dir="ltr" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" />
          {error && <p role="alert" className="text-blood-bright">{error}</p>}
          <Button className="w-full" disabled={busy} onClick={submit}>دخول</Button>
        </>
      )}
    </div>
  )
}