import { getSymbolSize as getSymbolSize$0 } from './utils.js'
/**
 * Alignment pattern are fixed reference pattern in defined positions
 * in a matrix symbology, which enables the decode software to re-synchronise
 * the coordinate mapping of the image modules in the event of moderate amounts
 * of distortion of the image.
 *
 * Alignment patterns are present only in QR Code symbols of version 2 or larger
 * and their number depends on the symbol version.
 */
const getSymbolSize = { getSymbolSize: getSymbolSize$0 }.getSymbolSize
export function getRowColCoords (version) {
  if (version === 1) { return [] }
  const posCount = Math.floor(version / 7) + 2
  const size = getSymbolSize(version)
  const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2
  const positions = [size - 7] // Last coord is always (size - 7)
  for (let i = 1; i < posCount - 1; i++) {
    positions[i] = positions[i - 1] - intervals
  }
  positions.push(6) // First coord is always 6
  return positions.reverse()
}
export function getPositions (version) {
  const coords = []
  const pos = getRowColCoords(version)
  const posLength = pos.length
  for (let i = 0; i < posLength; i++) {
    for (let j = 0; j < posLength; j++) {
      // Skip if position is occupied by finder patterns
      if ((i === 0 && j === 0) || // top-left
                (i === 0 && j === posLength - 1) || // bottom-left
                (i === posLength - 1 && j === 0)) { // top-right
        continue
      }
      coords.push([pos[i], pos[j]])
    }
  }
  return coords
}
