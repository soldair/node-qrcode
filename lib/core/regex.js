const Utils = require('./utils')

const TEST_NUMERIC = new RegExp('^[0-9]+$')
const TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$')

exports.testKanji = function testKanji (str) {
  if(!Utils.isKanjiModeEnabled()) {
    return false
  }
  let flag = true
  for(let char of str) {
    flag = flag && Utils.toSJIS(char)
  }
  return flag
}

exports.testNumeric = function testNumeric (str) {
  return TEST_NUMERIC.test(str)
}

exports.testAlphanumeric = function testAlphanumeric (str) {
  return TEST_ALPHANUMERIC.test(str)
}

/**
 * @param {string} charCollection char collection of this mode
 * @returns {function}
 */
function isModeFactory (charCollection) {
  let map = new Map()
  for (let i = 0; i < charCollection.length; ++i) {
    map.set(charCollection.codePointAt(i), i)
  }
  /**
   * Verify whether the character at a specified position in the string belongs to this set. 
   * @param {string} str
   * @param {number} pos
   * @returns {boolean}
   */
  return function (str, pos) {
    return map.has(str.codePointAt(pos))
  }
}

exports.isNumeric = isModeFactory('0123456789')

exports.isAlphanumeric = isModeFactory('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:')

exports.isKanji = function (str, pos) {
  let unicode = str.codePointAt(pos)
  return Utils.isKanjiModeEnabled() && !!Utils.toSJIS(String.fromCodePoint(unicode))
}
