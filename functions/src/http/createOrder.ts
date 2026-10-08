/**
 * createOrder — the single entry point for placing an order.
 */
import { onCall, CallableRequest } from 'firebase-functions/v2/https'
import { logger } from 'firebase-functions/v2'
import { toHttpsError, validationError } from '../lib/errors'
import {
  assertPlainObject,
  assertArray,
  assertNonEmptyString,
  assertPhone,
} from '../lib/validators'
import { computePricing, type RequestedLine, type ServerProduct } from '../domain/pricing'
import { getProductsByIds } from '../repositories/productsRepo'
import { getPricingSettings } from '../repositories/settingsRepo'
import { createOrder, type CreateOrderResult } from '../repositories/ordersRepo'

interface CreateOrderPayload {
  customerName: string
  customerPhone: string
  customerAddress: string
  customerNotes: string
  orderType: 'delivery' | 'pickup'
  paymentMethod: 'cash' | 'online'
  items: RequestedLine[]
}

function parsePayload(data: unknown): CreateOrderPayload {
  const obj = assertPlainObject(data, 'payload', 'بيانات الطلب غير صحيحة.')

  const customerName = assertNonEmptyString(
    obj.customerName,
    'customerName',
    'الاسم مطلوب.',
    { min: 3, max: 120 }
  )
  const customerPhone = assertPhone(obj.customerPhone, 'customerPhone')
  const customerNotes = typeof obj.customerNotes === 'string' ? obj.customerNotes.slice(0, 500) : ''

  const orderType = obj.orderType === 'pickup' ? 'pickup' : 'delivery'
  const customerAddress =
    orderType === 'delivery'
      ? assertNonEmptyString(
          obj.customerAddress,
          'customerAddress',
          'العنوان مطلوب.',
          { min: 10, max: 500 }
        )
      : typeof obj.customerAddress === 'string'
      ? obj.customerAddress.slice(0, 500)
      : ''

  const paymentMethod = obj.paymentMethod === 'online' ? 'online' : 'cash'

  const items = assertArray<RequestedLine>(
    obj.items,
    'items',
    'قائمة المنتجات مطلوبة.',
    { min: 1, max: 50 }
  ).map((raw, idx) => {
    const line = assertPlainObject(raw, `items[${idx}]`, 'عنصر في السلة غير صحيح.')
    const productId = assertNonEmptyString(
      line.productId,
      `items[${idx}].productId`,
      'معرّف المنتج مطلوب.'
    )
    const variantId =
      line.variantId === null || line.variantId === undefined
        ? null
        : assertNonEmptyString(
            line.variantId,
            `items[${idx}].variantId`,
            'معرّف الحجم غير صحيح.'
          )
    const addOnIds = Array.isArray(line.addOnIds)
      ? (line.addOnIds as unknown[]).filter((x): x is string => typeof x === 'string')
      : []
    const qty =
      typeof line.qty === 'number' && Number.isInteger(line.qty) && line.qty >= 1 && line.qty <= 99
        ? line.qty
        : 1

    return { productId, variantId, addOnIds, qty }
  })

  return {
    customerName,
    customerPhone,
    customerAddress,
    customerNotes,
    orderType,
    paymentMethod,
    items,
  }
}

export const createOrderCallable = onCall(
  {
    region: 'us-central1',
    enforceAppCheck: false,
    cors: [
      // Local dev
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      // Production (Vercel)
      'https://tokyo-restaurant-eight.vercel.app',
      'https://tokyo-restaurant-bfpeh33wl-memo70931-6754.vercel.app',
      // Vercel preview deployments (regex not supported here — add specific ones as needed)
    ],
  },
  async (req: CallableRequest<unknown>): Promise<CreateOrderResult> => {
    try {
      const payload = parsePayload(req.data)
      const customerId = req.auth?.uid ?? null

      const ids = payload.items.map((i) => i.productId)
      const catalog: Map<string, ServerProduct> = await getProductsByIds(ids)
      const settings = await getPricingSettings()
      const priced = computePricing(payload.items, catalog, settings, payload.orderType)

      const result = await createOrder({
        customerId,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        customerAddress: payload.customerAddress,
        customerNotes: payload.customerNotes,
        orderType: payload.orderType,
        paymentMethod: payload.paymentMethod,
        priced,
      })

      logger.info('order created', {
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        total: result.total,
        itemCount: payload.items.length,
        customerId,
      })

      return result
    } catch (err) {
      throw toHttpsError(err)
    }
  }
)