import { useState } from 'react'
import Button from '../../shared/ui/Button.jsx'
import { useAuth } from './AuthProvider.jsx'

export default function Unauthorized() {
  const { user, refreshRole, logout } = useAuth()
  const [busy, setBusy] = useState(false)
  const refresh = async () => { setBusy(true); try { await refreshRole() } finally { setBusy(false) } }
  return (
    <div className="container-page max-w-md space-y-4 py-16 text-center">
      <p className="font-display text-6xl text-blood-bright">403</p>
      <h1 className="text-3xl font-bold">غير مصرّح لك</h1>
      <p className="text-paper/70">الحساب <span dir="ltr">{user?.email}</span> ليس لديه صلاحية الدخول للإدارة.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="ghost" disabled={busy} onClick={refresh}>تحديث الصلاحيات</Button>
        <Button variant="dark" onClick={logout}>تسجيل الخروج</Button>
        <Button to="/">الرئيسية</Button>
      </div>
    </div>
  )
}