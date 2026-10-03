import { Link } from 'react-router-dom'
import Wordmark from '../../../shared/ui/Wordmark.jsx'
import { useMenu } from '../../../features/menu/MenuProvider.jsx'

export default function Footer() {
  const { categories: cats } = useMenu()
  return (
    <footer id="contact" className="border-t border-coal-line bg-coal/40">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2">
        <div className="space-y-3">
          <Wordmark size="sm" />
          <p className="max-w-xs text-paper/60">أكل شارع بنكهة سينمائية.</p>
        </div>
        <nav aria-label="الأقسام">
          <ul className="grid grid-cols-2 gap-2">
            {cats.map((c) => (
              <li key={c.id}><Link className="text-paper/70 hover:text-white" to={`/menu#${c.id}`}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-coal-line py-4 text-center text-sm text-paper/50">© TOKYO طوكيو</p>
    </footer>
  )
}
