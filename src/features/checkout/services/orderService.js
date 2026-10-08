/**
 * Order service — WhatsApp-only mode (no Cloud Functions).
 * Prices are computed client-side (already validated by the server previously).
 * Orders are stored locally and sent via WhatsApp for manual processing.
 */

/** Generate a short human-readable order number: TOKYO-YYYYMMDD-XXXX. */
export function generateOrderNumber() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `TOKYO-${y}${m}${d}-${rand}`
}

/**
 * "Place" an order locally. No network call.
 * Returns the same shape the Cloud Function used to return.
 */
export async function placeOrder({ items, customer, orderType, paymentMethod, totals }) {
  const orderNumber = generateOrderNumber()
  const order = {
    orderNumber,
    customerName: customer.name,
    customerPhone: customer.phone,
    customerAddress: customer.address ?? '',
    customerNotes: customer.notes ?? '',
    orderType,
    paymentMethod,
    items: items.map((i) => ({
      productId: i.productId,
      variantId: i.variantId ?? null,
      addOnIds: i.addOnIds ?? [],
      qty: i.qty,
    })),
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    total: totals.total,
    createdAt: new Date().toISOString(),
    status: 'pending',
  }

  // Store locally so the user can revisit (last 20 orders)
  try {
    const KEY = 'tokyo.orders.v1'
    const prev = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    const next = [order, ...prev].slice(0, 20)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* localStorage unavailable — ignore */
  }

  return {
    orderId: orderNumber,
    orderNumber,
    total: totals.total,
  }
}

export function describeOrderError(err) {
  return err?.message || 'حدث خطأ غير متوقع.'
}