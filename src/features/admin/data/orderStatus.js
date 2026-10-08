/**
 * Order status definitions + transitions.
 * MUST match the server-side (functions/src/domain/orderStatus.ts).
 * Keep them in sync when adding new statuses.
 */

export const ORDER_STATUS = {
    NEW: 'new',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  }
  
  export const STATUS_LABEL_AR = {
    [ORDER_STATUS.NEW]: 'جديد',
    [ORDER_STATUS.CONFIRMED]: 'مؤكد',
    [ORDER_STATUS.PREPARING]: 'قيد التحضير',
    [ORDER_STATUS.READY]: 'جاهز',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'في الطريق',
    [ORDER_STATUS.DELIVERED]: 'تم التسليم',
    [ORDER_STATUS.CANCELLED]: 'ملغي',
  }
  
  export const STATUS_COLOR = {
    [ORDER_STATUS.NEW]: 'bg-blood text-white',
    [ORDER_STATUS.CONFIRMED]: 'bg-amber-500 text-white',
    [ORDER_STATUS.PREPARING]: 'bg-yellow-500 text-black',
    [ORDER_STATUS.READY]: 'bg-emerald-500 text-white',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-blue-500 text-white',
    [ORDER_STATUS.DELIVERED]: 'bg-coal-soft text-paper',
    [ORDER_STATUS.CANCELLED]: 'bg-coal text-paper/50',
  }
  
  /** Allowed transitions — server enforces too. */
  export const TRANSITIONS = {
    [ORDER_STATUS.NEW]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.READY]: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]: [],
    [ORDER_STATUS.CANCELLED]: [],
  }
  
  export function canTransition(from, to) {
    return TRANSITIONS[from]?.includes(to) ?? false
  }
  
  export function getNextStatuses(current) {
    return TRANSITIONS[current] ?? []
  }