import { useState } from 'react'
import { motion } from 'framer-motion'
import { PAYMENT_CONFIG } from '../domain/paymentConfig.js'

const Box = ({ label, children }) => (
  <div className="rounded-md border border-coal-line bg-coal p-4">
    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-paper/50">
      {label}
    </p>
    <div className="flex items-center justify-between gap-3">
      {children}
    </div>
  </div>
)

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard may fail on http — ignore */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="نسخ"
      className="grid h-9 w-9 place-items-center rounded-md border border-coal-line text-paper/70 transition-colors hover:border-blood-bright hover:text-white"
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

export default function OnlinePayment() {
  const { vodafoneCash, instapay } = PAYMENT_CONFIG

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Steps */}
      <div className="rounded-card border border-coal-line bg-coal/40 p-5 sm:p-6">
        <h3 className="mb-4 text-lg font-bold text-white">
          طريقة الدفع الإلكتروني
        </h3>
        <ol className="space-y-3 text-sm text-paper/80">
          <li className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blood text-xs font-bold text-white">1</span>
            <span>حوّل المبلغ الإجمالي على أحد الأرقام اللي تحت.</span>
          </li>
          <li className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blood text-xs font-bold text-white">2</span>
            <span>احتفظ بـصورة الإيصال أو رقم العملية.</span>
          </li>
          <li className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blood text-xs font-bold text-white">3</span>
            <span>اضغط "تأكيد الطلب" تحت — هنبعت الطلب مع صورة الإيصال على واتساب.</span>
          </li>
        </ol>
      </div>

      {/* Vodafone Cash */}
      <Box label="فودافون كاش">
        <span className="font-bold text-white" dir="ltr">{vodafoneCash.displayNumber}</span>
        <CopyButton value={vodafoneCash.number} />
      </Box>

      {/* InstaPay */}
      <Box label="إنستاباي">
        <span className="font-bold text-white" dir="ltr">{instapay.handle}</span>
        <CopyButton value={instapay.handle} />
      </Box>

      {/* WhatsApp note */}
      <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4">
        <p className="text-sm text-paper/80">
          <span className="font-bold text-emerald-400">📱 واتساب:</span> بعد التحويل،
          ابعت صورة الإيصال على{' '}
          <span className="font-bold text-white" dir="ltr">
            {PAYMENT_CONFIG.whatsapp.displayNumber}
          </span>{' '}
          مع رقم طلبك.
        </p>
      </div>
    </motion.div>
  )
}