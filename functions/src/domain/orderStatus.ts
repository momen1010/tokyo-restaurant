// Single source of truth for allowed order transitions. Enforced server-side only.
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' |
  'delivered' | 'picked_up' | 'completed' | 'cancelled' | 'rejected'
export type Role = 'owner' | 'admin' | 'kitchen' | 'delivery' | 'cashier'

export const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['out_for_delivery', 'picked_up'],
  out_for_delivery: ['delivered'],
  delivered: ['completed'],
  picked_up: ['completed'],
  completed: [], cancelled: [], rejected: [],
}
export const canTransition = (from: OrderStatus, to: OrderStatus) => TRANSITIONS[from]?.includes(to) ?? false
