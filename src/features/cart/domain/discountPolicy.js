// Discount architecture. The client NEVER evaluates coupon rules or loyalty redemption.
// A future `quoteOrder` Cloud Function returns { discount } and the UI only displays it.
// Here we merely clamp the displayed value so a bad payload cannot show a negative or > subtotal discount.
export function estimateDiscount(subtotal, serverQuote) {
  const d = serverQuote?.discount
  if (!Number.isInteger(d) || d <= 0) return 0
  return Math.min(d, subtotal)
}
