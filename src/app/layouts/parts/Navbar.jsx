import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Wordmark from '@/shared/ui/Wordmark.jsx'
import Drawer from '@/shared/ui/Drawer.jsx'
import IconButton from '@/shared/ui/IconButton.jsx'
import { useCart } from '@/features/cart/CartProvider.jsx'
import { useAuth } from '@/features/auth/AuthProvider.jsx'

const LINKS = [
  { to: '/', label: 'الرئيسية', end: true },
  { to: '/menu', label: 'المنيو' },
  { to: '/track-order', label: 'تتبع الطلب' },
  { to: '/#offers', label: 'العروض', hash: true },
  { to: '/#why', label: 'عن طوكيو', hash: true },
  { to: '/#contact', label: 'تواصل معنا', hash: true },
]

const base = 'relative px-3 py-2 font-medium transition-colors'
const active = ({ isActive }) =>
  `${base} ${
    isActive
      ? 'text-blood-bright after:absolute after:inset-x-3 after:-bottom-[1px] after:h-0.5 after:bg-blood-bright'
      : 'text-paper/80 hover:text-white'
  }`

const Icon = ({ children, size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
)

export default function Navbar() {
  const { count, openDrawer } = useCart()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  const items = (onClick) =>
    LINKS.map((l) =>
      l.hash ? (
        <Link
          key={l.to}
          to={l.to}
          onClick={onClick}
          className={`${base} text-paper/80 hover:text-white`}
        >
          {l.label}
        </Link>
      ) : (
        <NavLink key={l.to} to={l.to} end={l.end} onClick={onClick} className={active}>
          {l.label}
        </NavLink>
      )
    )

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-coal-line bg-black/95 backdrop-blur'
          : 'border-transparent bg-black/40 backdrop-blur-sm'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" aria-label="طوكيو - الرئيسية" className="shrink-0">
          <Wordmark size="sm" />
        </Link>

        {/* Nav links (desktop) */}
        <nav aria-label="التنقل الرئيسي" className="hidden items-center lg:flex">
          {items()}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-1">
          {/* Search (placeholder) */}
          <IconButton label="البحث" size="md" className="hidden sm:inline-grid">
            <Icon>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </Icon>
          </IconButton>

          {/* User / Login */}
          <IconButton
            to={user ? '/account' : '/login'}
            label={user ? 'حسابي' : 'تسجيل الدخول'}
            size="md"
          >
            <Icon>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" />
            </Icon>
          </IconButton>

          {/* Cart */}
          <IconButton label={`السلة، ${count} عناصر`} size="md" onClick={openDrawer}>
            <Icon>
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6 5 3H2" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </Icon>
            {count > 0 && (
              <span className="absolute -top-0.5 -end-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-blood-bright px-1 text-xs font-bold">
                {count}
              </span>
            )}
          </IconButton>

          {/* Hamburger (mobile) */}
          <IconButton
            label="القائمة"
            size="md"
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Icon>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </Icon>
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer open={menuOpen} onClose={close} title="القائمة">
        <nav
          aria-label="القائمة"
          className="flex flex-col gap-1 p-4 text-lg [&_a]:min-h-[48px] [&_a]:rounded-md [&_a]:px-4 [&_a]:py-3 [&_a:hover]:bg-coal-soft"
        >
          {items(close)}
        </nav>
      </Drawer>
    </header>
  )
}