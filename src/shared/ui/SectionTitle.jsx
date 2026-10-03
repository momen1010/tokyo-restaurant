export default function SectionTitle({ title, subtitle, align = 'center', className = '' }) {
    const isCenter = align === 'center'
  
    return (
      <div className={`${isCenter ? 'text-center' : 'text-start'} ${className}`}>
        <div className={`flex items-center gap-3 ${isCenter ? 'justify-center' : 'justify-start'}`}>
          <span className="h-px w-8 bg-blood sm:w-12" aria-hidden />
          <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">{title}</h2>
          <span className="h-px w-8 bg-blood sm:w-12" aria-hidden />
        </div>
        {subtitle && (
          <p className="mt-3 text-sm text-paper/60 sm:text-base">{subtitle}</p>
        )}
      </div>
    )
  }