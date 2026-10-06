import { motion } from 'framer-motion'
import { PAYMENT_METHODS } from '../domain/orderModel.js'

const OPTIONS = [
  {
    id: PAYMENT_METHODS.CASH,
    title: 'الدفع عند الاستلام',
    description: 'ادفع كاش للمندوب لما يوصلك الطلب',
    icon: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 10h.01M18 14h.01" />
      </>
    ),
  },
  {
    id: PAYMENT_METHODS.ONLINE,
    title: 'دفع إلكتروني',
    description: 'فودافون كاش أو إنستاباي — أسرع وأسهل',
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 15h4" />
      </>
    ),
  },
]

export default function PaymentMethodPicker({ value, onChange }) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="طريقة الدفع">
      {OPTIONS.map((opt) => {
        const selected = value === opt.id
        return (
          <motion.button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            whileTap={{ scale: 0.98 }}
            className={`flex w-full items-start gap-4 rounded-card border-2 p-4 text-start transition-all sm:p-5 ${
              selected
                ? 'border-blood-bright bg-blood/10 shadow-red-glow'
                : 'border-coal-line bg-coal-soft hover:border-paper/30'
            }`}
          >
            {/* Icon */}
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-md transition-colors ${
                selected ? 'bg-blood text-white' : 'bg-coal text-paper/70'
              }`}
              aria-hidden
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {opt.icon}
              </svg>
            </span>

            {/* Text */}
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-white">{opt.title}</h3>
              <p className="text-sm text-paper/60">{opt.description}</p>
            </div>

            {/* Radio indicator */}
            <span
              aria-hidden
              className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                selected ? 'border-blood-bright bg-blood-bright' : 'border-coal-line'
              }`}
            >
              {selected && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}