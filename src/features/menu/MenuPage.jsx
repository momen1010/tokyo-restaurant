import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMenu } from './MenuProvider.jsx'
import { filterSections } from './domain/search.js'
import CategoryNav from './components/CategoryNav.jsx'
import ProductCard from './components/ProductCard.jsx'
import ProductModal from './components/ProductModal.jsx'
import MenuSkeleton from './components/MenuSkeleton.jsx'
import MenuState from './components/MenuState.jsx'

export default function MenuPage() {
  const { sections, loading, error, reload, source } = useMenu()
  const [term, setTerm] = useState('')
  const [selected, setSelected] = useState(null)
  const { hash } = useLocation()
  const shown = useMemo(() => filterSections(sections, term), [sections, term])

  useEffect(() => { // deep link from home/footer: /menu#pasta (after data has rendered)
    if (!loading && hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [hash, loading])

  return (
    <>
      <div className="container-page space-y-4 pt-10 pb-6">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">المنيو</h1>
          <p className="mt-2 text-paper/70">اختار قسمك واطلب اللي على مزاجك.</p>
        </div>
        <div className="relative max-w-md">
          <input type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="ابحث في المنيو..."
            aria-label="ابحث في المنيو" className="min-h-[48px] w-full rounded-md border border-coal-line bg-black px-4 pe-11 text-paper placeholder:text-paper/40 focus:border-blood-bright focus:outline-none" />
          {term && <button type="button" aria-label="مسح البحث" onClick={() => setTerm('')} className="absolute end-1 top-1 grid h-10 w-10 place-items-center rounded-md hover:bg-coal-soft">✕</button>}
        </div>
        {import.meta.env.DEV && source && <p dir="ltr" className="text-xs text-paper/40">dev: menu source = {source}</p>}
      </div>

      {loading && <MenuSkeleton />}
      {!loading && error && <MenuState kind="error" onRetry={reload} detail={import.meta.env.DEV ? error.code : null} />}
      {!loading && !error && sections.length === 0 && <MenuState kind="empty" />}
      {!loading && !error && sections.length > 0 && shown.length === 0 && <MenuState kind="noResults" onClear={() => setTerm('')} />}

      {!loading && !error && shown.length > 0 && (
        <>
          <CategoryNav categories={shown} />
          <div className="container-page space-y-14 py-10">
            {shown.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`h-${s.id}`} className="scroll-mt-40">
                <div className="mb-5 flex items-end gap-3 border-s-4 border-blood-bright ps-3">
                  <h2 id={`h-${s.id}`} className="text-3xl font-bold">{s.name}</h2>
                  {s.tagline && <span className="pb-1 text-paper/60">{s.tagline}</span>}
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {s.products.map((p) => <ProductCard key={p.id} product={p} onOpen={setSelected} />)}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  )
}