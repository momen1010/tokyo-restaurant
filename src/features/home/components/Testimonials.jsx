import { motion } from 'framer-motion'
import SectionTitle from '@/shared/ui/SectionTitle.jsx'
import Rating from '@/shared/ui/Rating.jsx'

const TESTIMONIALS = [
  {
    id: 't1',
    name: 'أحمد محمد',
    role: 'عميل دائم',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: 'أحسن كريب في مغاغه بجد. الخدمة سريعة والأكل طازة دايمًا. بقيت أطلب منهم كل أسبوع.',
  },
  {
    id: 't2',
    name: 'سارة علي',
    role: 'عميلة جديدة',
    avatar: 'https://i.pravatar.cc/150?img=45',
    rating: 5,
    text: 'طلبت بيتزا مارجريتا وكانت رهيبة! العجينة مقرمشة والجبنة سايحة. التوصيل كان أسرع من المتوقع.',
  },
  {
    id: 't3',
    name: 'محمد خالد',
    role: 'عميل وفي',
    avatar: 'https://i.pravatar.cc/150?img=33',
    rating: 5,
    text: 'جربت كل حاجة في المنيو، ومفيش حاجة وحشة. الأسعار معقولة والجودة عالية. بجد مش هتلاقي أحسن من كده.',
  },
]

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-y border-coal-line bg-coal/30 py-16 sm:py-20"
      aria-labelledby="testimonials-title"
    >
      <div className="container-page">
        <SectionTitle
          title="ماذا يقول عملاؤنا"
          subtitle="آراء حقيقية من عملائنا"
          className="mb-10"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-card border border-coal-line bg-black/40 p-5 sm:p-6"
            >
              {/* Header */}
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="h-14 w-14 rounded-full border-2 border-blood/30 object-cover"
                />
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-xs text-paper/50">{t.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-3">
                <Rating value={t.rating} size="sm" />
              </div>

              {/* Text */}
              <p className="text-sm leading-relaxed text-paper/80">
                "{t.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}