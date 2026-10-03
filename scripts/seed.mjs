// Loads PLACEHOLDER menu data into the Firestore EMULATOR only. Refuses to run against a real project.
import admin from 'firebase-admin'
import { categories, products, placeholderSettings } from '../src/features/menu/data/placeholderMenu.js'

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  console.error('Refusing to seed: FIRESTORE_EMULATOR_HOST is not set (emulator only).'); process.exit(1)
}
admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'demo-tokyo' })
const db = admin.firestore()
const batch = db.batch()
categories.forEach((c) => batch.set(db.doc(`categories/${c.id}`), { ...c, isActive: true }))
products.forEach((p) => batch.set(db.doc(`products/${p.id}`), { ...p, isActive: true }))
batch.set(db.doc('settings/public'), placeholderSettings)
batch.set(db.doc('settings/private'), { autoConfirm: false })
await batch.commit()
console.log(`Seeded ${categories.length} categories, ${products.length} products.`)
