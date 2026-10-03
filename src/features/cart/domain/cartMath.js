// Pure cart logic. UI-free and Firebase-free so it is fully unit-testable.
// Cart holds INTENT only (ids, qty, choices). Every total here is an ESTIMATE for display;
// the server re-prices everything from Firestore at order time and is the only source of truth.
import { estimateDelivery } from './deliveryPolicy.js'
import { estimateDiscount } from './discountPolicy.js'

export const LIMITS = Object.freeze({ MAX_QTY: 20, MAX_LINES: 30 })
const clampQty = (n) => Math.min(Math.max(n, 1), LIMITS.MAX_QTY)

/** Returns a clean line or null if the input is unusable. Dedupes + sorts add-ons, floors qty, clamps to MAX_QTY. */
export function normalizeLine(raw) {
  if (!raw || typeof raw.productId !== 'string' || !raw.productId) return null
  const qty = Math.floor(Number(raw.qty))
  if (!Number.isFinite(qty) || qty < 1) return null
  const addOnIds = [...new Set((Array.isArray(raw.addOnIds) ? raw.addOnIds : []).filter((x) => typeof x === 'string' && x))].sort()
  const variantId = typeof raw.variantId === 'string' && raw.variantId ? raw.variantId : null
  return { productId: raw.productId, variantId, addOnIds, qty: clampQty(qty) }
}
export const lineKey = (l) => JSON.stringify([l.productId, l.variantId ?? null, l.addOnIds])

/** Adds or merges a line. Returns { items, error } where error is null | invalid-item | cart-full | max-qty. */
export function addLine(items, raw) {
  const n = normalizeLine(raw)
  if (!n) return { items, error: 'invalid-item' }
  const i = items.findIndex((x) => lineKey(x) === lineKey(n))
  if (i >= 0) {
    const qty = clampQty(items[i].qty + n.qty)
    if (qty === items[i].qty) return { items, error: 'max-qty' }
    const next = items.slice(); next[i] = { ...items[i], qty }
    return { items: next, error: null }
  }
  if (items.length >= LIMITS.MAX_LINES) return { items, error: 'cart-full' }
  return { items: [...items, n], error: null }
}
export const removeLine = (items, index) =>
  Number.isInteger(index) && index >= 0 && index < items.length ? items.filter((_, i) => i !== index) : items

/** qty < 1 removes the line; NaN / bad index are ignored; qty is clamped to MAX_QTY. */
export function setLineQty(items, index, qty) {
  if (!Number.isInteger(index) || index < 0 || index >= items.length) return items
  const q = Math.floor(Number(qty))
  if (!Number.isFinite(q)) return items
  if (q < 1) return removeLine(items, index)
  const next = items.slice(); next[index] = { ...items[index], qty: clampQty(q) }
  return next
}
/** Rebuild a cart from untrusted data (e.g. localStorage). Drops junk, merges duplicates, caps line count. */
export const sanitizeItems = (raw) =>
  Array.isArray(raw) ? raw.reduce((acc, r) => addLine(acc, r).items, []) : []

/** Validate one line against the catalog (Map<productId, product>) and price it. */
export function resolveLine(line, catalog) {
  const product = catalog.get(line.productId)
  if (!product) return { line, product: null, issue: 'not-found' }
  if (!product.isAvailable) return { line, product, issue: 'unavailable' }
  const variant = line.variantId ? product.variants.find((v) => v.id === line.variantId) : null
  if (line.variantId && !variant) return { line, product, issue: 'invalid-variant' }
  if (!line.variantId && product.variants.length) return { line, product, issue: 'variant-required' }
  let addOnTotal = 0
  const addOns = []
  for (const id of line.addOnIds) {
    const a = product.addOns.find((x) => x.id === id)
    if (!a) return { line, product, issue: 'invalid-addon' }
    addOns.push(a); addOnTotal += a.price
  }
  const unitPrice = product.basePrice + (variant?.priceDelta ?? 0) + addOnTotal
  return { line, product, variant, addOns, unitPrice, lineTotal: unitPrice * line.qty, issue: null }
}

/** Display estimate. Lines with issues are excluded from totals. All amounts: integer piasters. */
export function estimateCart(items, catalog, { orderType = 'delivery', settings = null, serverQuote = null } = {}) {
  const lines = items.map((l) => resolveLine(l, catalog))
  const valid = lines.filter((l) => !l.issue)
  const subtotal = valid.reduce((s, l) => s + l.lineTotal, 0)
  const discount = estimateDiscount(subtotal, serverQuote)
  const deliveryFee = estimateDelivery({ subtotal: subtotal - discount, orderType, settings })
  return {
    lines, subtotal, discount, deliveryFee, total: subtotal - discount + deliveryFee,
    itemCount: valid.reduce((n, l) => n + l.line.qty, 0),
    hasIssues: lines.some((l) => l.issue), isEstimate: true,
  }
}
