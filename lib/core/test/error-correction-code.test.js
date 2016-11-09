var test = require('tap').test
var Utils = require('../utils')
var Version = require('../version')
var ECLevel = require('../error-correction-level')
var ECCode = require('../error-correction-code')
var ByteData = require('../byte-data')

test('Error correction codewords', function (t) {
  var levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H]

  for (var v = 1; v <= 40; v++) {
    var totalCodewords = Utils.getSymbolTotalCodewords(v)
    var reservedByte = Math.ceil((ByteData.getCharCountIndicator(v) + 4) / 8)

    for (var l = 0; l < levels.length; l++) {
      var dataCodewords = Version.getCapacity(v, levels[l]) + reservedByte

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
