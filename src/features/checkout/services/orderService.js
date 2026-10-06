/**
 * Order service — talks to the createOrderCallable Cloud Function.
 * The server re-prices everything; we only send product IDs + qty + customer data.
 */
import { httpsCallable } from 'firebase/functions'
import { getFunctionsClient } from '@/shared/firebase/client.js'

/** Convert a cart line into the minimal payload the server expects. */
function toRequestedLine(line) {
  return {
    productId: line.productId,
    variantId: line.variantId ?? null,
    addOnIds: Array.isArray(line.addOnIds) ? line.addOnIds : [],
    qty: line.qty,
  }
}

/**
 * Place an order.
 * @param {Object} input
 * @param {Array} input.items - cart items (with productId, variantId, addOnIds, qty)
 * @param {Object} input.customer - { name, phone, address, notes }
 * @param {'delivery'|'pickup'} input.orderType
 * @param {'cash'|'online'} input.paymentMethod
 * @returns {Promise<{ orderId: string, orderNumber: string, total: number }>}
 */
export async function placeOrder({ items, customer, orderType, paymentMethod }) {
  const fn = httpsCallable(getFunctionsClient(), 'createOrderCallable')

  const payload = {
    customerName: customer.name,
    customerPhone: customer.phone,
    customerAddress: customer.address ?? '',
    customerNotes: customer.notes ?? '',
    orderType,
    paymentMethod,
    items: items.map(toRequestedLine),
  }

  const res = await fn(payload)
  return res.data // { orderId, orderNumber, total }
}

/**
 * Turn a Firebase Functions error into a user-friendly Arabic message.
 * @param {unknown} err
 */
export function describeOrderError(err) {
  if (!err) return 'حدث خطأ غير متوقع.'
  const code = err.code || ''
  // httpsCallable wraps HttpsError as functions/<code>
  if (code.includes('invalid-argument')) return err.message || 'بيانات الطلب غير صحيحة.'
  if (code.includes('failed-precondition')) return err.message || 'مش قادر نكمل الطلب دلوقتي.'
  if (code.includes('not-found')) return err.message || 'في حاجة في طلبك مش متاحة.'
  if (code.includes('resource-exhausted')) return err.message || 'حاول تاني بعد شوي.'
  if (code.includes('unauthenticated')) return err.message || 'لازم تسجّل دخول الأول.'
  if (code.includes('permission-denied')) return err.message || 'مش مسموح بالعملية دي.'
  if (code.includes('internal')) return err.message || 'حدث خطأ داخلي، حاول تاني.'
  return err.message || 'حدث خطأ غير متوقع.'
}