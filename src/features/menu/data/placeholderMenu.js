// PLACEHOLDER content + prices (piasters) for UI work only. Display-only: the server will re-price every order.
// Used by menuService only when Firebase is not configured, and by scripts/seed.mjs for the emulator. Do NOT import this file from components.
export const categories = [
  { id: 'crepe', name: 'كريب', tagline: 'سخن ومحشي', sortOrder: 1 },
  { id: 'pies-pizza', name: 'فطائر وبيتزا', tagline: 'من الفرن للطبق', sortOrder: 2 },
  { id: 'sandwiches', name: 'ساندوتشات', tagline: 'لقمة ورا لقمة', sortOrder: 3 },
  { id: 'pasta', name: 'مكرونات', tagline: 'صوص على قد المزاج', sortOrder: 4 },
]
const sizes = [{ id: 'm', name: 'وسط', priceDelta: 0 }, { id: 'l', name: 'كبير', priceDelta: 2500 }]
export const products = [
  { id: 'crepe-chicken', categoryId: 'crepe', name: 'كريب فراخ', description: 'فراخ متتبلة مع جبنة وخضار طازة.', basePrice: 7500, isAvailable: true, variants: sizes, addOns: [{ id: 'cheese', name: 'جبنة زيادة', price: 1000 }] },
  { id: 'crepe-sweet', categoryId: 'crepe', name: 'كريب شوكولاتة', description: 'شوكولاتة سايحة مع موز.', basePrice: 6500, isAvailable: true, variants: sizes, addOns: [] },
  { id: 'pizza-margherita', categoryId: 'pies-pizza', name: 'بيتزا مارجريتا', description: 'صوص طماطم وموتزاريلا وريحان.', basePrice: 9000, isAvailable: true, variants: sizes, addOns: [] },
  { id: 'pie-cheese', categoryId: 'pies-pizza', name: 'فطيرة جبنة', description: 'عجينة مقرمشة وحشو جبنة غني.', basePrice: 7000, isAvailable: false, variants: [], addOns: [] },
  { id: 'sandwich-shawerma', categoryId: 'sandwiches', name: 'ساندوتش شاورما', description: 'شاورما بصوص الثوم والمخلل.', basePrice: 6000, isAvailable: true, variants: [], addOns: [{ id: 'sauce', name: 'صوص زيادة', price: 500 }] },
  { id: 'sandwich-crispy', categoryId: 'sandwiches', name: 'ساندوتش كرسبي', description: 'فراخ مقرمشة وخس وصوص خاص.', basePrice: 6500, isAvailable: true, variants: [], addOns: [] },
  { id: 'pasta-alfredo', categoryId: 'pasta', name: 'مكرونة ألفريدو', description: 'كريمة وجبنة وفراخ مشوية.', basePrice: 8500, isAvailable: true, variants: [], addOns: [] },
  { id: 'pasta-red', categoryId: 'pasta', name: 'مكرونة صوص أحمر', description: 'صوص طماطم حار على الطريقة الإيطالية.', basePrice: 7500, isAvailable: true, variants: [], addOns: [] },
]

export const placeholderSettings = { deliveryFee: 3000, freeDeliveryOver: null, currency: 'EGP' }
