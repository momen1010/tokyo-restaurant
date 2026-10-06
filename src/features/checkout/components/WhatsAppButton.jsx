/**
 * WhatsAppButton — opens wa.me with a pre-filled message.
 *
 * Props:
 *   - message: string (required) — the text to send.
 *   - phone: string (required) — international format, no + or spaces (e.g. "201556507666").
 *   - label: string — button text.
 */
export default function WhatsAppButton({
    message,
    phone,
    label = 'ابعت الطلب على واتساب',
  }) {
    if (!message || !phone) return null
  
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-md bg-emerald-500 px-6 font-bold text-white shadow-lg transition-all hover:bg-emerald-400 hover:shadow-emerald-500/40 sm:w-auto"
      >
        {/* WhatsApp glyph */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.94 7.94 0 0 0 3.84.98h.01a7.94 7.94 0 0 0 5.55-13.56zM12.05 18.5h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 1 1 5.6 3.09zm3.62-4.94c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.51.65-.63.78-.11.13-.23.15-.43.05a5.4 5.4 0 0 1-2.7-2.36c-.2-.35.2-.33.58-1.1.06-.13.03-.24-.02-.34-.05-.1-.44-1.07-.6-1.46-.16-.38-.32-.33-.44-.34-.11 0-.24-.01-.37-.01a.72.72 0 0 0-.52.24c-.18.2-.68.67-.68 1.63 0 .96.7 1.88.79 2.01.1.13 1.37 2.1 3.33 2.94.47.2.83.32 1.11.41.47.15.9.13 1.23.08.37-.06 1.17-.48 1.34-.94.17-.46.17-.86.12-.94-.05-.08-.18-.13-.38-.23z" />
        </svg>
        {label}
      </a>
    )
  }