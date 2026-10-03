import Drawer from '../../../shared/ui/Drawer.jsx'
import Button from '../../../shared/ui/Button.jsx'
import { formatEGP } from '../../../shared/lib/money.js'
import { LIMITS } from '../domain/cartMath.js'
import { useCart } from '../CartProvider.jsx'

const ISSUE_AR = {
  'not-found': 'المنتج ده اتشال من المنيو', unavailable: 'غير متاح حالياً', 'invalid-variant': 'الحجم ده لم يعد متاحاً',
  'variant-required': 'لازم تختار الحجم', 'invalid-addon': 'إضافة لم تعد متاحة',
}
const Row = ({ label, value, strong }) => (
  <div className={`flex justify-between ${strong ? 'text-lg font-bold' : 'text-paper/80'}`}><span>{label}</span><span>{value}</span></div>
)

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, ready, items, summary, orderType, setOrderType, setQty, remove, removeInvalid } = useCart()
  return (
    <Drawer open={drawerOpen} onClose={closeDrawer} title="سلتك">
      {!ready ? <p className="p-5 text-paper/70">جاري التحميل...</p>
        : items.length === 0 ? (
          <div className="space-y-4 p-5"><p className="text-paper/70">السلة فاضية. ابدأ باختيار حاجة من المنيو.</p>
            <Button to="/menu" onClick={closeDrawer}>تصفح المنيو</Button></div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto p-5">
              {summary.lines.map((l, i) => (
                <li key={i} className="rounded-lg border border-coal-line p-3">
                  <div className="flex justify-between gap-3">
                    <p className="font-bold">{l.product?.name ?? 'منتج غير موجود'}</p>
                    {!l.issue && <p className="font-bold">{formatEGP(l.lineTotal)}</p>}
                  </div>
                  {!l.issue && <p className="text-sm text-paper/60">{[l.variant?.name, ...l.addOns.map((a) => a.name)].filter(Boolean).join(' • ')}</p>}
                  {l.issue && <p role="alert" className="text-sm text-blood-bright">{ISSUE_AR[l.issue]}</p>}
                  <div className="mt-2 flex items-center justify-between">
                    {!l.issue ? (
                      <div className="flex items-center rounded-md border border-coal-line">
                        <button type="button" aria-label="تقليل" className="h-11 w-11" onClick={() => setQty(i, l.line.qty - 1)}>−</button>
                        <span className="w-8 text-center font-bold" aria-live="polite">{l.line.qty}</span>
                        <button type="button" aria-label="زيادة" className="h-11 w-11 disabled:opacity-40" disabled={l.line.qty >= LIMITS.MAX_QTY} onClick={() => setQty(i, l.line.qty + 1)}>+</button>
                      </div>
                    ) : <span />}
                    <button type="button" className="min-h-[44px] px-2 text-sm text-paper/70 hover:text-white" onClick={() => remove(i)}>حذف</button>
                  </div>
                </li>
              ))}
              {summary.hasIssues && <Button variant="dark" size="sm" onClick={removeInvalid}>حذف العناصر غير المتاحة</Button>}
            </ul>
            <div className="space-y-3 border-t border-coal-line p-5" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="نوع الطلب">
                {[['delivery', 'توصيل'], ['pickup', 'استلام']].map(([v, t]) => (
                  <button key={v} type="button" aria-pressed={orderType === v} onClick={() => setOrderType(v)}
                    className={`min-h-[44px] rounded-md font-bold ${orderType === v ? 'bg-blood text-white' : 'border border-coal-line'}`}>{t}</button>
                ))}
              </div>
              <Row label="المجموع الفرعي" value={formatEGP(summary.subtotal)} />
              {summary.discount > 0 && <Row label="الخصم" value={`− ${formatEGP(summary.discount)}`} />}
              <Row label="التوصيل" value={orderType === 'delivery' ? formatEGP(summary.deliveryFee) : 'مجاناً (استلام)'} />
              <Row strong label="الإجمالي التقديري" value={formatEGP(summary.total)} />
              <p className="text-sm text-paper/50">الإجمالي النهائي بيتحسب من السيرفر عند تأكيد الطلب.</p>
              <Button className="w-full" disabled>إتمام الطلب (قريباً)</Button>
            </div>
          </>
        )}
    </Drawer>
  )
}
