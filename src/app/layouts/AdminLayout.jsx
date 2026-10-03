import { Outlet } from 'react-router-dom'
import Button from '../../shared/ui/Button.jsx'
import { useAuth } from '../../features/auth/AuthProvider.jsx'

// Rendered only inside <RequireAdmin>. Pages here still call APIs that Rules/Functions protect.
export default function AdminLayout() {
  const { user, role, logout } = useAuth()
  return (
    <div className="min-h-[100dvh] bg-coal">
      <header className="flex items-center justify-between gap-3 border-b border-coal-line px-5 py-3">
        <span className="font-display text-xl">TOKYO | الإدارة</span>
        <div className="flex items-center gap-3 text-sm">
          <span dir="ltr" className="text-paper/70">{user?.email} ({role ?? 'admin'})</span>
          <Button size="sm" variant="ghost" onClick={logout}>خروج</Button>
        </div>
      </header>
      <main className="p-5"><Outlet /></main>
    </div>
  )
}