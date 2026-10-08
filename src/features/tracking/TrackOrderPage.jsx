import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/features/auth/AuthProvider.jsx'
import { formatEGP } from '@/shared/lib/money.js'
import { subscribeMyOrders } from './data/trackingRepo.js'
import {
  ORDER_STATUS,
  STATUS_LABEL_AR,
  STATUS_COLOR,
} from '@/features/admin/data/orderStatus.js'

const STATUS_ICON = {
  [ORDER_STATUS.NEW]: '🆕',
  [ORDER_STATUS.CONFIRMED]: '✅',
  [ORDER_STATUS.PREPARING]: '👨‍🍳',
  [ORDER_STATUS.READY]: '📦',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: '🛵',
  [ORDER_STATUS.DELIVERED]: '🎉',
  [ORDER_STATUS.CANCELLED]: '❌',
}

const STEPS = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
]

function StatusBadge({ status }) {
  return (
    <span className={`rounded-md px-3 py-1 text-xs font-bold ${STATUS_COLOR[status] ?? 'bg-coal-soft'}`}>
      {STATUS_LABEL_AR[status] ?? status}
    </span>
  )
}

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function OrderCard({ order }) {
  const currentIdx = STEPS.indexOf(order.status)
  const isCancelled = order.status === ORDER_STATUS.CANCELLED

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-card border border-coal-line bg-coal/40 p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-paper/50">
            رقم الطلب
          </p>
          <p className="font-bold text-white" dir="ltr">
            {order.orderNumber ?? order.id}
          </p>
          <p className="mt-1 text-xs text-paper/50">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Progress bar */}
      {!isCancelled && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const done = i <= currentIdx
              return (
                <div key={s} className="flex flex-1 flex-col items-center">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-full border-2 text-lg transition-colors ${
                      done
                        ? 'border-blood-bright bg-blood text-white'
                        : 'border-coal-line bg-coal text-paper/40'
                    }`}
                  >
                    {STATUS_ICON[s] ?? '•'}
                  </div>
                  <span
                    className={`mt-2 text-center text-xs ${
                      done ? 'font-bold text-white' : 'text-paper/40'
                    }`}
                  >
                    {STATUS_LABEL_AR[s]}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`absolute h-0.5 w-full ${
                        i < currentIdx ? 'bg-blood' : 'bg-coal-line'
                      }`}
                      style={{ display: 'none' }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="mt-4 rounded-md border border-coal-line bg-coal p-3 text-center text-sm text-paper/60">
          تم إلغاء الطلب
        </div>
      )}

      {/* Items */}
      <div className="mt-5 border-t border-coal-line pt-4">
        <ul className="space-y-1.5 text-sm">
          {(order.items ?? []).map((it, i) => (
            <li key={i} className="flex justify-between text-paper/80">
              <span>
                {it.productId} <span className="text-paper/50">×{it.qty}</span>
              </span>
              <span>{formatEGP(it.price ?? 0)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-coal-line pt-3 text-lg font-bold text-white">
          <span>الإجمالي</span>
          <span className="text-blood-bright">{formatEGP(order.total ?? 0)}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function TrackOrderPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return undefined
    }
    setLoading(true)
    setError(null)

    const unsub = subscribeMyOrders(
      user.uid,
      (data) => {
        setOrders(data)
        setLoading(false)
      },
      (err) => {
        setError('تعذر تحميل الطلبات. حاول تحديث الصفحة.')
        setLoading(false)
      }
    )
    return () => unsub()
  }, [user])

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    if (!s) return orders
    return orders.filter(
      (o) =>
        o.orderNumber?.toLowerCase().includes(s) ||
        o.id?.toLowerCase().includes(s)
    )
  }, [orders, search])

  // ---- Auth required ----
  if (authLoading) {
    return (
      <div className="container-page py-16 text-center text-paper/60">
        جاري التحميل...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-2xl font-bold text-white">تتبع طلباتك</h1>
        <p className="mt-3 text-paper/60">
          لازم تسجّل دخول عشان تشوف طلباتك.
        </p>
        <Link
          to="/login"
          state={{ from: '/track-order' }}
          className="mt-6 inline-block min-h-[48px] rounded-md bg-blood px-6 py-3 font-bold text-white transition-colors hover:bg-blood-bright"
        >
          تسجيل الدخول
        </Link>
      </div>
    )
  }

  return (
    <div className="container-page py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          تتبع طلباتك
        </h1>
        <p className="mt-2 text-sm text-paper/60">
          تابع حالة طلباتك لحظة بلحظة
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث برقم الطلب..."
          className="min-h-[48px] w-full rounded-md border border-coal-line bg-coal-soft px-4 text-paper placeholder:text-paper/40 focus:border-blood-bright focus:outline-none sm:max-w-md"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center text-paper/60">جاري التحميل...</div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-md border border-blood/40 bg-blood/10 p-4 text-center text-blood-bright" role="alert">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-card border border-coal-line bg-coal/40 py-16 text-center">
          <p className="text-paper/60">
            {search.trim()
              ? `مفيش طلب برقم "${search}"`
              : 'مفيش طلبات لسه.'}
          </p>
          {!search.trim() && (
            <Link
              to="/menu"
              className="mt-6 inline-block min-h-[48px] rounded-md bg-blood px-6 py-3 font-bold text-white transition-colors hover:bg-blood-bright"
            >
              اطلب دلوقتي
            </Link>
          )}
        </div>
      )}

      {/* Orders */}
      <div className="grid gap-5 md:grid-cols-2">
        <AnimatePresence>
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}