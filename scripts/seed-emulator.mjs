/**
 * Seed the Firestore Emulator with placeholder data.
 * Run with the emulator already up (firebase emulators:start).
 *
 * Usage: node scripts/seed-emulator.mjs
 */
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Point Admin SDK at the local emulator
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'
process.env.GCLOUD_PROJECT = 'demo-tokyo'

const app = initializeApp({ projectId: 'demo-tokyo' })
const db = getFirestore(app)

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

async function main() {
  console.log('🌱 Seeding Firestore Emulator...')

  // Categories
  for (const c of categories) {
    const { id, ...data } = c
    await db.collection('categories').doc(id).set(data)
  }
  console.log(`  ✅ ${categories.length} categories`)

  // Products
  for (const p of products) {
    const { id, ...data } = p
    await db.collection('products').doc(id).set(data)
  }
  console.log(`  ✅ ${products.length} products`)

  // Settings
  await db.collection('settings').doc('public').set(settings)
  console.log('  ✅ settings/public')

  console.log('🎉 Done!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})