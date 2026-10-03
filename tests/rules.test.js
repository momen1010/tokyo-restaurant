// Run: npm run test:rules  (needs Java + Firebase emulators; see README)
import { readFileSync } from 'node:fs'
import { test, before, after, beforeEach } from 'node:test'
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore'

let env
const anon = () => env.unauthenticatedContext().firestore()
const as = (uid, claims = {}) => env.authenticatedContext(uid, claims).firestore()
const admin = () => as('adm', { admin: true, role: 'admin' })
const kitchen = () => as('kit', { role: 'kitchen' })

before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-tokyo-rules', firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 } })
})
after(() => env.cleanup())
beforeEach(async () => {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore()
    await setDoc(doc(db, 'categories/c1'), { name: 'كريب', sortOrder: 1, isActive: true })
    await setDoc(doc(db, 'products/p1'), { name: 'A', basePrice: 7500, categoryId: 'c1', isActive: true, isAvailable: true })
    await setDoc(doc(db, 'products/hidden'), { name: 'B', basePrice: 1, categoryId: 'c1', isActive: false, isAvailable: true })
    await setDoc(doc(db, 'settings/public'), { deliveryFee: 3000 })
    await setDoc(doc(db, 'settings/private'), { autoConfirm: false })
    await setDoc(doc(db, 'customers/alice'), { displayName: 'Alice', phone: '', addresses: [], loyaltyBalance: 10 })
    await setDoc(doc(db, 'customers/bob'), { displayName: 'Bob', phone: '', addresses: [], loyaltyBalance: 0 })
    await setDoc(doc(db, 'orders/o1'), { customerId: 'alice', status: 'pending', total: 100 })
    await setDoc(doc(db, 'orders/o2'), { customerId: 'bob', status: 'pending', total: 100 })
    await setDoc(doc(db, 'orders/o1/private/contact'), { phone: '010', address: 'x' })
    await setDoc(doc(db, 'coupons/SAVE10'), { type: 'percent', value: 10 })
    await setDoc(doc(db, 'auditLogs/a1'), { action: 'x' })
  })
})

// ---------- PUBLIC (not signed in) ----------
test('public: can read active product and category, public settings', async () => {
  await assertSucceeds(getDoc(doc(anon(), 'products/p1')))
  await assertSucceeds(getDoc(doc(anon(), 'categories/c1')))
  await assertSucceeds(getDoc(doc(anon(), 'settings/public')))
  await assertSucceeds(getDocs(query(collection(anon(), 'products'), where('isActive', '==', true))))
})
test('public: cannot read inactive product or list without the isActive filter', async () => {
  await assertFails(getDoc(doc(anon(), 'products/hidden')))
  await assertFails(getDocs(collection(anon(), 'products')))
})
test('public: cannot read private settings, customers, orders, coupons, audit logs', async () => {
  for (const p of ['settings/private', 'customers/alice', 'orders/o1', 'orders/o1/private/contact', 'coupons/SAVE10', 'auditLogs/a1'])
    await assertFails(getDoc(doc(anon(), p)))
})
test('public: cannot write anything', async () => {
  await assertFails(setDoc(doc(anon(), 'products/x'), { name: 'x', basePrice: 1, categoryId: 'c1', isActive: true, isAvailable: true }))
  await assertFails(updateDoc(doc(anon(), 'settings/public'), { deliveryFee: 0 }))
  await assertFails(setDoc(doc(anon(), 'orders/new'), { customerId: 'x' }))
})

