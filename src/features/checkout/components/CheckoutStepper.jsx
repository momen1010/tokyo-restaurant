import { motion } from 'framer-motion'

const STEPS = [
  { id: 1, label: 'بيانات التوصيل' },
  { id: 2, label: 'طريقة الدفع' },
  { id: 3, label: 'التأكيد' },
]

export default function CheckoutStepper({ current = 1 }) {
  return (
    <ol
      className="flex items-center justify-center gap-2 sm:gap-4"
      aria-label="مراحل إتمام الطلب"
    >
      {STEPS.map((step, i) => {
        const isActive = step.id === current
        const isDone = step.id < current
        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.span
                initial={false}
                animate={{
                  backgroundColor: isActive || isDone ? '#E11D2E' : '#1F1F1F',
                  borderColor: isActive ? '#FF2D4A' : isDone ? '#E11D2E' : '#2E2E2E',
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold text-white sm:h-10 sm:w-10"
              >
                {isDone ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.id
                )}
              </motion.span>
              <span
                className={`hidden text-sm font-bold transition-colors sm:inline ${
                  isActive ? 'text-white' : isDone ? 'text-paper/80' : 'text-paper/40'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={`h-0.5 w-6 transition-colors sm:w-12 ${
                  step.id < current ? 'bg-blood' : 'bg-coal-line'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}