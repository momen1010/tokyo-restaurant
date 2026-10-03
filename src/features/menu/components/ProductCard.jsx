import { useEffect, useState } from 'react'
import Card from '@/shared/ui/Card.jsx'
import { formatEGP } from '@/shared/lib/money.js'
import { useCart } from '@/features/cart/CartProvider.jsx'
import ProductArt from './ProductArt.jsx'

const BADGE_AR = { popular: 'الأكثر طلباً', new: 'جديد' }

export default function ProductCard({ product, onOpen }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [err, setErr] = useState(null)
  const {
    name,
    description,
    basePrice,
    isAvailable,
    variants,
    addOns,
    imageUrl,
    badge,
  } = product
  const needsChoice = variants.length > 0 || addOns.length > 0

  useEffect(() => {
    if (!added) return undefined
    const t = setTimeout(() => setAdded(false), 1600)
    return () => clearTimeout(t)
  }, [added])

  const act = () => {
    if (needsChoice) return onOpen(product)
    const e = addItem({ productId: product.id, variantId: null, addOnIds: [], qty: 1 })
    setErr(e)
    setAdded(!e)
  }

  return (
    <Card
      as="article"
      interactive={isAvailable}
      className={`flex flex-col ${isAvailable ? '' : 'opacity-60'}`}
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
        disabled={!isAvailable}
        className="block flex-1 text-start disabled:cursor-not-allowed"
        aria-label={`تفاصيل ${name}`}
      >
        <div className="relative">
          <ProductArt name={name} src={imageUrl} />
          {badge && isAvailable && (
            <span className="absolute start-3 top-3 rounded bg-blood-bright px-2.5 py-1 text-xs font-bold">
              {BADGE_AR[badge]}
            </span>
          )}
          {!isAvailable && (
            <span className="absolute inset-0 grid place-items-center bg-black/60 text-lg font-bold">
              غير متاح حالياً
            </span>
          )}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="line-clamp-2 min-h-[3rem] text-paper/70">{description}</p>
          <p className="font-bold text-blood-bright">
            {variants.length ? 'من ' : ''}
            {formatEGP(basePrice)}
          </p>
        </div>
      </button>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={act}
          disabled={!isAvailable}
          className="min-h-[48px] w-full rounded-md bg-blood font-bold transition-colors hover:bg-blood-bright disabled:pointer-events-none disabled:bg-coal-soft disabled:text-paper/50"
        >
          {!isAvailable ? 'غير متاح' : added ? 'تمت الإضافة ✓' : needsChoice ? 'اختار وأضف للسلة' : 'أضف للسلة'}
        </button>
        <p role="status" className="min-h-[1.25rem] pt-1 text-sm text-blood-bright">
          {err === 'cart-full'
            ? 'السلة وصلت للحد الأقصى.'
            : err === 'max-qty'
            ? 'وصلت للحد الأقصى للكمية.'
            : ''}
        </p>
      </div>
    </Card>
  )
}