/**
 * Seed Firestore PRODUCTION with categories, products, and settings.
 *
 * ⚠️  WARNING: This writes to the REAL Firestore project.
 *     Make sure the project ID in the service account matches what you expect.
 *
 * Requires: C:\secure\key.json (or GOOGLE_APPLICATION_CREDENTIALS env var)
 *
 * Usage:
 *   node scripts/seed-firestore.mjs --yes         (confirm production write)
 *   node scripts/seed-firestore.mjs --dry-run     (preview only, no writes)
 *
 * Strategy: upsert by deterministic ID (safe to re-run — overwrites).
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ?? 'C:\\secure\\key.json'

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const CONFIRMED = args.includes('--yes')

// ---------- Data ----------

const categories = [
  { id: 'crepe', name: 'كريب', tagline: 'سخن ومحشي', sortOrder: 1, isActive: true, imageUrl: '/images/crype.png' },
  { id: 'pies-pizza', name: 'فطائر وبيتزا', tagline: 'من الفرن للطبق', sortOrder: 2, isActive: true, imageUrl: '/images/pizza.webp' },
  { id: 'sandwiches', name: 'ساندوتشات', tagline: 'لقمة ورا لقمة', sortOrder: 3, isActive: true, imageUrl: '/images/burger.webp' },
  { id: 'pasta', name: 'مكرونات', tagline: 'صوص على قد المزاج', sortOrder: 4, isActive: true, imageUrl: '/images/pasta.webp' },
]

const sizes = [
  { id: 'm', name: 'وسط', priceDelta: 0 },
  { id: 'l', name: 'كبير', priceDelta: 2500 },
]

const products = [
  {
    id: 'crepe-chicken', categoryId: 'crepe', name: 'كريب فراخ',
    description: 'فراخ متتبلة مع جبنة وخضار طازة.',
    basePrice: 7500, isAvailable: true, isActive: true, sortOrder: 1,
    variants: sizes, addOns: [{ id: 'cheese', name: 'جبنة زيادة', price: 1000 }],
    imageUrl: '/images/crype.png',
  },
  {
    id: 'crepe-sweet', categoryId: 'crepe', name: 'كريب شوكولاتة',
    description: 'شوكولاتة سايحة مع موز.',
    basePrice: 6500, isAvailable: true, isActive: true, sortOrder: 2,
    variants: sizes, addOns: [], imageUrl: '/images/crype.png',
  },
  {
    id: 'pizza-margherita', categoryId: 'pies-pizza', name: 'بيتزا مارجريتا',
    description: 'صوص طماطم وموتزاريلا وريحان.',
    basePrice: 9000, isAvailable: true, isActive: true, sortOrder: 1,
    variants: sizes, addOns: [], imageUrl: '/images/pizza.webp',
  },
  {
    id: 'pie-cheese', categoryId: 'pies-pizza', name: 'فطيرة جبنة',
    description: 'عجينة مقرمشة وحشو جبنة غني.',
    basePrice: 7000, isAvailable: false, isActive: true, sortOrder: 2,
    variants: [], addOns: [], imageUrl: '/images/pizza.webp',
  },
  {
    id: 'sandwich-shawerma', categoryId: 'sandwiches', name: 'ساندوتش شاورما',
    description: 'شاورما بصوص الثوم والمخلل.',
    basePrice: 6000, isAvailable: true, isActive: true, sortOrder: 1,
    variants: [], addOns: [{ id: 'sauce', name: 'صوص زيادة', price: 500 }],
    imageUrl: '/images/burger.webp',
  },
  {
    id: 'sandwich-crispy', categoryId: 'sandwiches', name: 'ساندوتش كرسبي',
    description: 'فراخ مقرمشة وخس وصوص خاص.',
    basePrice: 6500, isAvailable: true, isActive: true, sortOrder: 2,
    variants: [], addOns: [], imageUrl: '/images/burger2.webp',
  },
  {
    id: 'pasta-alfredo', categoryId: 'pasta', name: 'مكرونة ألفريدو',
    description: 'كريمة وجبنة وفراخ مشوية.',
    basePrice: 8500, isAvailable: true, isActive: true, sortOrder: 1,
    variants: [], addOns: [], imageUrl: '/images/pasta.webp',
  },
  {
    id: 'pasta-red', categoryId: 'pasta', name: 'مكرونة صوص أحمر',
    description: 'صوص طماطم حار على الطريقة الإيطالية.',
    basePrice: 7500, isAvailable: true, isActive: true, sortOrder: 2,
    variants: [], addOns: [], imageUrl: '/images/pasta.webp',
  },
]

const settings = {
  deliveryFee: 3000,
  freeDeliveryOver: null,
}

// ---------- Main ----------

function loadServiceAccount() {
  const fullPath = resolve(KEY_PATH)
  if (!existsSync(fullPath)) {
    console.error(`❌ Service account key not found at: ${fullPath}`)
    process.exit(1)
  }
  return JSON.parse(readFileSync(fullPath, 'utf8'))
}

async function main() {
  const sa = loadServiceAccount()
  console.log(`🔑 Project: ${sa.project_id}`)
  console.log(`📝 Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE WRITE'}`)
  console.log('')

  if (!DRY_RUN && !CONFIRMED) {
    console.error('⚠️  This will WRITE to production Firestore.')
    console.error('   Add --yes to confirm, or --dry-run to preview.')
    process.exit(1)
  }

  if (DRY_RUN) {
    console.log(`📦 Categories (${categories.length}):`)
    categories.forEach((c) => console.log(`   - ${c.id} → ${c.name}`))
    console.log(`📦 Products (${products.length}):`)
    products.forEach((p) => console.log(`   - ${p.id} → ${p.name} (${p.basePrice} piasters)`))
    console.log(`📦 Settings: deliveryFee=${settings.deliveryFee}, freeDeliveryOver=${settings.freeDeliveryOver}`)
    console.log('')
    console.log('✅ Dry run complete. Nothing was written.')
    process.exit(0)
  }

  initializeApp({ credential: cert(sa) })
  const db = getFirestore()

  // Categories
  console.log('🌱 Seeding categories...')
  for (const c of categories) {
    const { id, ...data } = c
    await db.collection('categories').doc(id).set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })
    console.log(`   ✅ ${id}`)
  }

  // Products
  console.log('🌱 Seeding products...')
  for (const p of products) {
    const { id, ...data } = p
    await db.collection('products').doc(id).set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })
    console.log(`   ✅ ${id}`)
  }

  // Settings
  console.log('🌱 Seeding settings...')
  await db.collection('settings').doc('public').set({
    ...settings,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true })
  console.log('   ✅ settings/public')

  console.log('')
  console.log('🎉 Done! Firestore Production is seeded.')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})