// Product/category data model + defensive normalizers for Firestore documents (untrusted shape).
// Money = integer piasters.
/**
 * @typedef {{id:string, name:string, priceDelta:number}} Variant
 * @typedef {{id:string, name:string, price:number}} AddOn
 * @typedef {{id:string, categoryId:string, name:string, description:string, basePrice:number,
*   imageUrl:string|null, badge:'new'|'popular'|null, isAvailable:boolean, sortOrder:number,
*   variants:Variant[], addOns:AddOn[]}} Product
* @typedef {{id:string, name:string, tagline:string, sortOrder:number}} Category
* @typedef {{deliveryFee:number, freeDeliveryOver:number|null}} PublicSettings
*/
const money = (n) => (Number.isInteger(n) && n >= 0 ? n : null)
const list = (a) => (Array.isArray(a) ? a : [])
export const BADGES = ['new', 'popular']

export const normalizeProduct = (id, d = {}) => ({
 id, categoryId: String(d.categoryId ?? ''), name: String(d.name ?? ''), description: String(d.description ?? ''),
 basePrice: money(d.basePrice) ?? 0, imageUrl: typeof d.imageUrl === 'string' ? d.imageUrl : null,
 badge: BADGES.includes(d.badge) ? d.badge : null,
 isAvailable: d.isAvailable !== false, sortOrder: Number.isFinite(d.sortOrder) ? d.sortOrder : 0,
 variants: list(d.variants).filter((v) => v && typeof v.id === 'string')
   .map((v) => ({ id: v.id, name: String(v.name ?? ''), priceDelta: Number.isInteger(v.priceDelta) ? v.priceDelta : 0 })),
 addOns: list(d.addOns).filter((a) => a && typeof a.id === 'string' && money(a.price) !== null)
   .map((a) => ({ id: a.id, name: String(a.name ?? ''), price: a.price })),
})
export const normalizeCategory = (id, d = {}) => ({
 id, name: String(d.name ?? ''), tagline: String(d.tagline ?? ''), sortOrder: Number.isFinite(d.sortOrder) ? d.sortOrder : 0,
})
export const normalizeSettings = (d = {}) => ({
 deliveryFee: money(d.deliveryFee) ?? 3000, freeDeliveryOver: money(d.freeDeliveryOver),
})