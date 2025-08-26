import tap from 'tap'
import * as Utils from '../../../lib/core/utils.js'
import * as Version from '../../../lib/core/version.js'
import * as ECLevel from '../../../lib/core/error-correction-level.js'
import * as ECCode from '../../../lib/core/error-correction-code.js'
import * as Mode from '../../../lib/core/mode.js'
const test = tap.test
test('Error correction codewords', function (t) {
  const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H]
  for (let v = 1; v <= 40; v++) {
    const totalCodewords = Utils.getSymbolTotalCodewords(v)
    const reservedByte = Math.ceil((Mode.getCharCountIndicator(Mode.BYTE, v) + 4) / 8)
    for (let l = 0; l < levels.length; l++) {
      const dataCodewords = Version.getCapacity(v, levels[l], Mode.BYTE) + reservedByte
      const expectedCodewords = totalCodewords - dataCodewords
      t.equal(ECCode.getTotalCodewordsCount(v, levels[l]), expectedCodewords, 'Should return correct codewords number')
    }
  }
  t.equal(ECCode.getTotalCodewordsCount(1), undefined, 'Should return undefined if EC level is not specified')
  t.end()
})
test('Error correction blocks', function (t) {
  const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H]
  for (let v = 1; v <= 40; v++) {
    for (let l = 0; l < levels.length; l++) {
      t.ok(ECCode.getBlocksCount(v, levels[l]), 'Should return a positive number')
    }
  }
  t.equal(ECCode.getBlocksCount(1), undefined, 'Should return undefined if EC level is not specified')
  t.end()
})
