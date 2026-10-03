// All money is stored as integer piasters (قرش). Display only converts at the edge.
export const toEGP = (piasters) => piasters / 100
export const formatEGP = (piasters) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 2 }).format(toEGP(piasters))
