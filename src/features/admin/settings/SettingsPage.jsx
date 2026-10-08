import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { formatEGP } from '@/shared/lib/money.js'
import { subscribeSettings, updateSettings } from '../data/adminSettingsRepo.js'

const inputCls =
  'min-h-[48px] w-full rounded-md border border-coal-line bg-coal-soft px-4 text-paper focus:border-blood-bright focus:outline-none'
const labelCls = 'mb-1.5 block text-sm font-bold text-white'

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ deliveryFeeEgp: 30, freeDeliveryOverEgp: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsub = subscribeSettings(
      (data) => {
        setSettings(data)
        setForm({
          deliveryFeeEgp: data.deliveryFee / 100,
          freeDeliveryOverEgp: data.freeDeliveryOver ? data.freeDeliveryOver / 100 : '',
        })
        setLoading(false)
      },
      () => {
        setError('تعذر تحميل الإعدادات.')
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setMsg(null)
    setError(null)
    setSaving(true)
    try {
      await updateSettings({
        deliveryFee: Math.round(Number(form.deliveryFeeEgp) * 100),
        freeDeliveryOver:
          form.freeDeliveryOverEgp === ''
            ? null
            : Math.round(Number(form.freeDeliveryOverEgp) * 100),
      })
      setMsg('✅ تم الحفظ بنجاح')
      setTimeout(() => setMsg(null), 3000)
    } catch (err) {
      console.error(err)
      setError('تعذر حفظ الإعدادات.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-paper/60">جاري التحميل...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">الإعدادات العامة</h1>
        <p className="mt-1 text-sm text-paper/60">إعدادات التوصيل والأسعار</p>
      </div>

      <motion.form
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl space-y-5 rounded-card border border-coal-line bg-coal/40 p-5 sm:p-6"
      >
        <div>
          <label className={labelCls}>رسوم التوصيل (بالجنيه)</label>
          <input
            type="number"
            min="0"
            step="0.25"
            value={form.deliveryFeeEgp}
            onChange={(e) => setForm((f) => ({ ...f, deliveryFeeEgp: e.target.value }))}
            className={inputCls}
            dir="ltr"
          />
          <p className="mt-1 text-xs text-paper/40">
            {formatEGP(Math.round((Number(form.deliveryFeeEgp) || 0) * 100))}
          </p>
        </div>

        <div>
          <label className={labelCls}>حد التوصيل المجاني (اختياري)</label>
          <input
            type="number"
            min="0"
            step="0.25"
            value={form.freeDeliveryOverEgp}
            onChange={(e) => setForm((f) => ({ ...f, freeDeliveryOverEgp: e.target.value }))}
            placeholder="مثال: 200 (اتركه فاضي لتعطيله)"
            className={inputCls}
            dir="ltr"
          />
          <p className="mt-1 text-xs text-paper/40">
            لو مجموع الطلب ≥ الرقم ده، التوصيل مجاني.
          </p>
        </div>

        {msg && <p className="text-sm text-emerald-400">{msg}</p>}
        {error && <p role="alert" className="text-sm text-blood-bright">{error}</p>}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="min-h-[48px] w-full rounded-md bg-blood px-6 font-bold text-white transition-colors hover:bg-blood-bright disabled:opacity-50 sm:w-auto"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>

        {settings && (
          <div className="mt-4 rounded-md border border-coal-line bg-coal p-3 text-xs text-paper/60">
            <p>
              <span className="text-paper/40">القيم الحالية: </span>
              توصيل {formatEGP(settings.deliveryFee)}
              {settings.freeDeliveryOver
                ? ` · مجاني فوق ${formatEGP(settings.freeDeliveryOver)}`
                : ''}
            </p>
          </div>
        )}
      </motion.form>
    </div>
  )
}