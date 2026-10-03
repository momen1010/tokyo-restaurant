import { Link } from 'react-router-dom'

const base =
  'relative inline-grid place-items-center rounded-md transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none'
const sizes = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-12 w-12',
}
const variants = {
  ghost: 'text-paper/90 hover:text-white hover:bg-coal-soft',
  solid: 'bg-blood text-white hover:bg-blood-bright',
  outline: 'border border-coal-line text-paper hover:border-blood-bright hover:text-white',
}

export default function IconButton({
  to,
  label,
  size = 'md',
  variant = 'ghost',
  className = '',
  children,
  ...rest
}) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  const ariaProps = { 'aria-label': label }

  return to ? (
    <Link to={to} className={cls} {...ariaProps} {...rest}>
      {children}
    </Link>
  ) : (
    <button type="button" className={cls} {...ariaProps} {...rest}>
      {children}
    </button>
  )
}