/**
 * Build a WhatsApp-friendly message summarizing the order.
 * Also returns the wa.me deep link.
 */
import { PAYMENT_CONFIG } from './paymentConfig.js'
import { PAYMENT_METHODS } from './orderModel.js'

const fmt = (piasters) => `${(piasters / 100).toFixed(2)} ج.م`

const PAYMENT_LABEL = {
  [PAYMENT_METHODS.CASH]: 'الدفع عند الاستلام',
  [PAYMENT_METHODS.ONLINE]: 'دفع إلكتروني (فودافون كاش / إنستاباي)',
}

/**
 * Build the public tracking URL for an order.
 * Change APP_URL if you deploy to a custom domain.
 */
function buildTrackUrl(orderNumber) {
  const base = import.meta.env.VITE_APP_URL || window.location.origin
  return `${base}/track-order?order=${encodeURIComponent(orderNumber)}`
}

/**
 * @param {Object} args
 * @param {Array} args.lines - priced lines from client summary
 * @param {Object} args.customer - { name, phone, address, notes }
 * @param {'delivery'|'pickup'} args.orderType
 * @param {'cash'|'online'} args.paymentMethod
 * @param {Object} args.totals - { subtotal, deliveryFee, total }
 * @param {string} args.orderNumber - TOKYO-XXXXXXXX-XXXX
 */
export function buildWhatsAppMessage({ lines, customer, orderType, paymentMethod, totals, orderNumber }) {
  const nl = '\n'
  const items = lines
    .map((l) => `• ${l.productName} ×${l.qty} — ${fmt(l.lineTotal)}`)
    .join(nl)

  const trackUrl = buildTrackUrl(orderNumber)

  const content = [
    `🍜 *طلب جديد من طوكيو*`,
    ``,
    `📋 *رقم الطلب:* ${orderNumber}`,
    ``,
    `*الطلب:*`,
    items,
    ``,
    `💰 المجموع الفرعي: ${fmt(totals.subtotal)}`,
    `🚚 التوصيل: ${orderType === 'pickup' ? 'مجاناً (استلام)' : fmt(totals.deliveryFee)}`,
    `*📊 الإجمالي: ${fmt(totals.total)}*`,
    ``,
    `👤 الاسم: ${customer.name}`,
    `📞 التليفون: ${customer.phone}`,
    orderType === 'delivery' ? `📍 العنوان: ${customer.address}` : `🏪 استلام من الفرع`,
    customer.notes ? `📝 ملاحظات: ${customer.notes}` : null,
    ``,
    `💳 طريقة الدفع: ${PAYMENT_LABEL[paymentMethod]}`,
    paymentMethod === PAYMENT_METHODS.ONLINE
      ? `📎 (صورة الإيصال في المرفقات)`
      : null,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🔗 *تتبع طلبك من هنا:*`,
    trackUrl,
    `━━━━━━━━━━━━━━━━━━━━`,
  ].filter(Boolean)

  return content.join(nl)
}

export function buildWhatsAppLink(message, phone = PAYMENT_CONFIG.whatsapp.number) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Build the tracking URL — exported so TrackOrderPage can read the order param.
 */
export { buildTrackUrl }