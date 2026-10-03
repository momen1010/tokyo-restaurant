const sizes = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' }

function Star({ filled, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1z" />
    </svg>
  )
}

export default function Rating({ value = 5, size = 'md' }) {
  const rounded = Math.round(value)
  return (
    <div
      className="inline-flex items-center gap-0.5 text-blood-bright"
      role="img"
      aria-label={`${value} من 5 نجوم`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= rounded} className={sizes[size]} />
      ))}
    </div>
  )
}