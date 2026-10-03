import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'
import { isFirebaseConfigured } from '../../shared/firebase/client.js'
import Unauthorized from './Unauthorized.jsx'

// ROUTE GUARDS ARE UX ONLY. Anyone can read this code and call Firebase directly.
// The data stays safe because firestore.rules / storage.rules check the token's claims on the server.
const Msg = ({ children }) => <p className="container-page py-16 text-center text-paper/70">{children}</p>

function useGate() {
  const auth = useAuth()
  return { ...auth, loc: useLocation() }
}

export function RequireAuth({ children }) {
  const { user, loading, loc } = useGate()
  if (!isFirebaseConfigured) return <Msg>الحساب هيشتغل بعد ضبط ملف .env</Msg>
  if (loading) return <Msg>جاري التحميل...</Msg>
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return children
}

export function RequireAdmin({ children }) {
  const { user, isAdmin, loading, loc } = useGate()
  if (!isFirebaseConfigured) return <Msg>الإدارة هتشتغل بعد ضبط ملف .env</Msg>
  if (loading) return <Msg>جاري التحميل...</Msg>
  if (!user) return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />
  if (!isAdmin) return <Unauthorized />
  return children
}