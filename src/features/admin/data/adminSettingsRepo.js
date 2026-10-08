/**
 * Admin settings repository — read/write to /settings/public.
 * Rules: public read, admin write.
 */
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { getDb } from '@/shared/firebase/client.js'

const SETTINGS_DOC = ['settings', 'public']

export function subscribeSettings(onData, onError) {
  const db = getDb()
  const ref = doc(db, ...SETTINGS_DOC)
  return onSnapshot(
    ref,
    (snap) => {
      const data = snap.exists() ? snap.data() : {}
      onData({
        deliveryFee: Number.isInteger(data.deliveryFee) ? data.deliveryFee : 3000,
        freeDeliveryOver: Number.isInteger(data.freeDeliveryOver) ? data.freeDeliveryOver : null,
      })
    },
    (err) => {
      console.error('[adminSettingsRepo] subscribe error:', err)
      onError?.(err)
    }
  )
}

export async function getSettings() {
  const db = getDb()
  const snap = await getDoc(doc(db, ...SETTINGS_DOC))
  if (!snap.exists()) return { deliveryFee: 3000, freeDeliveryOver: null }
  const d = snap.data()
  return {
    deliveryFee: Number.isInteger(d.deliveryFee) ? d.deliveryFee : 3000,
    freeDeliveryOver: Number.isInteger(d.freeDeliveryOver) ? d.freeDeliveryOver : null,
  }
}

export async function updateSettings({ deliveryFee, freeDeliveryOver }) {
  const db = getDb()
  await setDoc(
    doc(db, ...SETTINGS_DOC),
    {
      deliveryFee: Math.round(Number(deliveryFee) || 0),
      freeDeliveryOver:
        freeDeliveryOver === null || freeDeliveryOver === ''
          ? null
          : Math.round(Number(freeDeliveryOver) || 0),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}