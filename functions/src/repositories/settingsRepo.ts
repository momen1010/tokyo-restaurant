/**
 * Settings repository — reads public settings doc.
 */
import { getDb } from '../lib/admin'
import type { PricingSettings } from '../domain/pricing'

const DEFAULT: PricingSettings = {
  deliveryFee: 3000,
  freeDeliveryOver: null,
}

export async function getPricingSettings(): Promise<PricingSettings> {
  const db = getDb()
  const snap = await db.collection('settings').doc('public').get()
  if (!snap.exists) return DEFAULT
  const d = snap.data() ?? {}
  return {
    deliveryFee: Number.isInteger(d.deliveryFee) ? (d.deliveryFee as number) : DEFAULT.deliveryFee,
    freeDeliveryOver: Number.isInteger(d.freeDeliveryOver)
      ? (d.freeDeliveryOver as number)
      : null,
  }
}