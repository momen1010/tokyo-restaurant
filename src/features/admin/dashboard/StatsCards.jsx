import { formatEGP } from '@/shared/lib/money.js'
import { ORDER_STATUS, STATUS_LABEL_AR } from '../data/orderStatus.js'

const Card = ({ label, value, accent = 'text-white' }) => (
  <div className="rounded-card border border-coal-line bg-coal/40 p-4">
    <p className="text-xs font-bold uppercase tracking-wider text-paper/50">
      {label}
    </p>
    <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
  </div>
)

export default function StatsCards({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="إجمالي الطلبات" value={stats.total} />
      <Card label="جديدة" value={stats.new} accent="text-blood-bright" />
      <Card label="قيد التنفيذ" value={stats.confirmed + stats.preparing + stats.ready} accent="text-amber-400" />
      <Card label="الإيرادات (مكتملة)" value={formatEGP(stats.revenue)} accent="text-emerald-400" />
    </div>
  )
}