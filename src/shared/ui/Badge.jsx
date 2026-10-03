const variants = {
    hot: 'bg-blood text-white animate-pulse-red',
    new: 'bg-blood-bright text-white',
    neutral: 'bg-coal-soft text-paper border border-coal-line',
  }
  
  export default function Badge({ variant = 'hot', children, className = '' }) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold leading-none shadow-sm ${variants[variant]} ${className}`}
      >
        {children}
      </span>
    )
  }