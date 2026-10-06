import { Link } from 'react-router-dom'
import Wordmark from '@/shared/ui/Wordmark.jsx'
import SocialLinks from '@/shared/ui/SocialIcons.jsx'
import NewsletterForm from './NewsletterForm.jsx'
import { useMenu } from '@/features/menu/MenuProvider.jsx'

const QUICK_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/menu', label: 'المنيو' },
  { to: '/#offers', label: 'العروض' },
  { to: '/#why', label: 'عن طوكيو' },
  { to: '/#contact', label: 'تواصل معنا' },
]

const CONTACT = {
  phone1: '01119346488',
  phone2: '0155 650 7666',
  email: 'hello@tokyo-eg.com',
  address: 'مغاغه، المنيا',
}

export default function Footer() {
  const { categories: cats } = useMenu()
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      role="contentinfo"
      className="relative border-t border-coal-line bg-black"
    >
      {/* Gradient top border */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-blood to-transparent" />

      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Brand column */}
        <div className="space-y-4">
          <Wordmark size="sm" />
          <p className="max-w-xs text-sm leading-relaxed text-paper/60">
            عيش اللحظة... بطعم مختلف. من الكريب للبيتزا، ومن الساندوتشات للمكرونات — كل وجبة عندنا تحكي قصة.
          </p>
          <SocialLinks />
        </div>

        {/* Quick links */}
        <nav aria-label="روابط سريعة">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">روابط سريعة</h3>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-paper/60 transition-colors hover:text-blood-bright"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Categories */}
        <nav aria-label="أقسامنا">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">أقسامنا</h3>
          <ul className="space-y-2 text-sm">
            {cats.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/menu#${c.id}`}
                  className="text-paper/60 transition-colors hover:text-blood-bright"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">تواصل معنا</h3>
          <ul className="space-y-3 text-sm text-paper/60">
            <li className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-blood-bright">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span dir="ltr">{CONTACT.phone1}</span>
            </li>
            <li className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-blood-bright">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span dir="ltr">{CONTACT.phone2}</span>
            </li>
            <li className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-blood-bright">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-blood-bright" dir="ltr">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-blood-bright">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{CONTACT.address}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-coal-line">
        <div className="container-page flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <NewsletterForm />
          <p className="text-sm text-paper/50 sm:max-w-xs sm:text-end">
            انضم لأكثر من <span className="font-bold text-white">1000</span> عميل بيوصلهم عروضنا أول بأول.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-coal-line">
        <div className="container-page flex flex-col gap-3 py-5 text-sm text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} TOKYO طوكيو — جميع الحقوق محفوظة</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy" className="hover:text-blood-bright">سياسة الخصوصية</Link>
            <span aria-hidden className="text-coal-line">·</span>
            <Link to="/terms" className="hover:text-blood-bright">شروط الاستخدام</Link>
            <span aria-hidden className="text-coal-line">·</span>
            <span>
              صُنع بـ <span className="text-blood-bright">❤</span> بواسطة{' '}
              <span className="font-bold text-white">مؤمن طارق</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}