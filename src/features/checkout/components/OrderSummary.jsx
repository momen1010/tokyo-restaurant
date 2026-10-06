import { motion, AnimatePresence } from 'framer-motion'
import { formatEGP } from '@/shared/lib/money.js'
import { useCart } from '@/features/cart/CartProvider.jsx'
import { useMenu } from '@/features/menu/MenuProvider.jsx'

export default function OrderSummary() {
  const { items, subtotal, deliveryFee, total } = useCart()
  const { catalog } = useMenu()

  return (
    <aside
      className="rounded-card border border-coal-line bg-coal/40 p-5 lg:sticky lg:top-24"
      aria-label="ملخص الطلب"
    >
      <h2 className="mb-4 text-lg font-bold text-white">ملخص الطلب</h2>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-paper/50">
          سلتك فاضية — ضيف حاجة الأول
        </p>
      ) : (
        <>
          <ul className="mb-5 max-h-[40vh] space-y-3 overflow-y-auto pe-1">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const product = catalog.get(item.productId)
                if (!product) return null
                const lineTotal = (item.unitPrice ?? product.basePrice) * item.qty
                return (
                  <motion.li
                    key={`${item.productId}-${item.variantId ?? 'x'}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-blood/20 text-xs font-bold text-blood-bright">
                      ×{item.qty}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-white">{product.name}</p>
                      {item.addOnIds?.length > 0 && (
                        <p className="text-xs text-paper/50">
                          + إضافات ({item.addOnIds.length})
                        </p>
                      )}
                    </div>
                    <span className="whitespace-nowrap font-bold text-paper/80">
                      {formatEGP(lineTotal)}
                    </span>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>

          <div className="space-y-2 border-t border-coal-line pt-4 text-sm">
            <div className="flex justify-between text-paper/70">
              <span>المجموع الفرعي</span>
              <span>{formatEGP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-paper/70">
              <span>التوصيل</span>
              <span>{deliveryFee > 0 ? formatEGP(deliveryFee) : 'مجاني'}</span>
            </div>
            <div className="flex items-center justify-between border-t border-coal-line pt-3 text-lg font-bold text-white">
              <span>الإجمالي</span>
              <span className="text-blood-bright">{formatEGP(total)}</span>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}