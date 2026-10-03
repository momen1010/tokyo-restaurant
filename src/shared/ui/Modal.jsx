import { useEffect, useRef } from 'react'

/** Native <dialog>: built-in focus trap, Esc to close, inert background. */
export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog ref={ref} className="tokyo-modal" onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose() }} aria-label={title}>
      <div className="flex items-center justify-between border-b border-coal-line px-5 py-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button type="button" onClick={onClose} aria-label="إغلاق"
          className="grid h-10 w-10 place-items-center rounded-md hover:bg-coal-soft">✕</button>
      </div>
      <div className="p-5">{open ? children : null}</div>
    </dialog>
  )
}
