import { motion } from 'framer-motion'
import { formatEGP } from '@/shared/lib/money.js'
import { useCart } from '@/features/cart/CartProvider.jsx'
import { PAYMENT_METHODS } from '../domain/orderModel.js'
import { PAYMENT_CONFIG } from '../domain/paymentConfig.js'

const PAYMENT_LABEL = {
  [PAYMENT_METHODS.CASH]: 'الدفع عند الاستلام',
  [PAYMENT_METHODS.ONLINE]: 'دفع إلكتروني (فودافون كاش / إنستاباي)',
}

const Section = ({ title, children }) => (
  <div className="rounded-md border border-coal-line bg-coal p-4 sm:p-5">
    <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-paper/50">
      {title}
    </h3>
    {children}
  </div>
)

const Row = ({ label, value, strong, dir }) => (
  <div
    className={`flex items-center justify-between gap-3 py-1.5 ${
      strong ? 'text-lg font-bold text-white' : 'text-sm text-paper/80'
    }`}
  >
    <span>{label}</span>
    <span dir={dir}>{value}</span>
  </div>
)

export default function ConfirmationStep({ order, onBack, onConfirm, submitting, error }) {
  const { summary } = useCart()
  const lines = summary?.lines ?? []

  return (
    <div className="space-y-5">
      {/* Delivery */}
      <Section title="بيانات التوصيل">
        <div className="space-y-1">
          <Row label="الاسم" value={order.customerName} />
          <Row label="التليفون" value={order.customerPhone} dir="ltr" />
          <Row
            label={order.deliveryType === 'delivery' ? 'العنوان' : 'طريقة الاستلام'}
            value={order.deliveryType === 'delivery' ? order.customerAddress : 'استلام من الفرع'}
          />
          {order.customerNotes && <Row label="ملاحظات" value={order.customerNotes} />}
        </div>
      </Section>

      {/* Payment */}
      <Section title="طريقة الدفع">
        <Row label="الطريقة" value={PAYMENT_LABEL[order.paymentMethod]} />
        {order.paymentMethod === PAYMENT_METHODS.ONLINE && (
          <>
            <Row label="فودافون كاش" value={PAYMENT_CONFIG.vodafoneCash.displayNumber} dir="ltr" />
            <Row label="إنستاباي" value={PAYMENT_CONFIG.instapay.handle} dir="ltr" />
          </>
        )}
      </Section>

      {/* Items */}
      <Section title="تفاصيل الطلب">
        <ul className="space-y-2">
          {lines.map((l, i) => (
            <li key={i} className="flex items-start justify-between gap-3 text-sm">
              <div className="flex-1">
                <p className="font-bold text-white">{l.product?.name ?? '—'}</p>
                {(l.variant || (l.addOns && l.addOns.length)) && (
                  <p className="text-xs text-paper/50">
                    {[l.variant?.name, ...(l.addOns?.map((a) => a.name) ?? [])]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                )}
                <p className="mt-1 text-xs text-paper/60">×{l.line.qty}</p>
              </div>
              <span className="whitespace-nowrap font-bold text-paper/80">
                {formatEGP(l.lineTotal)}
              </span>
            </li>
          ))}
        </ul>

        {summary && (
          <div className="mt-4 space-y-1 border-t border-coal-line pt-3">
            <Row label="المجموع الفرعي" value={formatEGP(summary.subtotal)} />
            {summary.discount > 0 && (
              <Row label="الخصم" value={`− ${formatEGP(summary.discount)}`} />
            )}
            <Row
              label="التوصيل"
              value={
                order.deliveryType === 'delivery'
                  ? summary.deliveryFee > 0
                    ? formatEGP(summary.deliveryFee)
                    : 'مجاني'
                  : 'مجاناً (استلام)'
              }
            />
            <Row label="الإجمالي" value={formatEGP(summary.total)} strong />
          </div>
        )}
      </Section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-md border border-blood/40 bg-blood/10 p-4 text-sm text-blood-bright"
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3 pt-2 sm:flex-row-reverse"
      >
        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="min-h-[52px] flex-1 rounded-md bg-emerald-500 px-6 font-bold text-white shadow-lg transition-all hover:bg-emerald-400 hover:shadow-emerald-500/40 disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? 'جاري الإرسال...' : '✓ تأكيد وإرسال الطلب'}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="min-h-[52px] rounded-md border border-coal-line px-6 font-bold text-paper/80 transition-colors hover:border-paper/30 hover:text-white disabled:opacity-60"
        >
          ← رجوع
        </button>
      </motion.div>
    </div>
  )
}