import { addLine, removeLine, setLineQty, sanitizeItems } from './domain/cartMath.js'

export const initialCart = { items: [] }

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': return { items: addLine(state.items, action.item).items }
    case 'setQty': return { items: setLineQty(state.items, action.index, action.qty) }
    case 'remove': return { items: removeLine(state.items, action.index) }
    case 'removeInvalid': return { items: state.items.filter((_, i) => !action.invalidIndexes.includes(i)) }
    case 'clear': return initialCart
    default: return state
  }
}
export const loadCart = (raw) => ({ items: sanitizeItems(raw?.items) })
