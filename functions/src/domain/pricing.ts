// Pure pricing: no Firebase imports, so it is unit-testable. All amounts are integer piasters.
export interface Variant { id: string; priceDelta: number }
export interface AddOn { id: string; price: number; maxQty: number }
export interface Product { id: string; basePrice: number; isActive: boolean; isAvailable: boolean; variants: Variant[]; addOns: AddOn[] }
export interface CartLine { productId: string; variantId?: string; addOnIds: string[]; qty: number }
export interface PricingSettings { deliveryFee: number; taxRate: number; serviceFeeRate: number }
export interface Pricing { subtotal: number; discount: number; deliveryFee: number; tax: number; total: number }

export class PricingError extends Error {}
const MAX_QTY = 20, MAX_LINES = 30

export function priceOrder(lines: CartLine[], catalog: Map<string, Product>, type: 'delivery' | 'pickup', s: PricingSettings) {
  if (!lines.length || lines.length > MAX_LINES) throw new PricingError('invalid-cart-size')
  let subtotal = 0
  const priced = lines.map((l) => {
    const p = catalog.get(l.productId)
    if (!p || !p.isActive || !p.isAvailable) throw new PricingError(`unavailable:${l.productId}`)
    if (!Number.isInteger(l.qty) || l.qty < 1 || l.qty > MAX_QTY) throw new PricingError('invalid-qty')
    const v = l.variantId ? p.variants.find((x) => x.id === l.variantId) : undefined
    if (l.variantId && !v) throw new PricingError('invalid-variant')
    if (new Set(l.addOnIds).size !== l.addOnIds.length) throw new PricingError('duplicate-addon')
    const addOnTotal = l.addOnIds.reduce((sum, id) => {
      const a = p.addOns.find((x) => x.id === id)
      if (!a) throw new PricingError('invalid-addon')
      return sum + a.price
    }, 0)
    const unitPrice = p.basePrice + (v?.priceDelta ?? 0) + addOnTotal
    const lineTotal = unitPrice * l.qty
    subtotal += lineTotal
    return { productId: l.productId, variantId: l.variantId ?? null, addOnIds: l.addOnIds, qty: l.qty, unitPrice, lineTotal }
  })
  const discount = 0 // coupons/loyalty: later phase
  const deliveryFee = type === 'delivery' ? s.deliveryFee : 0
  const tax = Math.round((subtotal - discount) * s.taxRate)
  const total = subtotal - discount + deliveryFee + tax
  const pricing: Pricing = { subtotal, discount, deliveryFee, tax, total }
  return { lines: priced, pricing }
}
