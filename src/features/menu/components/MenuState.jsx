import Button from '../../../shared/ui/Button.jsx'

const COPY = {
  error: { title: 'تعذر تحميل المنيو', text: 'اتأكد من الإنترنت وجرّب تاني.' },
  empty: { title: 'المنيو فاضي حالياً', text: 'لسه مفيش منتجات متاحة. ارجع بعد شوية.' },
  noResults: { title: 'مفيش نتائج', text: 'جرّب كلمة تانية أو امسح البحث.' },
}

export default function MenuState({ kind, detail, onRetry, onClear }) {
  const c = COPY[kind]
  return (
    <div className="container-page py-16 text-center" role={kind === 'error' ? 'alert' : 'status'}>
      <h2 className="text-2xl font-bold">{c.title}</h2>
      <p className="mt-2 text-paper/70">{c.text}</p>
      {detail && <p dir="ltr" className="mt-2 text-sm text-paper/40">{detail}</p>}
      <div className="mt-6 flex justify-center gap-3">
        {kind === 'error' && <Button onClick={onRetry}>إعادة المحاولة</Button>}
        {kind === 'noResults' && <Button variant="ghost" onClick={onClear}>مسح البحث</Button>}
      </div>
    </div>
  )
}