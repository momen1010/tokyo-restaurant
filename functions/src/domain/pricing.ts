/**
 * Pricing engine — pure functions only.
 * Money is in integer piasters (1 EGP = 100 piasters). Never use floats.
 *
 * Trust boundary: prices here come from the DATABASE (server-side),
 * never from the client. The client only sends product IDs + quantities.
 */
import { validationError } from '../lib/errors'

/** A line the client requested. Only IDs + qty — no prices. */
export interface RequestedLine {
  productId: string
  variantId: string | null
  addOnIds: string[]
  qty: number
}

/** Server-side product shape (from Firestore). */
export interface ServerVariant {
  id: string
  name: string
  priceDelta: number
}

export interface ServerAddOn {
  id: string
  name: string
  price: number
}

export interface ServerProduct {
  id: string
  name: string
  basePrice: number
  isAvailable: boolean
  variants: ServerVariant[]
  addOns: ServerAddOn[]
}

export interface PricingSettings {
  deliveryFee: number
  freeDeliveryOver: number | null
}

/** A fully-resolved line after server pricing. */
export interface PricedLine {
  productId: string
  productName: string
  variantId: string | null
  variantName: string | null
  addOnIds: string[]
  addOnNames: string[]
  qty: number
  unitPrice: number
  lineTotal: number
}

export interface PricedOrder {
  lines: PricedLine[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
}

/**
 * Compute the final priced order.
 * @throws AppError if any product/variant/addOn is invalid or unavailable.
 */
export function computePricing(
  requested: RequestedLine[],
  catalog: Map<string, ServerProduct>,
  settings: PricingSettings,
  orderType: 'delivery' | 'pickup'
): PricedOrder {
  if (requested.length === 0) {
    throw validationError('السلة فاضية.', { field: 'items' })
  }

  const lines: PricedLine[] = requested.map((line) => {
    const product = catalog.get(line.productId)
    if (!product) {
      throw validationError(`المنتج "${line.productId}" غير موجود.`, {
        field: 'items',
        productId: line.productId,
      })
    }
    if (!product.isAvailable) {
      throw validationError(`المنتج "${product.name}" غير متاح حالياً.`, {
        field: 'items',
        productId: product.id,
      })
    }

    let unitPrice = product.basePrice
    let variantName: string | null = null
    if (product.variants.length > 0) {
      if (!line.variantId) {
        throw validationError(`لازم تختار الحجم للمنتج "${product.name}".`, {
          field: 'items',
          productId: product.id,
        })
      }
      const v = product.variants.find((x) => x.id === line.variantId)
      if (!v) {
        throw validationError(`الحجم المختار لـ"${product.name}" غير متاح.`, {
          field: 'items',
          productId: product.id,
        })
      }
      unitPrice += v.priceDelta
      variantName = v.name
    } else if (line.variantId) {
      throw validationError(`المنتج "${product.name}" ليس له أحجام.`, {
        field: 'items',
        productId: product.id,
      })
    }

    const addOnNames: string[] = []
    for (const addOnId of line.addOnIds) {
      const a = product.addOns.find((x) => x.id === addOnId)
      if (!a) {
        throw validationError(`إضافة غير متاحة لـ"${product.name}".`, {
          field: 'items',
          productId: product.id,
          addOnId,
        })
      }
      unitPrice += a.price
      addOnNames.push(a.name)
    }

    if (!Number.isInteger(line.qty) || line.qty < 1) {
      throw validationError('الكمية يجب أن تكون 1 على الأقل.', {
        field: 'items',
        productId: product.id,
      })
    }

    return {
      productId: product.id,
      productName: product.name,
      variantId: line.variantId,
      variantName,
      addOnIds: line.addOnIds,
      addOnNames,
      qty: line.qty,
      unitPrice,
      lineTotal: unitPrice * line.qty,
    }
  })

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)

  let deliveryFee = 0
  if (orderType === 'delivery') {
    const threshold = settings.freeDeliveryOver
    deliveryFee = threshold !== null && subtotal >= threshold ? 0 : settings.deliveryFee
  }

  const discount = 0
  const total = Math.max(0, subtotal + deliveryFee - discount)

  return { lines, subtotal, deliveryFee, discount, total }
}