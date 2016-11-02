/**
 * Data mask pattern reference
 * @type {Object}
 */
var patterns = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
}

/**
 * Returns an object containing mask pattern references
 *
 * @return {Object} Mask pattern references
 */
exports.getPatterns = function getPatterns () {
  return patterns
}

/**
 * Return mask value at given position
 *
 * @param  {Number} maskPattern Pattern reference value
 * @param  {Number} i           Row
 * @param  {Number} j           Column
 * @return {Boolean}            Mask value
 */
exports.getMaskAt = function getMaskAt (maskPattern, i, j) {
  switch (maskPattern) {
    case patterns.PATTERN000: return (i + j) % 2 === 0
    case patterns.PATTERN001: return i % 2 === 0
    case patterns.PATTERN010: return j % 3 === 0
    case patterns.PATTERN011: return (i + j) % 3 === 0
    case patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
    case patterns.PATTERN101: return (i * j) % 2 + (i * j) % 3 === 0
    case patterns.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 === 0
    case patterns.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 === 0

    default: throw new Error('bad maskPattern:' + maskPattern)
  }
}
