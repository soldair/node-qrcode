var test = require('tap').test
var Utils = require('core/utils')
var Version = require('core/version')
var ECLevel = require('core/error-correction-level')
var ECCode = require('core/error-correction-code')
var Mode = require('core/mode')

test('Error correction codewords', function (t) {
  var levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H]

  for (var v = 1; v <= 40; v++) {
    var totalCodewords = Utils.getSymbolTotalCodewords(v)
    var reservedByte = Math.ceil((Mode.getCharCountIndicator(Mode.BYTE, v) + 4) / 8)

    for (var l = 0; l < levels.length; l++) {
      var dataCodewords = Version.getCapacity(v, levels[l], Mode.BYTE) + reservedByte

      var expectedCodewords = totalCodewords - dataCodewords

      t.equal(ECCode.getTotalCodewordsCount(v, levels[l]), expectedCodewords,
        'Should return correct codewords number')
    }
  }

  t.equal(ECCode.getTotalCodewordsCount(1), undefined,
    'Should return undefined if EC level is not specified')

  t.end()
})

test('Error correction blocks', function (t) {
  var levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H]

  for (var v = 1; v <= 40; v++) {
    for (var l = 0; l < levels.length; l++) {
      t.ok(ECCode.getBlocksCount(v, levels[l]), 'Should return a positive number')
    }
  }

  t.equal(ECCode.getBlocksCount(1), undefined,
    'Should return undefined if EC level is not specified')

  t.end()
})
