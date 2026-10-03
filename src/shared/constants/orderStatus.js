// UI labels/ordering only. The server (functions/src/domain/orderStatus.ts) is the authority.
export const STATUS_LABEL_AR = {
  pending: 'قيد المراجعة', confirmed: 'تم التأكيد', preparing: 'جاري التحضير', ready: 'جاهز',
  out_for_delivery: 'خرج للتوصيل', delivered: 'تم التسليم', picked_up: 'تم الاستلام',
  completed: 'مكتمل', cancelled: 'ملغي', rejected: 'مرفوض',
}
export const ROLES = ['owner', 'admin', 'kitchen', 'delivery', 'cashier']
