// Original wordmark: italic Latin TOKYO with a red brush underline + Arabic name. No third-party assets.
export default function Wordmark({ size = 'md' }) {
  const big = size !== 'sm'
  return (
    <span className="inline-flex items-center gap-3" dir="ltr">
      <span className="relative inline-block">
        <span className={`inline-block -skew-x-6 font-body font-bold italic leading-none tracking-tight ${big ? 'text-6xl sm:text-7xl' : 'text-3xl'}`}>TOKYO</span>
        <svg aria-hidden viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute -bottom-1 start-0 h-2 w-full">
          <path d="M2 9 C40 2, 90 12, 198 4" stroke="#E10A2B" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      </span>
      <span lang="ar" dir="rtl" className={`font-display font-bold leading-none ${big ? 'text-5xl sm:text-6xl' : 'text-2xl'}`}>طوكيو</span>
    </span>
  )
}