// ---------- AUTHENTICATED CUSTOMER ----------
test('customer: reads own profile and own order + contact, not others', async () => {
  const a = as('alice')
  await assertSucceeds(getDoc(doc(a, 'customers/alice')))
  await assertSucceeds(getDoc(doc(a, 'orders/o1')))
  await assertSucceeds(getDoc(doc(a, 'orders/o1/private/contact')))
  await assertFails(getDoc(doc(a, 'customers/bob')))
  await assertFails(getDoc(doc(a, 'orders/o2')))
})
test('customer: can query own orders by customerId, cannot list all orders', async () => {
  await assertSucceeds(getDocs(query(collection(as('alice'), 'orders'), where('customerId', '==', 'alice'))))
  await assertFails(getDocs(collection(as('alice'), 'orders')))
})
test('customer: creates own profile with allowed fields only', async () => {
  const c = as('carol')
  await assertSucceeds(setDoc(doc(c, 'customers/carol'), { displayName: 'C', phone: '', addresses: [], createdAt: serverTimestamp() }))
  await assertFails(setDoc(doc(as('dave'), 'customers/dave'), { displayName: 'D', phone: '', addresses: [], createdAt: serverTimestamp(), loyaltyBalance: 999 }))
  await assertFails(setDoc(doc(as('erin'), 'customers/someoneElse'), { displayName: 'E', phone: '', addresses: [], createdAt: serverTimestamp() }))
})
test('customer: can edit name/phone, cannot touch loyaltyBalance', async () => {
  const a = as('alice')
  await assertSucceeds(updateDoc(doc(a, 'customers/alice'), { displayName: 'Alice 2', phone: '010' }))
  await assertFails(updateDoc(doc(a, 'customers/alice'), { loyaltyBalance: 9999 }))
  await assertFails(updateDoc(doc(as('alice'), 'customers/bob'), { displayName: 'hacked' }))
})
test('customer: cannot create/modify/delete orders, coupons, or catalog', async () => {
  const a = as('alice')
  await assertFails(setDoc(doc(a, 'orders/new'), { customerId: 'alice', total: 1 }))
  await assertFails(updateDoc(doc(a, 'orders/o1'), { status: 'completed', total: 0 }))
  await assertFails(deleteDoc(doc(a, 'orders/o1')))
  await assertFails(getDoc(doc(a, 'coupons/SAVE10')))
  await assertFails(updateDoc(doc(a, 'products/p1'), { basePrice: 1 }))
  await assertFails(setDoc(doc(a, 'auditLogs/x'), { action: 'y' }))
})
test('customer: a forged role is not trusted (claims come from the token only)', async () => {
  await assertFails(setDoc(doc(as('alice'), 'staff/alice'), { role: 'owner' }))
})

// ---------- ADMIN / STAFF ----------
test('admin: manages catalog with valid data; invalid data rejected', async () => {
  const d = admin()
  await assertSucceeds(setDoc(doc(d, 'products/p2'), { name: 'New', basePrice: 5000, categoryId: 'c1', isActive: true, isAvailable: true }))
  await assertSucceeds(updateDoc(doc(d, 'products/p1'), { basePrice: 8000 }))
  await assertFails(setDoc(doc(d, 'products/bad1'), { name: 'x', basePrice: 12.5, categoryId: 'c1', isActive: true, isAvailable: true }))
  await assertFails(setDoc(doc(d, 'products/bad2'), { name: 'x', basePrice: -1, categoryId: 'c1', isActive: true, isAvailable: true }))
  await assertSucceeds(getDoc(doc(d, 'products/hidden')))
  await assertSucceeds(updateDoc(doc(d, 'settings/public'), { deliveryFee: 3500 }))
  await assertFails(updateDoc(doc(d, 'settings/public'), { deliveryFee: -1 }))
})
test('admin: reads customers, orders, contact, coupons, audit logs, private settings', async () => {
  const d = admin()
  for (const p of ['customers/alice', 'orders/o1', 'orders/o1/private/contact', 'coupons/SAVE10', 'auditLogs/a1', 'settings/private'])
    await assertSucceeds(getDoc(doc(d, p)))
})
test('admin: still cannot write orders / audit logs / loyalty / coupons directly (Functions only)', async () => {
  const d = admin()
  await assertFails(updateDoc(doc(d, 'orders/o1'), { status: 'completed' }))
  await assertFails(setDoc(doc(d, 'auditLogs/forged'), { action: 'fake' }))
  await assertFails(updateDoc(doc(d, 'auditLogs/a1'), { action: 'edited' }))
  await assertFails(deleteDoc(doc(d, 'auditLogs/a1')))
  await assertFails(updateDoc(doc(d, 'customers/alice'), { loyaltyBalance: 1000 }))
  await assertFails(setDoc(doc(d, 'coupons/FREE'), { type: 'percent', value: 100 }))
})
test('kitchen: reads orders, cannot read contact details, cannot edit catalog', async () => {
  const k = kitchen()
  await assertSucceeds(getDoc(doc(k, 'orders/o1')))
  await assertFails(getDoc(doc(k, 'orders/o1/private/contact')))
  await assertFails(updateDoc(doc(k, 'products/p1'), { basePrice: 1 }))
  await assertFails(getDoc(doc(k, 'coupons/SAVE10')))
})
test('unknown role claim gets no staff access', async () => {
  const x = as('zed', { role: 'superuser' })
  await assertFails(getDoc(doc(x, 'orders/o1')))
  await assertFails(updateDoc(doc(x, 'products/p1'), { basePrice: 1 }))
})
