import { Link } from 'react-router-dom'

const base = 'inline-flex items-center justify-center gap-2 rounded-md font-bold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none select-none'
const variants = {
  primary: 'bg-blood text-white hover:bg-blood-bright active:bg-blood-deep',
  ghost: 'border border-coal-line text-paper hover:border-blood-bright hover:text-white',
  dark: 'bg-coal-soft text-paper hover:bg-coal-line',
}
const sizes = { sm: 'min-h-[40px] px-4 text-sm', md: 'min-h-[48px] px-6', lg: 'min-h-[56px] px-8 text-lg' }

/** Renders a router Link when `to` is given, otherwise a <button>. */
export default function Button({ to, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  return to ? <Link to={to} className={cls} {...rest}>{children}</Link>
            : <button type="button" className={cls} {...rest}>{children}</button>
}
