import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatEGP } from '@/shared/lib/money.js'

const inputCls =
  'min-h-[48px] w-full rounded-md border border-coal-line bg-coal-soft px-4 text-paper placeholder:text-paper/40 focus:border-blood-bright focus:outline-none'
const labelCls = 'mb-1.5 block text-sm font-bold text-white'

const emptyProduct = {
  id: '',
  name: '',
  description: '',
  categoryId: '',
  basePrice: 0, // in EGP for the form; converted to piasters on save
  imageUrl: '',
  sortOrder: 0,
  isActive: true,
  isAvailable: true,
  variants: [],
  addOns: [],
}

export default function ProductForm({ initial, categories, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    if (!initial) return { ...emptyProduct }
    return {
      ...emptyProduct,
      ...initial,
      basePrice: (initial.basePrice ?? 0) / 100, // convert piasters → EGP
    }
  })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!form.id.trim() || !/^[a-z0-9-]+$/.test(form.id)) {
      setError('المعرّف (ID) لازم يكون بحروف إنجليزية صغيرة وأرقام وشرطات فقط.')
      return
    }
    if (!form.name.trim()) {
      setError('الاسم مطلوب.')
      return
    }
    if (!form.categoryId) {
      setError('اختار القسم.')
      return
    }
    if (!form.basePrice || form.basePrice <= 0) {
      setError('السعر لازم يكون أكبر من صفر.')
      return
    }

    setSaving(true)
    try {
      await onSubmit({
        ...form,
        basePrice: Math.round(form.basePrice * 100), // EGP → piasters
      })
    } catch (err) {
      console.error('[ProductForm] submit error:', err)
      setError('تعذر حفظ المنتج. حاول تاني.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-card border border-coal-line bg-coal/40 p-5"
    >
      <h3 className="text-lg font-bold text-white">
        {initial ? 'تعديل منتج' : 'إضافة منتج جديد'}
      </h3>

      {/* ID (read-only when editing) */}
      <div>
        <label className={labelCls}>
          المعرّف (ID) <span className="text-blood-bright">*</span>
        </label>
        <input
          type="text"
          value={form.id}
          onChange={(e) => set('id', e.target.value.toLowerCase())}
          disabled={!!initial}
          placeholder="مثال: crepe-nutella"
          className={`${inputCls} ${initial ? 'opacity-60' : ''}`}
          dir="ltr"
        />
        <p className="mt-1 text-xs text-paper/40">
          حروف إنجليزية صغيرة، أرقام، وشرطات فقط.
        </p>
      </div>

      {/* Name */}
      <div>
        <label className={labelCls}>الاسم <span className="text-blood-bright">*</span></label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="كريب نوتيلا"
          className={inputCls}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>الوصف</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows="2"
          className={`${inputCls} min-h-[80px] resize-y py-3`}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelCls}>القسم <span className="text-blood-bright">*</span></label>
        <select
          value={form.categoryId}
          onChange={(e) => set('categoryId', e.target.value)}
          className={inputCls}
        >
          <option value="">— اختار —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className={labelCls}>السعر (بالجنيه) <span className="text-blood-bright">*</span></label>
        <input
          type="number"
          min="0"
          step="0.25"
          value={form.basePrice}
          onChange={(e) => set('basePrice', Number(e.target.value) || 0)}
          placeholder="75"
          className={inputCls}
          dir="ltr"
        />
        <p className="mt-1 text-xs text-paper/40">
          {formatEGP(Math.round((form.basePrice || 0) * 100))}
        </p>
      </div>

      {/* Image URL */}
      <div>
        <label className={labelCls}>رابط الصورة</label>
        <input
          type="text"
          value={form.imageUrl}
          onChange={(e) => set('imageUrl', e.target.value)}
          placeholder="/images/crype.png"
          className={inputCls}
          dir="ltr"
        />
      </div>

      {/* Sort order */}
      <div>
        <label className={labelCls}>الترتيب</label>
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => set('sortOrder', Number(e.target.value) || 0)}
          className={inputCls}
          dir="ltr"
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set('isActive', e.target.checked)}
            className="h-5 w-5 rounded border-coal-line"
          />
          <span className="text-paper/80">ظاهر في الموقع</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => set('isAvailable', e.target.checked)}
            className="h-5 w-5 rounded border-coal-line"
          />
          <span className="text-paper/80">متاح للطلب</span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="text-sm text-blood-bright">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="min-h-[48px] flex-1 rounded-md bg-blood px-6 font-bold text-white transition-colors hover:bg-blood-bright disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[48px] rounded-md border border-coal-line px-6 font-bold text-paper/80 transition-colors hover:border-paper/30 hover:text-white"
        >
          إلغاء
        </button>
      </div>
    </motion.form>
  )
}