export function isValid (version) {
  return !isNaN(version) && version >= 1 && version <= 40
}
