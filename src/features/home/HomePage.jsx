import { Link } from 'react-router-dom'
import Button from '@/shared/ui/Button.jsx'
import Card from '@/shared/ui/Card.jsx'
import { formatEGP } from '@/shared/lib/money.js'
import { useMenu } from '@/features/menu/MenuProvider.jsx'
import ProductArt from '@/features/menu/components/ProductArt.jsx'
import HeroSlider from './components/HeroSlider.jsx'

export default function HomePage() {
  const { categories, featured, loading } = useMenu()

  return (
    <>
      <HeroSlider />

      {loading ? (
        <p className="container-page py-14 text-paper/60">جاري تحميل المنيو...</p>
      ) : (
        <>
          <section className="container-page py-14" aria-labelledby="cats">
            <h2 id="cats" className="mb-6 text-3xl font-bold">الأقسام</h2>
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/menu#${c.id}`} className="block">
                    <Card interactive>
                      <ProductArt name={c.name} src={c.imageUrl} />
                      <div className="p-4">
                        <h3 className="text-lg font-bold">{c.name}</h3>
                        <p className="text-sm text-paper/60">{c.tagline}</p>
                      </div>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="container-page pb-16" aria-labelledby="feat">
            <div className="mb-6 flex items-center justify-between">
              <h2 id="feat" className="text-3xl font-bold">ابدأ من هنا</h2>
              <Button to="/menu" variant="ghost" size="sm">كل المنيو</Button>
            </div>
            <ul className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5">
              {featured.map((p) => (
                <li key={p.id} className="w-64 shrink-0 snap-start">
                  <Link to={`/menu#${p.categoryId}`}>
                    <Card interactive>
                      <ProductArt name={p.name} src={p.imageUrl} />
                      <div className="p-4">
                        <h3 className="font-bold">{p.name}</h3>
                        <p className="text-blood-bright">{formatEGP(p.basePrice)}</p>
                      </div>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  )
}