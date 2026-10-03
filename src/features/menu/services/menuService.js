import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { getDb, isFirebaseConfigured } from '../../../shared/firebase/client.js'
import { categories as phCats, products as phProducts, placeholderSettings } from '../data/placeholderMenu.js'
import { normalizeCategory, normalizeProduct, normalizeSettings } from '../domain/model.js'

const bySort = (a, b) => a.sortOrder - b.sortOrder

/** Public read. Queries MUST filter isActive == true: the Rules only allow reading active docs to the public. */
export async function loadMenu() {
  if (!isFirebaseConfigured) { // UI-only dev mode (no .env yet)
    return { source: 'placeholder', categories: phCats.map((c) => normalizeCategory(c.id, c)).sort(bySort),
      products: phProducts.map((p) => normalizeProduct(p.id, p)), settings: normalizeSettings(placeholderSettings) }
  }
  const db = getDb()
  const [cs, ps, st] = await Promise.all([
    getDocs(query(collection(db, 'categories'), where('isActive', '==', true))),
    getDocs(query(collection(db, 'products'), where('isActive', '==', true))),
    getDoc(doc(db, 'settings', 'public')),
  ])
  return {
    source: 'firestore',
    categories: cs.docs.map((d) => normalizeCategory(d.id, d.data())).sort(bySort),
    products: ps.docs.map((d) => normalizeProduct(d.id, d.data())).sort(bySort),
    settings: normalizeSettings(st.exists() ? st.data() : {}),
  }
}
