import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import Navbar from './parts/Navbar.jsx'
import Footer from './parts/Footer.jsx'
import CartDrawer from '../../features/cart/components/CartDrawer.jsx'

export default function CustomerLayout() {
  const { hash, pathname } = useLocation()
  // Scroll to #section links (e.g. /#offers) after navigation.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash, pathname])

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <CartDrawer />
      <ScrollRestoration getKey={(l) => l.pathname} />
    </div>
  )
}