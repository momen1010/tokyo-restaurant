import { useState } from 'react'
import Button from '../../shared/ui/Button.jsx'
import { useAuth } from './AuthProvider.jsx'
import { resendVerification } from './services/authService.js'

export default function AccountPage() {
  const { user, logout } = useAuth()
  const [sent, setSent] = useState(false)
  const resend = async () => { await resendVerification(user); setSent(true) }
  return (
    <div className="container-page max-w-lg space-y-5 py-12">
      <h1 className="text-4xl font-bold">حسابي</h1>
      <div className="space-y-2 rounded-xl border border-coal-line bg-coal p-5">
        <p><span className="text-paper/60">الاسم: </span>{user.displayName || '—'}</p>
        <p><span className="text-paper/60">الإيميل: </span><span dir="ltr">{user.email}</span></p>
        <p><span className="text-paper/60">التحقق من الإيميل: </span>{user.emailVerified ? 'تم' : 'لم يتم بعد'}</p>
        {!user.emailVerified && (sent ? <p className="text-sm text-paper/70">اتبعت رابط التحقق.</p>
          : <Button size="sm" variant="ghost" onClick={resend}>إعادة إرسال رابط التحقق</Button>)}
      </div>
      <Button variant="dark" onClick={logout}>تسجيل الخروج</Button>
    </div>
  )
}