/**
 * Products repository — reads from Firestore.
 * Returns server-trusted shapes used by the pricing engine.
 */
import { getDb } from '../lib/admin'
import type { ServerProduct, ServerVariant, ServerAddOn } from '../domain/pricing'

const PRODUCTS = 'products'

/** Fetch multiple products by ID. Missing IDs are silently skipped (caller decides). */
export async function getProductsByIds(ids: string[]): Promise<Map<string, ServerProduct>> {
  const unique = Array.from(new Set(ids))
  const db = getDb()
  const map = new Map<string, ServerProduct>()
  if (unique.length === 0) return map

  const chunks: string[][] = []
  for (let i = 0; i < unique.length; i += 30) chunks.push(unique.slice(i, i + 30))

  for (const chunk of chunks) {
    const refs = chunk.map((id) => db.collection(PRODUCTS).doc(id))
    const snaps = await db.getAll(...refs)
    for (const snap of snaps) {
      if (!snap.exists) continue
      const d = snap.data() ?? {}
      if (d.isActive !== true) continue
      map.set(snap.id, normalizeProduct(snap.id, d))
    }
  }
  return map
}

function normalizeProduct(id: string, d: Record<string, unknown>): ServerProduct {
  return {
    id,
    name: typeof d.name === 'string' ? d.name : '',
    basePrice: Number.isInteger(d.basePrice) ? (d.basePrice as number) : 0,
    isAvailable: d.isAvailable !== false,
    variants: Array.isArray(d.variants)
      ? (d.variants as unknown[])
          .filter((v): v is Record<string, unknown> => !!v && typeof v === 'object')
          .filter((v) => typeof v.id === 'string')
          .map<ServerVariant>((v) => ({
            id: v.id as string,
            name: typeof v.name === 'string' ? v.name : '',
            priceDelta: Number.isInteger(v.priceDelta) ? (v.priceDelta as number) : 0,
          }))
      : [],
    addOns: Array.isArray(d.addOns)
      ? (d.addOns as unknown[])
          .filter((a): a is Record<string, unknown> => !!a && typeof a === 'object')
          .filter((a) => typeof a.id === 'string' && Number.isInteger(a.price))
          .map<ServerAddOn>((a) => ({
            id: a.id as string,
            name: typeof a.name === 'string' ? a.name : '',
            price: a.price as number,
          }))
      : [],
  }
}