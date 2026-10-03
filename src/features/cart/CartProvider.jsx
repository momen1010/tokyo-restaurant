import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { cartReducer, initialCart, loadCart } from './cartReducer.js'
import { addLine, estimateCart } from './domain/cartMath.js'
import { useMenu } from '../menu/MenuProvider.jsx'

const KEY = 'tokyo.cart.v1'
const CartContext = createContext(null)

function read() {
  try { return loadCart(JSON.parse(localStorage.getItem(KEY))) } catch { return initialCart }
}

export function CartProvider({ children }) {
  const { catalog, settings, loading, error } = useMenu()
  const [cart, dispatch] = useReducer(cartReducer, undefined, read)
  const [orderType, setOrderType] = useState('delivery')
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(cart)) } catch { /* storage unavailable */ } }, [cart])

  // Totals need the catalog; until it is loaded we expose ready=false instead of flagging every line as broken.
  const ready = !loading && !error
  const summary = useMemo(
    () => (ready ? estimateCart(cart.items, catalog, { orderType, settings }) : null),
    [ready, cart.items, catalog, orderType, settings])

  /** Returns an error code (invalid-item | cart-full | max-qty) or null on success. */
  const addItem = useCallback((item) => {
    const { error: err } = addLine(cart.items, item)
    if (!err) dispatch({ type: 'add', item })
    return err
  }, [cart.items])

  const value = useMemo(() => ({
    items: cart.items, summary, ready, orderType, setOrderType, addItem, drawerOpen,
    count: summary?.itemCount ?? cart.items.reduce((n, i) => n + i.qty, 0),
    setQty: (index, qty) => dispatch({ type: 'setQty', index, qty }),
    remove: (index) => dispatch({ type: 'remove', index }),
    removeInvalid: () => dispatch({ type: 'removeInvalid', invalidIndexes: (summary?.lines ?? []).flatMap((l, i) => (l.issue ? [i] : [])) }),
    clear: () => dispatch({ type: 'clear' }),
    openDrawer: () => setDrawerOpen(true), closeDrawer: () => setDrawerOpen(false),
  }), [cart.items, summary, ready, orderType, addItem, drawerOpen])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
export const useCart = () => useContext(CartContext)
