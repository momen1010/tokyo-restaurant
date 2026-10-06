/**
 * Orders repository — writes to Firestore.
 * The server is the only writer (per Firestore rules).
 */
import { getDb, FieldValue, Timestamp } from '../lib/admin'
import type { PricedOrder } from '../domain/pricing'
import type { OrderStatus } from '../domain/orderStatus'

const ORDERS = 'orders'

export interface CreateOrderInput {
  customerId: string | null
  customerName: string
  customerPhone: string
  customerAddress: string
  customerNotes: string
  orderType: 'delivery' | 'pickup'
  paymentMethod: 'cash' | 'online'
  priced: PricedOrder
}

export interface CreateOrderResult {
  orderId: string
  orderNumber: string
  total: number
}

function generateOrderNumber(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `TOKYO-${y}${m}${d}-${rand}`
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const db = getDb()
  const orderNumber = generateOrderNumber()
  const status: OrderStatus = 'pending'

  const docRef = db.collection(ORDERS).doc()
  const now = Timestamp.now()

  const orderDoc = {
    orderNumber,
    status,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),

    customerId: input.customerId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerAddress: input.customerAddress,
    customerNotes: input.customerNotes,

    orderType: input.orderType,
    paymentMethod: input.paymentMethod,
    items: input.priced.lines.map((l) => ({
      productId: l.productId,
      productName: l.productName,
      variantId: l.variantId,
      variantName: l.variantName,
      addOnIds: l.addOnIds,
      addOnNames: l.addOnNames,
      qty: l.qty,
      unitPrice: l.unitPrice,
      lineTotal: l.lineTotal,
    })),
    subtotal: input.priced.subtotal,
    deliveryFee: input.priced.deliveryFee,
    discount: input.priced.discount,
    total: input.priced.total,

    timeline: [
      {
        status,
        at: now,
        by: input.customerId ?? 'guest',
      },
    ],
  }

  await docRef.set(orderDoc)

  return {
    orderId: docRef.id,
    orderNumber,
    total: input.priced.total,
  }
}