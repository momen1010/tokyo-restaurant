import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-4xl">الصفحة غير موجودة</h1>
      <Link to="/" className="btn-primary mt-8">الرجوع للرئيسية</Link>
    </div>
  )
}
