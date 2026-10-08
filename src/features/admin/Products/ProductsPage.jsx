import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatEGP } from '@/shared/lib/money.js'
import { subscribeProducts, upsertProduct, archiveProduct } from '../data/adminProductsRepo.js'
import { useMenu } from '@/features/menu/MenuProvider.jsx'
import ProductForm from './ProductForm.jsx'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | product object
  const [filter, setFilter] = useState('all') // 'all' | 'active' | 'inactive'

  const { categories } = useMenu()

  useEffect(() => {
    setLoading(true)
    const unsub = subscribeProducts(
      (data) => {
        setProducts(data)
        setLoading(false)
      },
      (err) => {
        setError('تعذر تحميل المنتجات.')
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'active') return products.filter((p) => p.isActive !== false)
    if (filter === 'inactive') return products.filter((p) => p.isActive === false)
    return products
  }, [products, filter])

  const handleSave = async (form) => {
    await upsertProduct(form.id, form)
    setEditing(null)
  }

  const handleArchive = async (id) => {
    if (!confirm('متأكد إنك عايز تخفي المنتج ده؟')) return
    await archiveProduct(id)
  }

  if (loading) {
    return <div className="p-8 text-center text-paper/60">جاري التحميل...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-blood-bright">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">إدارة المنتجات</h1>
          <p className="mt-1 text-sm text-paper/60">{products.length} منتج</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="min-h-[48px] rounded-md bg-blood px-5 font-bold text-white transition-colors hover:bg-blood-bright"
        >
          + إضافة منتج
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'active', label: 'ظاهر' },
          { id: 'inactive', label: 'مخفي' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`min-h-[40px] rounded-md px-4 text-sm font-bold transition-colors ${
              filter === f.id
                ? 'bg-blood text-white'
                : 'border border-coal-line text-paper/70 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Form (when adding/editing) */}
      <AnimatePresence>
        {editing && (
          <ProductForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={editing === 'new' ? null : editing}
            categories={categories}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </AnimatePresence>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="rounded-card border border-coal-line bg-coal/40 py-12 text-center text-paper/50">
          مفيش منتجات.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              className={`rounded-card border border-coal-line bg-coal/40 p-3 ${
                p.isActive === false ? 'opacity-60' : ''
              }`}
            >
              <div className="flex gap-3">
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt=""
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-md object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-white">{p.name}</p>
                  <p className="truncate text-xs text-paper/50">
                    {p.categoryId} · {p.id}
                  </p>
                  <p className="mt-1 font-bold text-blood-bright">
                    {formatEGP(p.basePrice)}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.isActive === false && (
                      <span className="rounded bg-coal-soft px-1.5 py-0.5 text-xs text-paper/50">مخفي</span>
                    )}
                    {p.isAvailable === false && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-300">غير متاح</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(p)}
                  className="min-h-[36px] flex-1 rounded-md border border-coal-line text-xs font-bold text-paper/80 hover:border-paper/30 hover:text-white"
                >
                  تعديل
                </button>
                {p.isActive !== false ? (
                  <button
                    type="button"
                    onClick={() => handleArchive(p.id)}
                    className="min-h-[36px] flex-1 rounded-md border border-coal-line text-xs font-bold text-paper/60 hover:text-white"
                  >
                    إخفاء
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => upsertProduct(p.id, { ...p, isActive: true })}
                    className="min-h-[36px] flex-1 rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
                  >
                    إظهار
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}