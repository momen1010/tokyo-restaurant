// Real photo (Firebase Storage URL) when present; otherwise an original generated poster tile.
import { useState } from 'react'

export default function ProductArt({ name, src, className = '' }) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  if (showImage) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`aspect-[4/3] w-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`relative grid aspect-[4/3] place-items-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#7A0013,#000_75%)] ${className}`}
      aria-hidden
    >
      <span className="absolute -start-6 top-0 h-full w-10 -skew-x-[18deg] bg-blood-bright/80" />
      <span className="absolute start-10 top-0 h-full w-1 -skew-x-[18deg] bg-white/20" />
      <span className="font-display text-7xl font-bold text-white/90">
        {name.trim().charAt(0)}
      </span>
    </div>
  )
}