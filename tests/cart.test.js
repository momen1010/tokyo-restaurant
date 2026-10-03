import { test } from 'node:test'
import assert from 'node:assert/strict'
import { addLine, setLineQty, removeLine, sanitizeItems, estimateCart, normalizeLine, LIMITS } from '../src/features/cart/domain/cartMath.js'
import { estimateDelivery } from '../src/features/cart/domain/deliveryPolicy.js'
import { estimateDiscount } from '../src/features/cart/domain/discountPolicy.js'
import { cartReducer, initialCart } from '../src/features/cart/cartReducer.js'

const catalog = new Map([
  ['crepe', { id: 'crepe', isAvailable: true, basePrice: 7500, variants: [{ id: 'm', priceDelta: 0 }, { id: 'l', priceDelta: 2000 }], addOns: [{ id: 'cheese', name: 'c', price: 1000 }, { id: 'sauce', name: 's', price: 500 }] }],
  ['sand', { id: 'sand', isAvailable: true, basePrice: 6000, variants: [], addOns: [] }],
  ['off', { id: 'off', isAvailable: false, basePrice: 5000, variants: [], addOns: [] }],
])
const L = (o) => ({ productId: 'sand', qty: 1, addOnIds: [], ...o })
const settings = { deliveryFee: 3000 }

