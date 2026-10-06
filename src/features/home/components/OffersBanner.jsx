import { Link } from 'react-router-dom'
import Button from '@/shared/ui/Button.jsx'

export default function OffersBanner() {
  return (
    <section id="offers" className="container-page py-14 sm:py-20" aria-labelledby="offers-title">
      <div className="relative overflow-hidden rounded-card border border-blood/30 bg-gradient-to-l from-blood-deep via-blood to-blood-deep">
        {/* Grain overlay */}
        <div aria-hidden className="grain absolute inset-0 opacity-20" />

        {/* Radial glow */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.15),transparent_60%)]"
        />

        <div className="relative grid gap-6 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-14">
          {/* Text side */}
          <div className="text-white">
            <span className="mb-3 inline-block rounded-md bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blood-bright">
              عروض خاصة
            </span>
            <h2 id="offers-title" className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              خصومات ومفاجآت مستمرة
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
              تابعنا ولا تفوّت أي عرض حصري. وفّر حتى 30% على طلباتك المفضلة.
            </p>
            <div className="mt-6">
              <Button
                to="/menu"
                size="lg"
                className="!bg-white !text-blood hover:!bg-paper"
              >
                اكتشف العروض
              </Button>
            </div>
          </div>

          {/* Image side */}
          <div className="relative order-first lg:order-last">
            <div className="relative overflow-hidden rounded-card border border-white/20 shadow-2xl">
              <img
                src="/images/pizza.webp"
                alt="بيتزا طوكيو"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}