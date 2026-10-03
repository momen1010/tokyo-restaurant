import { useEffect, useState } from 'react'
import Button from '@/shared/ui/Button.jsx'
import Wordmark from '@/shared/ui/Wordmark.jsx'

const SLIDES = [
  {
    id: 's1',
    badge: 'Good Food Bigger Dreams',
    title: 'طعم خارج عن المألوف',
    subtitle:
      'من الكريب اللذيذ إلى البيتزا المصرية، ومن الساندويتشات الشهية إلى المكرونات الغنية... كل وجبة تحكي قصة مختلفة.',
    image: '/images/foter.webp',
    to: '/menu',
    alt: '/menu',
  },
  {
    id: 's2',
    title: 'كريب على مزاجك',
    subtitle: 'حلو أو مالح، بحشوات تختارها بنفسك.',
    image: '/images/crype.png',
    to: '/menu#crepe',
    alt: '/menu',
  },
  {
    id: 's3',
    title: 'فطائر وبيتزا',
    subtitle: 'عجينة مقرمشة وجبنة سايحة من القسم اللي بتحبه.',
    image: '/images/pizza.webp',
    to: '/menu#pies-pizza',
    alt: '/menu',
  },
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
    <section
      aria-roledescription="carousel"
      aria-label="عروض الرئيسية"
      className="grain relative isolate min-h-[500px] overflow-hidden border-b border-coal-line sm:min-h-[560px] lg:min-h-[620px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="absolute inset-y-0 end-0 -z-10 w-full opacity-70 sm:w-[65%] sm:opacity-100">
        <img
          key={s.id}
          src={s.image}
          alt=""
          loading="eager"
          className="h-full w-full animate-fade object-cover"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-l from-black via-black/75 to-black/30"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_50%,rgba(225,29,46,0.18),transparent_60%)]"
      />

      <div className="container-page flex min-h-[500px] flex-col justify-center py-16 sm:min-h-[560px] sm:py-20 lg:min-h-[620px]">
        <div key={s.id} className="max-w-xl animate-rise">
          {s.badge && (
            <span className="mb-5 inline-block rounded-md border border-blood/40 bg-blood/10 px-3 py-1 text-xs font-bold italic text-blood-bright sm:text-sm">
              {s.badge}
            </span>
          )}

          <Wordmark size="sm" />

          <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {s.title}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-paper/75 sm:text-lg">
            {s.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button to={s.to} size="lg">اطلب الآن</Button>
            <Button to={s.alt} variant="ghost" size="lg">شوف المنيو</Button>
          </div>
        </div>

        <div className="mt-10 flex justify-center sm:mt-12" role="group" aria-label="اختيار الشريحة">
          {SLIDES.map((x, n) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setI(n)}
              aria-label={`الشريحة ${n + 1}`}
              aria-current={n === i ? 'true' : undefined}
              className="grid h-11 w-8 place-items-center"
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 ${
                  n === i ? 'w-6 bg-blood-bright' : 'w-2 bg-paper/40 hover:bg-paper/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}