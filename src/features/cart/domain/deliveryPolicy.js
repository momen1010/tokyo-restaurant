// Delivery estimate. Today: one flat fee from settings/public (default 3000 piasters = 30 EGP).
// Extension point: add zones/distance by replacing this function; callers don't change.
// The server recomputes the real fee in createOrder and stores it as a snapshot on the order.
export const DEFAULT_DELIVERY_FEE = 3000
const isMoney = (n) => Number.isInteger(n) && n >= 0

export function estimateDelivery({ subtotal, orderType, settings }) {
  if (orderType !== 'delivery' || subtotal <= 0) return 0
  if (isMoney(settings?.freeDeliveryOver) && subtotal >= settings.freeDeliveryOver) return 0
  return isMoney(settings?.deliveryFee) ? settings.deliveryFee : DEFAULT_DELIVERY_FEE
}
