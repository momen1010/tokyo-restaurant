/**
 * Tracking repository — fetch orders for the signed-in customer.
 * Firestore rules enforce userId == auth.uid.
 */
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
  } from 'firebase/firestore'
  import { getDb } from '@/shared/firebase/client.js'
  
  const ORDERS = 'orders'
  
  /**
   * Subscribe to the current user's orders (real-time).
   * @param {string} userId
   * @param {(orders: Array) => void} onData
   * @param {(err: Error) => void} onError
   * @returns {() => void} unsubscribe
   */
  export function subscribeMyOrders(userId, onData, onError) {
    const db = getDb()
    const q = query(
      collection(db, ORDERS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
  
    return onSnapshot(
      q,
      (snap) => {
        const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        onData(orders)
      },
      (err) => {
        console.error('[trackingRepo] subscribeMyOrders error:', err)
        onError?.(err)
      }
    )
  }
  
  /**
   * Find a specific order by orderNumber (client-side filter of own orders).
   * @param {Array} orders
   * @param {string} orderNumber
   */
  export function findOrderByNumber(orders, orderNumber) {
    return orders.find((o) => o.orderNumber === orderNumber) ?? null
  }