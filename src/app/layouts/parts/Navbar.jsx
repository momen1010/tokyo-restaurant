import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Wordmark from '../../../shared/ui/Wordmark.jsx'
import Drawer from '../../../shared/ui/Drawer.jsx'
import { useCart } from '../../../features/cart/CartProvider.jsx'
import { useAuth } from '../../../features/auth/AuthProvider.jsx'

// Hash targets (#offers, #why, #contact) are sections added in the next UI phases.
const LINKS = [
  { to: '/', label: 'الرئيسية', end: true },
  { to: '/menu', label: 'المنيو' },
  { to: '/#offers', label: 'العروض', hash: true },
  { to: '/#why', label: 'عن طوكيو', hash: true },
  { to: '/#contact', label: 'تواصل معنا', hash: true },
]
const base = 'relative px-3 py-2 font-medium transition-colors'
const active = ({ isActive }) => `${base} ${isActive ? 'text-blood-bright after:absolute after:inset-x-3 after:-bottom-[1px] after:h-0.5 after:bg-blood-bright' : 'text-paper/80 hover:text-white'}`

const Icon = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
)
const iconBtn = 'relative grid h-11 w-11 place-items-center rounded-md text-paper/90 hover:text-white hover:bg-coal-soft'

export default function Navbar() {
  const { count, openDrawer } = useCart()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  const items = (onClick) => LINKS.map((l) => (l.hash
    ? <Link key={l.to} to={l.to} onClick={onClick} className={`${base} text-paper/80 hover:text-white`}>{l.label}</Link>
    : <NavLink key={l.to} to={l.to} end={l.end} onClick={onClick} className={active}>{l.label}</NavLink>))

  return (
    <header className="sticky top-0 z-40 border-b border-coal-line bg-black/90 backdrop-blur" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      {/* flex-row-reverse: logo sits on the left and icons on the right, as in the approved design */}
      <div className="container-page flex h-16 flex-row-reverse items-center justify-between gap-4">
        <Link to="/" aria-label="طوكيو - الرئيسية" className="shrink-0"><Wordmark size="sm" /></Link>

        <nav aria-label="التنقل الرئيسي" className="hidden items-center md:flex">{items()}</nav>

        <div className="flex items-center gap-1">
          <button type="button" className={`${iconBtn} md:hidden`} aria-label="القائمة" onClick={() => setMenuOpen(true)}>
            <Icon><path d="M4 7h16M4 12h16M4 17h16" /></Icon>
          </button>
          <Link to={user ? '/account' : '/login'} className={iconBtn} aria-label={user ? 'حسابي' : 'تسجيل الدخول'}>
            <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></Icon>
          </Link>
          <button type="button" onClick={openDrawer} className={iconBtn} aria-label={`السلة، ${count} عناصر`}>
            <Icon><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6 5 3H2" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /></Icon>
            {count > 0 && <span className="absolute -top-0.5 -end-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-blood-bright px-1 text-xs font-bold">{count}</span>}
          </button>
        </div>
      </div>

      <Drawer open={menuOpen} onClose={close} title="القائمة">
        <nav aria-label="القائمة" className="flex flex-col gap-1 p-4 text-lg [&_a]:min-h-[48px] [&_a]:rounded-md [&_a]:px-4 [&_a]:py-3 [&_a:hover]:bg-coal-soft">
          {items(close)}
        </nav>
      </Drawer>
    </header>
  )
}