import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import WhatsAppButton from './WhatsAppButton.jsx'

export default function SuccessScreen({ result, waMessage, waPhone }) {
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E11D2E', '#FF2D4A', '#8B0F1F', '#F5F5F5'],
    })
    const t = setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#E11D2E', '#FF2D4A'],
      })
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#E11D2E', '#FF2D4A'],
      })
    }, 250)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-xl text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
        className="mx-auto grid h-24 w-24 place-items-center rounded-full border-4 border-emerald-500 bg-emerald-500/10"
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>

      <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
        تم استلام طلبك!
      </h1>
      <p className="mt-3 text-paper/70">
        شكرًا ليك 🙏 هنبدأ نجهّز طلبك حالًا. هنتواصل معاك خلال{' '}
        <span className="font-bold text-white">5 دقايق</span> لتأكيد التفاصيل.
      </p>

      <div className="mt-6 rounded-card border border-blood/30 bg-blood/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-paper/50">
          رقم الطلب
        </p>
        <p className="mt-1 font-display text-2xl font-bold text-blood-bright" dir="ltr">
          {result.orderNumber}
        </p>
      </div>

      {waMessage && waPhone && (
        <div className="mt-6">
          <WhatsAppButton message={waMessage} phone={waPhone} />
          <p className="mt-2 text-xs text-paper/50">
            ⚠️ مهم: ابعت الطلب على واتساب عشان نأكده بسرعة.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/menu"
          className="min-h-[48px] rounded-md bg-blood px-6 py-3 text-center font-bold text-white transition-colors hover:bg-blood-bright"
        >
          اطلب حاجة تانية
        </Link>
        <Link
          to="/"
          className="min-h-[48px] rounded-md border border-coal-line px-6 py-3 text-center font-bold text-paper/80 transition-colors hover:border-paper/30 hover:text-white"
        >
          الرئيسية
        </Link>
      </div>
    </motion.div>
  )
}