// Authorization matrix: the SAME operations run as every kind of user.
import { readFileSync } from 'node:fs'
import { test, before, after, beforeEach } from 'node:test'
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

let env
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-tokyo-auth', firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 } })
})
after(() => env.cleanup())
beforeEach(async () => {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled(async (c) => {
    const db = c.firestore()
    await setDoc(doc(db, 'products/p1'), { name: 'A', basePrice: 7500, categoryId: 'c', isActive: true, isAvailable: true })
    await setDoc(doc(db, 'customers/alice'), { displayName: 'Alice', phone: '', addresses: [] })
    await setDoc(doc(db, 'customers/bob'), { displayName: 'Bob', phone: '', addresses: [] })
    await setDoc(doc(db, 'orders/o1'), { customerId: 'alice', status: 'pending' })
    await setDoc(doc(db, 'orders/o1/private/contact'), { phone: '010' })
    await setDoc(doc(db, 'coupons/SAVE10'), { value: 10 })
    await setDoc(doc(db, 'settings/private'), { autoConfirm: false })
    await setDoc(doc(db, 'auditLogs/a1'), { action: 'x' })
  })
})

const actors = {
  unauthenticated: () => env.unauthenticatedContext().firestore(),
  normalUser: () => env.authenticatedContext('alice').firestore(),                          // signed in, no claims
  adminFalse: () => env.authenticatedContext('u2', { admin: false }).firestore(),
  adminAsString: () => env.authenticatedContext('u3', { admin: 'true' }).firestore(),       // must NOT count as admin
  roleAdminOnly: () => env.authenticatedContext('u4', { role: 'admin' }).firestore(),       // role without admin:true = nothing
  kitchenStaff: () => env.authenticatedContext('k1', { role: 'kitchen' }).firestore(),
  admin: () => env.authenticatedContext('a1', { admin: true, role: 'admin' }).firestore(),
}
const ALL = Object.keys(actors)

// [name, operation, actors that are ALLOWED] (everyone else must be denied)
const ops = [
  ['read active product', (db) => getDoc(doc(db, 'products/p1')), ALL],
  ['read own profile (customers/alice)', (db) => getDoc(doc(db, 'customers/alice')), ['normalUser', 'admin']],
  ["read someone else's profile (customers/bob)", (db) => getDoc(doc(db, 'customers/bob')), ['admin']],
  ["read alice's order", (db) => getDoc(doc(db, 'orders/o1')), ['normalUser', 'kitchenStaff', 'admin']],
  ["read alice's order contact details", (db) => getDoc(doc(db, 'orders/o1/private/contact')), ['normalUser', 'admin']],
  ['read coupons', (db) => getDoc(doc(db, 'coupons/SAVE10')), ['admin']],
  ['read private settings', (db) => getDoc(doc(db, 'settings/private')), ['admin']],
  ['read audit logs', (db) => getDoc(doc(db, 'auditLogs/a1')), ['admin']],
  ['update product price', (db) => updateDoc(doc(db, 'products/p1'), { basePrice: 100 }), ['admin']],
  ['write audit log (Functions only)', (db) => setDoc(doc(db, 'auditLogs/forged'), { action: 'fake' }), []],
  ['edit an order (Functions only)', (db) => updateDoc(doc(db, 'orders/o1'), { status: 'completed' }), []],
]

for (const [name, run, allowed] of ops) {
  for (const actor of ALL) {
    const ok = allowed.includes(actor)
    test(`${name} as ${actor} -> ${ok ? 'ALLOWED' : 'DENIED'}`, () => (ok ? assertSucceeds : assertFails)(run(actors[actor]())))
  }
}