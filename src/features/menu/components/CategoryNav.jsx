import { useEffect, useRef, useState } from 'react'

/** Sticky chips + scroll-spy. Sections must have id = category id. Active chip scrolls into view on mobile. */
export default function CategoryNav({ categories }) {
  const [active, setActive] = useState(categories[0]?.id)
  const chips = useRef({})

  useEffect(() => { setActive((a) => (categories.some((c) => c.id === a) ? a : categories[0]?.id)) }, [categories])

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const hit = entries.find((e) => e.isIntersecting)
      if (hit) setActive(hit.target.id)
    }, { rootMargin: '-35% 0px -55% 0px' })
    categories.forEach((c) => { const el = document.getElementById(c.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [categories])

  useEffect(() => { chips.current[active]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }) }, [active])

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <nav aria-label="أقسام المنيو" className="sticky top-16 z-30 border-b border-coal-line bg-black/90 backdrop-blur">
      <ul className="container-page no-scrollbar flex gap-2 overflow-x-auto py-3">
        {categories.map((c) => (
          <li key={c.id} className="shrink-0">
            <button type="button" ref={(el) => { chips.current[c.id] = el }} onClick={() => go(c.id)}
              aria-current={active === c.id ? 'true' : undefined}
              className={`min-h-[44px] rounded-full px-5 font-bold transition-colors ${active === c.id ? 'bg-blood text-white' : 'border border-coal-line text-paper/80 hover:border-blood-bright'}`}>
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}