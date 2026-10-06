import { motion } from 'framer-motion'

export default function CashOnDelivery() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-card border border-coal-line bg-coal/40 p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blood/15 text-blood-bright"
          aria-hidden
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        </span>
        <div>
          <h3 className="mb-2 text-lg font-bold text-white">الدفع عند الاستلام</h3>
          <p className="text-sm leading-relaxed text-paper/70">
            هتدفع كاش للمندوب عند استلام الطلب. من فضلك جهّز المبلغ بالظبط لتسهيل العملية.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-blood/30 bg-blood/5 p-4">
        <p className="text-sm text-paper/80">
          <span className="font-bold text-white">💡 نصيحة:</span> خليك جاهز بالمبلغ
          بالظبط عشان العملية تمشي بسرعة.
        </p>
      </div>
    </motion.div>
  )
}