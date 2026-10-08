/**
 * Admin orders repository.
 * All calls require auth + admin claim (Firestore rules enforce this).
 */
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
  } from 'firebase/firestore'
  import { getDb } from '@/shared/firebase/client.js'
  
  const ORDERS = 'orders'
  
  /**
   * Subscribe to recent orders, optionally filtered by status.
   * @param {{ status?: string, max?: number }} options
   * @param {(orders: Array) => void} onData
   * @param {(err: Error) => void} onError
   * @returns {() => void} unsubscribe
   */
  export function subscribeOrders({ status, max = 100 } = {}, onData, onError) {
    const db = getDb()
    const base = collection(db, ORDERS)
  
    const constraints = []
    if (status) constraints.push(where('status', '==', status))
    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(max))
  
    const q = query(base, ...constraints)
  
    return onSnapshot(
      q,
      (snap) => {
        const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        onData(orders)
      },
      (err) => {
        console.error('[adminOrdersRepo] subscribeOrders error:', err)
        onError?.(err)
      }
    )
  }
  
  /**
   * Fetch one order by ID.
   */
  export async function getOrder(orderId) {
    const db = getDb()
    const ref = doc(db, ORDERS, orderId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
  }
  
  /**
   * Update order status (admin only — rules enforce).
   */
  export async function updateOrderStatus(orderId, newStatus) {
    const db = getDb()
    const ref = doc(db, ORDERS, orderId)
    await updateDoc(ref, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    })
  }
  
  /**
   * Count orders by status (client-side aggregation of subscribed data).
   * For small shops, subscribeOrders + local filter is enough.
   */
  export function computeStats(orders) {
    const stats = {
      total: orders.length,
      new: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
      revenue: 0, // sum of totals for delivered orders
    }
    for (const o of orders) {
      if (stats[o.status] !== undefined) stats[o.status]++
      if (o.status === 'delivered') stats.revenue += o.total ?? 0
    }
    return stats
  }