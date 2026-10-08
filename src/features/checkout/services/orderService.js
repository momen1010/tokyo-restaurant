/**
 * Order service — writes orders to Firestore.
 * Supports guest checkout (userId = null) and logged-in customers.
 *
 * Security: Firestore Rules validate schema + totals + status.
 * Prices are NOT validated server-side yet (no Cloud Functions on Spark plan).
 */
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getDb, getAuthClient } from '@/shared/firebase/client.js'

/**
 * Place an order.
 * @returns {Promise<{ orderId: string, orderNumber: string, total: number }>}
 */
export async function placeOrder({ items, customer, orderType, paymentMethod, totals }) {
  const auth = getAuthClient()
  const user = auth.currentUser // could be null (guest)

  const db = getDb()
  const ordersRef = collection(db, 'orders')

  // Order number generated client-side (informational only)
  const orderNumber = generateOrderNumber()

  // Sanitize items — only fields the rules allow
  const sanitizedItems = items.map((i) => ({
    productId: String(i.productId),
    variantId: i.variantId ?? null,
    addOnIds: Array.isArray(i.addOnIds) ? i.addOnIds : [],
    qty: Number(i.qty) || 1,
    // Snapshot of price at time of order (informational — not trusted by rules)
    price: Number(i.price ?? 0),
  }))

  const payload = {
    userId: user?.uid ?? null, // ← null for guests
    customer: {
      name: String(customer.name ?? '').trim(),
      phone: String(customer.phone ?? '').replace(/\s/g, ''),
      address: String(customer.address ?? '').trim(),
    },
    items: sanitizedItems,
    subtotal: Math.round(Number(totals.subtotal) || 0),
    deliveryFee: Math.round(Number(totals.deliveryFee) || 0),
    total: Math.round(Number(totals.total) || 0),
    paymentMethod,
    orderType,
    status: 'new',
    notes: String(customer.notes ?? '').trim().slice(0, 500),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(ordersRef, payload)

  return {
    orderId: docRef.id,
    orderNumber,
    total: payload.total,
  }
}

function generateOrderNumber() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `TOKYO-${y}${m}${d}-${rand}`
}

export function describeOrderError(err) {
  if (!err) return 'حدث خطأ غير متوقع.'
  const code = err?.code || ''
  if (code.includes('permission-denied')) {
    return 'تعذر إتمام الطلب. راجع البيانات وحاول تاني.'
  }
  if (code.includes('unavailable')) {
    return 'في مشكلة في الاتصال. حاول تاني.'
  }
  if (code.includes('failed-precondition')) {
    return 'الطلب مش صالح. راجع البيانات وحاول تاني.'
  }
  return err.message || 'حدث خطأ غير متوقع.'
}