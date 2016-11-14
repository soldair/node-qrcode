/**
 * Data mask pattern reference
 * @type {Object}
 */
exports.Patterns = {
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
 * Weighted penalty scores for the undesirable features
 * @type {Object}
 */
var PenalityScores = {
  N1: 3,
  N2: 3,
  N3: 40,
  N4: 10
}

/**
 * Find adjacent modules in row/column with the same color
 * and assign a penality value.
 *
 * Points: N1 + i
 * i is the amount by which the number of adjacent modules of the same color exceeds 5
 */
function getPenalityN1 (data) {
  var size = data.size
  var points = 0

  for (var row = 0; row < size; row++) {
    for (var col = 0; col < size; col++) {
      // number of consecutive modules with same color
      var sameCount = 0
      var dark = data.get(row, col)

      for (var r = -1; r <= 1; r++) {
        if (row + r < 0 || size <= row + r) continue

        for (var c = -1; c <= 1; c++) {
          if (col + c < 0 || size <= col + c) continue
          if (r === 0 && c === 0) continue
          if (dark === data.get(row + r, col + c)) sameCount++
        }
      }

      if (sameCount > 5) {
        points += PenalityScores.N1 + sameCount - 5
      }
    }
  }

  return points
}

/**
 * Find 2x2 blocks with the same color and assign a penality value
 *
 * Points: N2 * (m - 1) * (n - 1)
 */
function getPenalityN2 (data) {
  var size = data.size
  var points = 0

  for (var row = 0; row < size - 1; row++) {
    for (var col = 0; col < size - 1; col++) {
      var count = 0
      if (data.get(row, col)) count++
      if (data.get(row + 1, col)) count++
      if (data.get(row, col + 1)) count++
      if (data.get(row + 1, col + 1)) count++
      if (count === 0 || count === 4) points += PenalityScores.N2
    }
  }

  return points
}

/**
 * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
 * preceded or followed by light area 4 modules wide
 *
 * Points: N3 * number of pattern found
 */
function getPenalityN3 (data) {
  var size = data.size
  var points = 0
  var row, col

  for (row = 0; row < size; row++) {
    for (col = 0; col < size - 6; col++) {
      if (data.get(row, col) &&
         !data.get(row, col + 1) &&
          data.get(row, col + 2) &&
          data.get(row, col + 3) &&
          data.get(row, col + 4) &&
         !data.get(row, col + 5) &&
          data.get(row, col + 6)) {
        points += PenalityScores.N3
      }
    }
  }

  for (col = 0; col < size; col++) {
    for (row = 0; row < size - 6; row++) {
      if (data.get(row, col) &&
         !data.get(row + 1, col) &&
          data.get(row + 2, col) &&
          data.get(row + 3, col) &&
          data.get(row + 4, col) &&
         !data.get(row + 5, col) &&
          data.get(row + 6, col)) {
        points += PenalityScores.N3
      }
    }
  }

  return points
}

/**
 * Calculate proportion of dark modules in entire symbol
 *
 * Points: N4 * k
 *
 * k is the rating of the deviation of the proportion of dark modules
 * in the symbol from 50% in steps of 5%
 */
function getPenalityN4 (data) {
  var darkCount = 0
  var size = data.size

  for (var col = 0; col < size; col++) {
    for (var row = 0; row < size; row++) {
      if (data.get(row, col)) darkCount++
    }
  }

  var ratio = Math.abs(100 * darkCount / size / size - 50) / 5
  return ratio * PenalityScores.N4
}

/**
 * Return mask value at given position
 *
 * @param  {Number} maskPattern Pattern reference value
 * @param  {Number} i           Row
 * @param  {Number} j           Column
 * @return {Boolean}            Mask value
 */
function getMaskAt (maskPattern, i, j) {
  switch (maskPattern) {
    case exports.Patterns.PATTERN000: return (i + j) % 2 === 0
    case exports.Patterns.PATTERN001: return i % 2 === 0
    case exports.Patterns.PATTERN010: return j % 3 === 0
    case exports.Patterns.PATTERN011: return (i + j) % 3 === 0
    case exports.Patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
    case exports.Patterns.PATTERN101: return (i * j) % 2 + (i * j) % 3 === 0
    case exports.Patterns.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 === 0
    case exports.Patterns.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 === 0

    default: throw new Error('bad maskPattern:' + maskPattern)
  }
}

/**
 * Apply a mask pattern to a BitMatrix
 *
 * @param  {Number}    pattern Pattern reference number
 * @param  {BitMatrix} data    BitMatrix data
 */
exports.applyMask = function applyMask (pattern, data) {
  var size = data.size

  for (var col = 0; col < size; col++) {
    for (var row = 0; row < size; row++) {
      if (data.isReserved(row, col)) continue
      data.xor(row, col, getMaskAt(pattern, row, col))
    }
  }
}

/**
 * Returns the best mask pattern for data
 *
 * @param  {BitMatrix} data
 * @return {Number} Mask pattern reference number
 */
exports.getBestMask = function getBestMask (data) {
  var numPatterns = Object.keys(exports.Patterns).length
  var bestPattern = 0
  var lowerPenality = Infinity

  for (var p = 0; p < numPatterns; p++) {
    exports.applyMask(p, data)

    // Calculate penality
    var penality =
      getPenalityN1(data) +
      getPenalityN2(data) +
      getPenalityN3(data) +
      getPenalityN4(data)

    // Undo previously applied mask
    exports.applyMask(p, data)

    if (penality < lowerPenality) {
      lowerPenality = penality
      bestPattern = p
    }
  }

  return bestPattern
}
