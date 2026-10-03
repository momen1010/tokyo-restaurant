// Loads PLACEHOLDER menu data into a REAL Firebase project, from your own machine, using an Admin SDK key.
// The key file stays OUTSIDE this project and is never committed. Re-running overwrites docs with the same IDs.
import admin from 'firebase-admin'
import { categories, products, placeholderSettings } from '../src/features/menu/data/placeholderMenu.js'

const [, , projectId, confirm] = process.argv
if (!projectId || confirm !== '--yes') {
  console.error('Usage: node scripts/seed-prod.mjs <projectId> --yes'); process.exit(1)
}
if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.error('FIRESTORE_EMULATOR_HOST is set: unset it to seed a real project.'); process.exit(1)
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your service-account JSON path (kept outside the project).'); process.exit(1)
}

admin.initializeApp({ projectId })
const db = admin.firestore()
const batch = db.batch()
categories.forEach((c) => batch.set(db.doc(`categories/${c.id}`), { ...c, isActive: true }))
products.forEach((p, i) => batch.set(db.doc(`products/${p.id}`), { ...p, isActive: true, sortOrder: i + 1 }))
batch.set(db.doc('settings/public'), placeholderSettings, { merge: true })
await batch.commit()
console.log(`Seeded ${categories.length} categories and ${products.length} products into "${projectId}". Prices are PLACEHOLDERS.`)