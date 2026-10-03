import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onIdTokenChanged, signOut } from 'firebase/auth'
import { getAuthClient, isFirebaseConfigured } from '../../shared/firebase/client.js'

const AuthContext = createContext(null)
const signedOut = { user: null, role: null, isAdmin: false, loading: false }

/**
 * user + claims from the ID token. These flags drive UI only (menus, redirects).
 * Real enforcement = Firestore/Storage Rules + Cloud Functions, never this.
 * Without Firebase config it reports "signed out" so the public UI still runs.
 */
export function AuthProvider({ children }) {
  const [state, setState] = useState(isFirebaseConfigured ? { ...signedOut, loading: true } : signedOut)

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined
    // onIdTokenChanged (not onAuthStateChanged) also fires when the token refreshes, so new claims show up.
    return onIdTokenChanged(getAuthClient(), async (user) => {
      if (!user) return setState(signedOut)
      const { claims } = await user.getIdTokenResult()
      setState({ user, role: claims.role ?? null, isAdmin: claims.admin === true, loading: false })
    })
  }, [])

  const value = useMemo(() => ({
    ...state,
    // Force a fresh token so a just-granted/revoked claim applies without waiting up to ~1h.
    refreshRole: async () => {
      const u = isFirebaseConfigured ? getAuthClient().currentUser : null
      if (u) await u.getIdToken(true)
    },
    logout: () => (isFirebaseConfigured ? signOut(getAuthClient()) : Promise.resolve()),
  }), [state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)