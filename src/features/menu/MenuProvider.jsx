import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadMenu } from './services/menuService.js'

const MenuContext = createContext(null)
const initial = { loading: true, error: null, categories: [], products: [], settings: null, source: null }

export function MenuProvider({ children }) {
  const [state, setState] = useState(initial)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    loadMenu()
      .then((m) => {
        if (import.meta.env.DEV) {
          console.log('[menu] source:', m.source, '| project:', import.meta.env.VITE_FIREBASE_PROJECT_ID,
            '| categories:', m.categories.length, '| products:', m.products.length)
        }
        if (alive) setState({ loading: false, error: null, ...m })
      })
      .catch((e) => {
        console.error('[menu] load failed:', e?.code, e?.message)
        if (alive) setState((s) => ({ ...s, loading: false, error: e }))
      })
    return () => { alive = false }
  }, [attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  const value = useMemo(() => ({
    ...state, reload,
    catalog: new Map(state.products.map((p) => [p.id, p])),
    sections: state.categories.map((c) => ({ ...c, products: state.products.filter((p) => p.categoryId === c.id) })),
    featured: state.categories.map((c) => state.products.find((p) => p.categoryId === c.id && p.isAvailable)).filter(Boolean),
  }), [state, reload])

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
export const useMenu = () => useContext(MenuContext)