import { NavLink, Outlet } from 'react-router-dom'
import Button from '@/shared/ui/Button.jsx'
import { useAuth } from '@/features/auth/AuthProvider.jsx'

const LINKS = [
  { to: '/admin', label: 'الطلبات', end: true },
  { to: '/admin/products', label: 'المنتجات' },
  { to: '/admin/categories', label: 'الأقسام' },   // ← لو موجود
  { to: '/admin/settings', label: 'الإعدادات' },   // ← جديد
]

const navCls = ({ isActive }) =>
  `px-4 py-2 text-sm font-bold rounded-md transition-colors ${
    isActive ? 'bg-blood text-white' : 'text-paper/70 hover:text-white'
  }`

export default function AdminLayout() {
  const { user, role, logout } = useAuth()
  return (
    <div className="min-h-[100dvh] bg-coal">
      <header className="border-b border-coal-line">
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <span className="font-display text-xl">TOKYO | الإدارة</span>
          <div className="flex items-center gap-3 text-sm">
            <span dir="ltr" className="hidden text-paper/70 sm:inline">
              {user?.email} ({role ?? 'admin'})
            </span>
            <Button size="sm" variant="ghost" onClick={logout}>
              خروج
            </Button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex gap-2 overflow-x-auto px-5 pb-3">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={navCls}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="p-5">
        <Outlet />
      </main>
    </div>
  )
}