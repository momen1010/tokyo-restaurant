import { useEffect, useRef } from 'react'

/** Side sheet on the native <dialog>: focus trap, Esc, inert background. Slides in from the end edge. */
export default function Drawer({ open, onClose, title, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog ref={ref} className="tokyo-drawer" onClose={onClose} aria-label={title}
      onClick={(e) => { if (e.target === ref.current) onClose() }}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-coal-line px-5 py-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="grid h-10 w-10 place-items-center rounded-md hover:bg-coal-soft">✕</button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
