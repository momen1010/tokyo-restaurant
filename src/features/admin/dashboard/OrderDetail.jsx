import { useState } from 'react'
import { formatEGP } from '@/shared/lib/money.js'
import {
  ORDER_STATUS,
  STATUS_LABEL_AR,
  STATUS_COLOR,
  getNextStatuses,
} from '../data/orderStatus.js'
import { updateOrderStatus } from '../data/adminOrdersRepo.js'

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('ar-EG')
}

const Section = ({ title, children }) => (
  <div className="rounded-md border border-coal-line bg-coal p-3">
    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-paper/50">
      {title}
    </h3>
    {children}
  </div>
)

export default function OrderDetail({ order, onUpdated }) {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)

  if (!order) {
    return (
      <div className="rounded-card border border-coal-line bg-coal/40 p-8 text-center text-paper/50">
        اختار طلب من القائمة.
      </div>
    )
  }

  const nextStatuses = getNextStatuses(order.status)

  const handleUpdate = async (newStatus) => {
    setUpdating(true)
    setError(null)
    try {
      await updateOrderStatus(order.id, newStatus)
      onUpdated?.()
    } catch (err) {
      console.error('[OrderDetail] update failed:', err)
      setError('تعذر تحديث حالة الطلب. حاول تاني.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">
            {order.customer?.name ?? 'بدون اسم'}
          </h2>
          <p className="text-sm text-paper/60" dir="ltr">
            {order.customer?.phone ?? '—'}
          </p>
        </div>
        <span className={`rounded-md px-3 py-1 text-sm font-bold ${STATUS_COLOR[order.status] ?? 'bg-coal-soft'}`}>
          {STATUS_LABEL_AR[order.status] ?? order.status}
        </span>
      </div>

      {/* Customer */}
      <Section title="بيانات العميل">
        <div className="space-y-1 text-sm">
          <p className="text-paper/80">
            <span className="text-paper/50">العنوان: </span>
            {order.customer?.address || 'استلام من الفرع'}
          </p>
          {order.notes && (
            <p className="text-paper/80">
              <span className="text-paper/50">ملاحظات: </span>
              {order.notes}
            </p>
          )}
          <p className="text-paper/80">
            <span className="text-paper/50">نوع الطلب: </span>
            {order.orderType === 'delivery' ? 'توصيل' : 'استلام'}
          </p>
          <p className="text-paper/80">
            <span className="text-paper/50">الدفع: </span>
            {order.paymentMethod === 'cash' ? 'عند الاستلام' : 'إلكتروني'}
          </p>
          <p className="text-paper/50">
            <span>التاريخ: </span>
            {formatDate(order.createdAt)}
          </p>
        </div>
      </Section>

      {/* Items */}
      <Section title="تفاصيل الطلب">
        <ul className="space-y-2 text-sm">
          {(order.items ?? []).map((it, i) => (
            <li key={i} className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-bold text-white">{it.productId}</p>
                {it.addOnIds?.length > 0 && (
                  <p className="text-xs text-paper/50">
                    + {it.addOnIds.length} إضافات
                  </p>
                )}
              </div>
              <span className="text-paper/60">×{it.qty}</span>
              <span className="whitespace-nowrap font-bold text-paper/80">
                {formatEGP(it.price ?? 0)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 space-y-1 border-t border-coal-line pt-3 text-sm">
          <div className="flex justify-between text-paper/60">
            <span>المجموع الفرعي</span>
            <span>{formatEGP(order.subtotal ?? 0)}</span>
          </div>
          <div className="flex justify-between text-paper/60">
            <span>التوصيل</span>
            <span>{formatEGP(order.deliveryFee ?? 0)}</span>
          </div>
          <div className="flex justify-between border-t border-coal-line pt-2 text-lg font-bold text-white">
            <span>الإجمالي</span>
            <span className="text-blood-bright">{formatEGP(order.total ?? 0)}</span>
          </div>
        </div>
      </Section>

      {/* Actions */}
      {nextStatuses.length > 0 && (
        <Section title="تحديث الحالة">
          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((s) => (
              <button
                key={s}
                type="button"
                disabled={updating}
                onClick={() => handleUpdate(s)}
                className={`min-h-[44px] rounded-md px-4 text-sm font-bold transition-colors disabled:opacity-50 ${STATUS_COLOR[s] ?? 'bg-coal-soft'}`}
              >
                {STATUS_LABEL_AR[s] ?? s}
              </button>
            ))}
          </div>
          {error && (
            <p role="alert" className="mt-3 text-sm text-blood-bright">
              {error}
            </p>
          )}
        </Section>
      )}
    </div>
  )
}