test('add: new line, then merge identical line', () => {
  let r = addLine([], L({ qty: 2 })); assert.equal(r.items.length, 1)
  r = addLine(r.items, L({ qty: 3 })); assert.equal(r.items.length, 1); assert.equal(r.items[0].qty, 5)
})
test('add: add-on order does not create a duplicate line', () => {
  let r = addLine([], L({ productId: 'crepe', variantId: 'm', addOnIds: ['cheese', 'sauce'] }))
  r = addLine(r.items, L({ productId: 'crepe', variantId: 'm', addOnIds: ['sauce', 'cheese'] }))
  assert.equal(r.items.length, 1); assert.equal(r.items[0].qty, 2)
})
test('add: different variant/add-ons are separate lines', () => {
  let r = addLine([], L({ productId: 'crepe', variantId: 'm' }))
  r = addLine(r.items, L({ productId: 'crepe', variantId: 'l' }))
  r = addLine(r.items, L({ productId: 'crepe', variantId: 'm', addOnIds: ['cheese'] }))
  assert.equal(r.items.length, 3)
})
test('add: duplicate add-on ids are deduped', () => {
  assert.deepEqual(normalizeLine(L({ addOnIds: ['x', 'x'] })).addOnIds, ['x'])
})
test('qty: clamped to MAX_QTY on add and merge; max-qty error when nothing changes', () => {
  assert.equal(addLine([], L({ qty: 999 })).items[0].qty, LIMITS.MAX_QTY)
  let r = addLine([], L({ qty: 19 })); r = addLine(r.items, L({ qty: 5 })); assert.equal(r.items[0].qty, 20)
  const again = addLine(r.items, L({ qty: 1 })); assert.equal(again.error, 'max-qty'); assert.equal(again.items, r.items)
})
test('qty: invalid inputs rejected (0, negative, NaN, string, missing id)', () => {
  for (const bad of [0, -3, NaN, 'abc', undefined, Infinity]) assert.equal(addLine([], L({ qty: bad })).error, 'invalid-item')
  assert.equal(addLine([], { qty: 1 }).error, 'invalid-item')
  assert.equal(addLine([], null).error, 'invalid-item')
})
test('qty: fractional is floored; "3" string coerced', () => {
  assert.equal(addLine([], L({ qty: 2.9 })).items[0].qty, 2)
  assert.equal(addLine([], L({ qty: '3' })).items[0].qty, 3)
})
test('setQty: update, clamp, 0 removes, NaN ignored, bad index ignored', () => {
  const base = addLine([], L({ qty: 2 })).items
  assert.equal(setLineQty(base, 0, 5)[0].qty, 5)
  assert.equal(setLineQty(base, 0, 500)[0].qty, 20)
  assert.equal(setLineQty(base, 0, 0).length, 0)
  assert.equal(setLineQty(base, 0, -1).length, 0)
  assert.equal(setLineQty(base, 0, NaN), base)
  assert.equal(setLineQty(base, 7, 3), base); assert.equal(setLineQty(base, -1, 3), base); assert.equal(setLineQty(base, 0.5, 3), base)
})
test('remove: valid, out-of-range, empty', () => {
  const base = addLine(addLine([], L()).items, L({ productId: 'crepe', variantId: 'm' })).items
  assert.equal(removeLine(base, 0).length, 1); assert.equal(removeLine(base, 5), base); assert.deepEqual(removeLine([], 0), [])
})
test('cart-full: more than MAX_LINES distinct lines rejected', () => {
  let items = []
  for (let i = 0; i < LIMITS.MAX_LINES; i++) items = addLine(items, L({ productId: `p${i}` })).items
  const r = addLine(items, L({ productId: 'extra' })); assert.equal(r.error, 'cart-full'); assert.equal(r.items.length, LIMITS.MAX_LINES)
})
test('sanitize: corrupted / hostile storage data', () => {
  assert.deepEqual(sanitizeItems(null), []); assert.deepEqual(sanitizeItems('x'), []); assert.deepEqual(sanitizeItems({}), [])
  const out = sanitizeItems([L({ qty: 2 }), L({ qty: 3 }), { productId: 5 }, null, L({ qty: -1 }), L({ price: 1, qty: 1, productId: 'crepe', variantId: 'm' })])
  assert.equal(out.length, 2); assert.equal(out[0].qty, 5); assert.ok(!('price' in out[1]))
})
test('estimate: empty cart = 0 everywhere, no delivery fee', () => {
  const e = estimateCart([], catalog, { orderType: 'delivery', settings })
  assert.deepEqual([e.subtotal, e.deliveryFee, e.total, e.itemCount], [0, 0, 0, 0])
})
test('estimate: subtotal with variant + add-ons + qty (integer math)', () => {
  const items = [L({ productId: 'crepe', variantId: 'l', addOnIds: ['cheese', 'sauce'], qty: 2 }), L({ qty: 1 })]
  const e = estimateCart(items, catalog, { orderType: 'delivery', settings })
  assert.equal(e.subtotal, (7500 + 2000 + 1000 + 500) * 2 + 6000)
  assert.equal(e.deliveryFee, 3000); assert.equal(e.total, e.subtotal + 3000); assert.ok(Number.isInteger(e.total))
})
test('estimate: pickup has no delivery fee', () => {
  assert.equal(estimateCart([L()], catalog, { orderType: 'pickup', settings }).deliveryFee, 0)
})
test('estimate: unavailable / removed / bad variant / bad add-on / missing variant are excluded and flagged', () => {
  const items = [L({ productId: 'off' }), L({ productId: 'ghost' }), L({ productId: 'crepe', variantId: 'zzz' }),
    L({ productId: 'crepe', variantId: 'm', addOnIds: ['nope'] }), L({ productId: 'crepe' }), L()]
  const e = estimateCart(items, catalog, { orderType: 'pickup', settings })
  assert.deepEqual(e.lines.map((l) => l.issue), ['unavailable', 'not-found', 'invalid-variant', 'invalid-addon', 'variant-required', null])
  assert.equal(e.subtotal, 6000); assert.equal(e.hasIssues, true); assert.equal(e.itemCount, 1)
})
test('estimate: only invalid lines -> subtotal 0 -> no delivery fee charged', () => {
  const e = estimateCart([L({ productId: 'off' })], catalog, { orderType: 'delivery', settings })
  assert.equal(e.total, 0)
})
test('estimate: client-supplied price fields are ignored', () => {
  const e = estimateCart([{ ...L(), price: 1, unitPrice: 1, total: 1 }], catalog, { orderType: 'pickup', settings })
  assert.equal(e.subtotal, 6000)
})
test('delivery: default fee when settings missing/invalid; free-over threshold', () => {
  assert.equal(estimateDelivery({ subtotal: 100, orderType: 'delivery', settings: null }), 3000)
  assert.equal(estimateDelivery({ subtotal: 100, orderType: 'delivery', settings: { deliveryFee: -5 } }), 3000)
  assert.equal(estimateDelivery({ subtotal: 20000, orderType: 'delivery', settings: { deliveryFee: 3000, freeDeliveryOver: 20000 } }), 0)
  assert.equal(estimateDelivery({ subtotal: 19999, orderType: 'delivery', settings: { deliveryFee: 3000, freeDeliveryOver: 20000 } }), 3000)
})
test('discount: only displays a sane server amount (never negative, never > subtotal, ignores junk)', () => {
  assert.equal(estimateDiscount(10000, null), 0); assert.equal(estimateDiscount(10000, { discount: -5 }), 0)
  assert.equal(estimateDiscount(10000, { discount: '50' }), 0); assert.equal(estimateDiscount(10000, { discount: 1.5 }), 0)
  assert.equal(estimateDiscount(10000, { discount: 99999 }), 10000); assert.equal(estimateDiscount(10000, { discount: 1500 }), 1500)
  const e = estimateCart([L({ qty: 2 })], catalog, { orderType: 'delivery', settings, serverQuote: { discount: 2000 } })
  assert.equal(e.total, 12000 - 2000 + 3000)
})
test('reducer: add/setQty/remove/clear and unknown action', () => {
  let s = cartReducer(initialCart, { type: 'add', item: L({ qty: 2 }) })
  s = cartReducer(s, { type: 'setQty', index: 0, qty: 4 }); assert.equal(s.items[0].qty, 4)
  assert.equal(cartReducer(s, { type: 'nope' }), s)
  assert.equal(cartReducer(s, { type: 'remove', index: 0 }).items.length, 0)
  assert.equal(cartReducer(s, { type: 'clear' }).items.length, 0)
})
