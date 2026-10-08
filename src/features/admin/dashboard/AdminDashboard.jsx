import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/AuthProvider.jsx'
import { subscribeOrders, computeStats, getOrder } from '../data/adminOrdersRepo.js'
import useOrderNotification from '../hooks/useOrderNotification.js'
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

  // Subscribe to orders
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

  // Notify on new orders
  useOrderNotification(orders, true)

  // Fetch selected order
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
    getOrder(selectedId).then(setSelectedOrder).catch(console.error)
  }, [selectedId, orders])

  const stats = useMemo(() => computeStats(orders), [orders])

  // Auto-select first order
  useEffect(() => {
    if (!selectedId && orders.length > 0 && filter === 'all') {
      setSelectedId(orders[0].id)
    }
  }, [orders, selectedId, filter])

  if (loading) {
    return <div className="p-8 text-center text-paper/60">جاري تحميل الطلبات...</div>
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
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-paper/60">
          متابعة الطلبات الحية وتحديث حالتها
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-card border border-coal-line bg-coal/20 p-4">
          <OrdersList
            orders={orders}
            selectedId={selectedId}
            onSelect={setSelectedId}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>

        <div className="rounded-card border border-coal-line bg-coal/20 p-4 sm:p-6">
          <OrderDetail
            order={selectedOrder}
            onUpdated={() => {
              // Subscription updates orders automatically
            }}
          />
        </div>
      </div>
    </div>
  )
}