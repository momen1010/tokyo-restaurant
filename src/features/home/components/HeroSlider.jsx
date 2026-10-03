import { useEffect, useState } from 'react'
import Button from '../../../shared/ui/Button.jsx'
import Wordmark from '../../../shared/ui/Wordmark.jsx'
import HeroArt from './HeroArt.jsx'

const SLIDES = [
  { id: 's1', title: 'طعم خارج عن المألوف', to: '/menu', alt: '/menu',
    text: 'من الكريب اللذيذ إلى البيتزا المميزة، ومن الساندوتشات الشهية إلى المكرونات الغنية... كل وجبة تحكي قصة مختلفة.' },
  { id: 's2', title: 'كريب على مزاجك', to: '/menu#crepe', alt: '/menu',
    text: 'حلو أو مالح، بحشوات تختارها بنفسك.' },
  { id: 's3', title: 'فطائر وبيتزا', to: '/menu#pies-pizza', alt: '/menu',
    text: 'عجينة مقرمشة وجبنة سايحة من القسم اللي بتحبه.' },
]
const INTERVAL = 6000

export default function HeroSlider() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const s = SLIDES[i]

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce) return undefined
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), INTERVAL)
    return () => clearInterval(t)
  }, [paused])

  return (
    <section aria-roledescription="carousel" aria-label="عروض الرئيسية"
      className="grain relative isolate min-h-[440px] overflow-hidden border-b border-coal-line sm:min-h-[520px]"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      {/* art on the end (left) side; fades into black under the text */}
      <div className="absolute inset-y-0 end-0 -z-10 w-full opacity-60 sm:w-[60%] sm:opacity-100"><HeroArt variant={i} /></div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-l from-black via-black/70 to-transparent sm:via-black/40" />

      <div className="container-page flex min-h-[440px] flex-col justify-center py-14 sm:min-h-[520px]">
        <div key={s.id} className="max-w-xl animate-rise">
          <Wordmark />
          <h1 className="mt-6 text-4xl font-bold sm:text-5xl">{s.title}</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-paper/80">{s.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to={s.to} size="lg">اطلب الآن</Button>
            <Button to={s.alt} variant="ghost" size="lg">شوف المنيو</Button>
          </div>
        </div>
        <div className="mt-8 flex" role="group" aria-label="اختيار الشريحة">
          {SLIDES.map((x, n) => (
            <button key={x.id} type="button" onClick={() => setI(n)} aria-label={`الشريحة ${n + 1}`} aria-current={n === i ? 'true' : undefined}
              className="grid h-11 w-8 place-items-center">
              <span className={`h-2 rounded-full transition-all ${n === i ? 'w-6 bg-blood-bright' : 'w-2 bg-paper/40'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}