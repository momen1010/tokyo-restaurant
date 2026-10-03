/** Surface. `interactive` adds the red edge-glow on hover/focus-within. */
export default function Card({ as: Tag = 'div', interactive = false, className = '', children, ...rest }) {
  const hover = interactive ? 'transition-shadow duration-200 hover:shadow-glow focus-within:shadow-glow' : ''
  return <Tag className={`overflow-hidden rounded-xl border border-coal-line bg-coal ${hover} ${className}`} {...rest}>{children}</Tag>
}
