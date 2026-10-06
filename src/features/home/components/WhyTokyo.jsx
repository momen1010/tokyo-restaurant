import SectionTitle from '@/shared/ui/SectionTitle.jsx'

const FEATURES = [
  {
    id: 'fresh',
    title: 'مكونات طازجة',
    text: 'خضروات ولحوم وجبنة بتوصلنا يوميًا من موردين موثوقين.',
    icon: (
      <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    ),
  },
  {
    id: 'speed',
    title: 'سرعة في التجهيز',
    text: 'طلبك بيوصل باب البيت في أقل من 45 دقيقة داخل القاهرة.',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
  {
    id: 'variety',
    title: 'خيارات متنوعة',
    text: 'أكتر من 40 طبق: كريب، بيتزا، ساندوتشات، ومكرونات.',
    icon: (
      <>
        <path d="M4 3h16v4H4zM4 11h16v4H4zM4 19h16v2H4z" />
      </>
    ),
  },
  {
    id: 'support',
    title: 'دعم فني',
    text: 'فريق خدمة العملاء متاح 24/7 لأي استفسار أو مشكلة.',
    icon: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
  },
]

export default function WhyTokyo() {
  return (
    <section
      id="why"
      className="relative border-y border-coal-line bg-coal/30 py-16 sm:py-20"
      aria-labelledby="why-title"
    >
      <div className="container-page">
        <SectionTitle
          title="لماذا طوكيو؟"
          subtitle="لأنك تستحق الأفضل"
          align="start"
          className="mb-10"
        />

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-card border border-coal-line">
              <img
                src="/images/burger2.webp"
                alt="برغر طوكيو مع البطاطس"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
              {/* Red overlay */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
              />
              {/* Brush text overlay */}
              <div className="absolute bottom-6 end-6 text-end">
                <span className="block font-display text-3xl font-bold italic text-blood-bright drop-shadow-lg sm:text-4xl">
                  More
                </span>
                <span className="block font-display text-3xl font-bold italic text-blood-bright drop-shadow-lg sm:text-4xl">
                  Than
                </span>
                <span className="block font-display text-3xl font-bold italic text-white drop-shadow-lg sm:text-4xl">
                  Food
                </span>
              </div>
            </div>
          </div>

          {/* Features side */}
          <ul className="order-1 grid gap-6 sm:grid-cols-2 lg:order-2 lg:grid-cols-1">
            {FEATURES.map((f) => (
              <li key={f.id} className="flex items-start gap-4">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-blood/40 bg-blood/10 text-blood-bright"
                  aria-hidden
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.icon}
                  </svg>
                </span>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-paper/60">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}