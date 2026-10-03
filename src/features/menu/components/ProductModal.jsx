import { useState } from 'react'
import Modal from '../../../shared/ui/Modal.jsx'
import Button from '../../../shared/ui/Button.jsx'
import { formatEGP } from '../../../shared/lib/money.js'
import { LIMITS, resolveLine } from '../../cart/domain/cartMath.js'
import { useCart } from '../../cart/CartProvider.jsx'
import ProductArt from './ProductArt.jsx'

const ERR_AR = { 'cart-full': 'السلة وصلت للحد الأقصى من الأصناف.', 'max-qty': 'وصلت للحد الأقصى للكمية.', 'invalid-item': 'اختيار غير صالح.' }

function Body({ product, onClose }) {
  const { addItem, openDrawer } = useCart()
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? null)
  const [addOnIds, setAddOnIds] = useState([])
  const [qty, setQty] = useState(1)
  const [err, setErr] = useState(null)

  const toggle = (id) => setAddOnIds((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))
  // Display-only estimate through the same pure domain code the cart uses. The server re-prices the real order.
  const preview = resolveLine({ productId: product.id, variantId, addOnIds, qty }, new Map([[product.id, product]]))
  const add = () => {
    const e = addItem({ productId: product.id, variantId, addOnIds, qty })
    setErr(e)
    if (!e) { onClose(); openDrawer() }
  }

  return (
    <div className="space-y-5">
      <ProductArt name={product.name} src={product.imageUrl} className="rounded-lg" />
      {product.description && <p className="text-paper/80">{product.description}</p>}

      {product.variants.length > 0 && (
        <fieldset>
          <legend className="mb-2 font-bold">الحجم</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button key={v.id} type="button" aria-pressed={variantId === v.id} onClick={() => setVariantId(v.id)}
                className={`min-h-[44px] rounded-md border px-4 font-medium ${variantId === v.id ? 'border-blood-bright bg-blood/20' : 'border-coal-line hover:border-paper/40'}`}>
                {v.name}{v.priceDelta ? <span className="text-paper/60"> (+{formatEGP(v.priceDelta)})</span> : null}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {product.addOns.length > 0 && (
        <fieldset>
          <legend className="mb-1 font-bold">إضافات</legend>
          {product.addOns.map((a) => (
            <label key={a.id} className="flex min-h-[44px] cursor-pointer items-center gap-3">
              <input type="checkbox" className="h-5 w-5 accent-blood-bright" checked={addOnIds.includes(a.id)} onChange={() => toggle(a.id)} />
              <span>{a.name} <span className="text-paper/60">(+{formatEGP(a.price)})</span></span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-coal-line">
          <button type="button" aria-label="تقليل" className="h-12 w-12" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
          <button type="button" aria-label="زيادة" className="h-12 w-12 disabled:opacity-40" disabled={qty >= LIMITS.MAX_QTY} onClick={() => setQty((q) => Math.min(LIMITS.MAX_QTY, q + 1))}>+</button>
        </div>
        <Button className="flex-1" disabled={!!preview.issue} onClick={add}>
          إضافة للسلة{!preview.issue && ` · ${formatEGP(preview.lineTotal)}`}
        </Button>
      </div>
      {err && <p role="alert" className="text-sm text-blood-bright">{ERR_AR[err]}</p>}
      <p className="text-sm text-paper/50">السعر تقديري، والإجمالي النهائي بيتحسب عند تأكيد الطلب.</p>
    </div>
  )
}

export default function ProductModal({ product, onClose }) {
  return (
    <Modal open={!!product} onClose={onClose} title={product?.name ?? ''}>
      {product && <Body key={product.id} product={product} onClose={onClose} />}
    </Modal>
  )
}