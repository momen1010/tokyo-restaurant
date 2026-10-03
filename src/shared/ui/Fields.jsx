import { useId } from 'react'

const input = 'w-full min-h-[48px] rounded-md border bg-black px-4 text-paper placeholder:text-paper/40 transition-colors focus:border-blood-bright focus:outline-none'

function Field({ label, hint, error, children, id }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      {children}
      {error ? <p role="alert" className="text-sm text-blood-bright">{error}</p>
             : hint ? <p className="text-sm text-paper/60">{hint}</p> : null}
    </div>
  )
}
const border = (error) => (error ? 'border-blood-bright' : 'border-coal-line')

export function TextField({ label, hint, error, className = '', ...rest }) {
  const id = useId()
  return <Field {...{ label, hint, error, id }}>
    <input id={id} aria-invalid={!!error} className={`${input} ${border(error)} ${className}`} {...rest} />
  </Field>
}
export function TextArea({ label, hint, error, rows = 3, ...rest }) {
  const id = useId()
  return <Field {...{ label, hint, error, id }}>
    <textarea id={id} rows={rows} aria-invalid={!!error} className={`${input} ${border(error)} py-3`} {...rest} />
  </Field>
}
export function SelectField({ label, hint, error, children, ...rest }) {
  const id = useId()
  return <Field {...{ label, hint, error, id }}>
    <select id={id} aria-invalid={!!error} className={`${input} ${border(error)}`} {...rest}>{children}</select>
  </Field>
}
