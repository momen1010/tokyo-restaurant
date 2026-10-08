import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/AuthProvider.jsx'
import { subscribeOrders, computeStats, getOrder } from '../data/adminOrdersRepo.js'
import StatsCards from './StatsCards.jsx'
import OrdersList from './OrdersList.jsx'
import OrderDetail from './OrderDetail.jsx'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Subscribe to orders (real-time)
  useEffect(() => {
    if (!user) return undefined
    setLoading(true)
    setError(null)

    const unsub = subscribeOrders(
      { max: 200 },
      (data) => {
        setOrders(data)
        setLoading(false)
      },
      (err) => {
        console.error('[AdminDashboard] subscribe error:', err)
        setError('تعذر تحميل الطلبات. حاول تحديث الصفحة.')
        setLoading(false)
      }
    )

    return () => unsub()
  }, [user])

  // Fetch selected order details (in case not in the current page)
  useEffect(() => {
    if (!selectedId) {
      setSelectedOrder(null)
      return
    }
    const fromList = orders.find((o) => o.id === selectedId)
    if (fromList) {
      setSelectedOrder(fromList)
      return
    }
    // Fallback: fetch one
    getOrder(selectedId).then(setSelectedOrder).catch(console.error)
  }, [selectedId, orders])

  const stats = useMemo(() => computeStats(orders), [orders])

  // Auto-select first order when filter changes and selection is out of view
  useEffect(() => {
    if (!selectedId && orders.length > 0 && filter === 'all') {
      setSelectedId(orders[0].id)
    }
  }, [orders, selectedId, filter])

  if (loading) {
    return (
      <div className="p-8 text-center text-paper/60">جاري تحميل الطلبات...</div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-blood-bright" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-paper/60">
          متابعة الطلبات الحية وتحديث حالتها
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Two-column layout: list + detail */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* List */}
        <div className="rounded-card border border-coal-line bg-coal/20 p-4">
          <OrdersList
            orders={orders}
            selectedId={selectedId}
            onSelect={setSelectedId}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>

        {/* Detail */}
        <div className="rounded-card border border-coal-line bg-coal/20 p-4 sm:p-6">
          <OrderDetail
            order={selectedOrder}
            onUpdated={() => {
              // Subscription will update `orders` automatically.
              // No-op needed.
            }}
          />
        </div>
      </div>
    </div>
  )
}