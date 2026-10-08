import { formatEGP } from '@/shared/lib/money.js'
import { ORDER_STATUS, STATUS_LABEL_AR, STATUS_COLOR } from '../data/orderStatus.js'

const FILTERS = [
  { id: 'all', label: 'الكل' },
  { id: ORDER_STATUS.NEW, label: STATUS_LABEL_AR[ORDER_STATUS.NEW] },
  { id: ORDER_STATUS.CONFIRMED, label: STATUS_LABEL_AR[ORDER_STATUS.CONFIRMED] },
  { id: ORDER_STATUS.PREPARING, label: STATUS_LABEL_AR[ORDER_STATUS.PREPARING] },
  { id: ORDER_STATUS.OUT_FOR_DELIVERY, label: STATUS_LABEL_AR[ORDER_STATUS.OUT_FOR_DELIVERY] },
  { id: ORDER_STATUS.DELIVERED, label: STATUS_LABEL_AR[ORDER_STATUS.DELIVERED] },
]

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}/${m}/${day} ${hh}:${mm}`
}

export default function OrdersList({ orders, selectedId, onSelect, filter, onFilterChange }) {
  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="no-scrollbar -mx-2 flex gap-2 overflow-x-auto px-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onFilterChange(f.id)}
            aria-pressed={filter === f.id}
            className={`min-h-[40px] whitespace-nowrap rounded-md px-3 text-sm font-bold transition-colors ${
              filter === f.id
                ? 'bg-blood text-white'
                : 'border border-coal-line text-paper/70 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="rounded-card border border-coal-line bg-coal/40 py-12 text-center text-paper/50">
          مفيش طلبات {filter !== 'all' ? `بحالة "${STATUS_LABEL_AR[filter]}"` : 'دلوقتي'}.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((o) => {
            const isSelected = o.id === selectedId
            return (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => onSelect(o.id)}
                  className={`w-full rounded-card border p-3 text-start transition-colors ${
                    isSelected
                      ? 'border-blood-bright bg-blood/10'
                      : 'border-coal-line bg-coal/40 hover:border-paper/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-white">
                        {o.customer?.name ?? 'بدون اسم'}
                      </p>
                      <p className="truncate text-xs text-paper/60" dir="ltr">
                        {o.customer?.phone ?? '—'}
                      </p>
                      <p className="mt-1 text-xs text-paper/40">
                        {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${STATUS_COLOR[o.status] ?? 'bg-coal-soft'}`}>
                        {STATUS_LABEL_AR[o.status] ?? o.status}
                      </span>
                      <span className="text-sm font-bold text-blood-bright">
                        {formatEGP(o.total ?? 0)}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}