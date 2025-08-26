function fromString (string) {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string')
  }
  const lcStr = string.toLowerCase()
  switch (lcStr) {
    case 'l':
    case 'low':
      return L
    case 'm':
    case 'medium':
      return M
    case 'q':
    case 'quartile':
      return Q
    case 'h':
    case 'high':
      return H
    default:
      throw new Error('Unknown EC Level: ' + string)
  }
}
export const L = { bit: 1 }
export const M = { bit: 0 }
export const Q = { bit: 3 }
export const H = { bit: 2 }
export function isValid (level) {
  return level && typeof level.bit !== 'undefined' &&
        level.bit >= 0 && level.bit < 4
}
export function from (value, defaultValue) {
  if (isValid(value)) {
    return value
  }
  try {
    return fromString(value)
  } catch (e) {
    return defaultValue
  }
}
