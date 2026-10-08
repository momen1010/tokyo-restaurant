/**
 * Admin products repository — CRUD operations on /products.
 * Rules enforce isAdmin() on writes.
 */
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
  } from 'firebase/firestore'
  import { getDb } from '@/shared/firebase/client.js'
  
  const PRODUCTS = 'products'
  
  /**
   * Subscribe to all products (including inactive) for admin view.
   */
  export function subscribeProducts(onData, onError) {
    const db = getDb()
    const q = query(collection(db, PRODUCTS), orderBy('categoryId'), orderBy('sortOrder'))
  
    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        onData(items)
      },
      (err) => {
        console.error('[adminProductsRepo] subscribe error:', err)
        onError?.(err)
      }
    )
  }
  
  export async function getProduct(id) {
    const db = getDb()
    const snap = await getDoc(doc(db, PRODUCTS, id))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  }
  
  /**
   * Create or update a product (upsert).
   * @param {string} id - product ID (slug)
   * @param {Object} data
   */
  export async function upsertProduct(id, data) {
    const db = getDb()
    const ref = doc(db, PRODUCTS, id)
    const existing = await getDoc(ref)
  
    const payload = {
      name: String(data.name ?? '').trim(),
      description: String(data.description ?? '').trim(),
      categoryId: String(data.categoryId ?? '').trim(),
      basePrice: Math.round(Number(data.basePrice) || 0),
      imageUrl: String(data.imageUrl ?? '').trim(),
      sortOrder: Number(data.sortOrder) || 0,
      isActive: data.isActive !== false,
      isAvailable: data.isAvailable !== false,
      variants: Array.isArray(data.variants) ? data.variants : [],
      addOns: Array.isArray(data.addOns) ? data.addOns : [],
      updatedAt: serverTimestamp(),
    }
  
    if (!existing.exists()) {
      payload.createdAt = serverTimestamp()
    }
  
    await setDoc(ref, payload, { merge: true })
    return id
  }
  
  /**
   * Soft delete: set isActive = false.
   */
  export async function archiveProduct(id) {
    const db = getDb()
    await updateDoc(doc(db, PRODUCTS, id), {
      isActive: false,
      updatedAt: serverTimestamp(),
    })
  }
  
  /**
   * Hard delete (admin only — use with caution).
   */
  export async function deleteProduct(id) {
    const db = getDb()
    const { deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc(db, PRODUCTS, id))
  }