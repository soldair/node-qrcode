var test = require('tap').test
var utils = require('core/utils')

/**
 * QR Code sizes. Each element refers to a version
 * @type {Array}
 */
var EXPECTED_SYMBOL_SIZES = [
  21, 25, 29, 33, 37, 41, 45,
  49, 53, 57, 61, 65, 69, 73,
  77, 81, 85, 89, 93, 97, 101,
  105, 109, 113, 117, 121, 125,
  129, 133, 137, 141, 145, 149,
  153, 157, 161, 165, 169, 173, 177]

test('Symbol size', function (t) {
  t.throws(function () { utils.getSymbolSize() }, 'Should throw if version is undefined')
  t.throws(function () { utils.getSymbolSize(0) }, 'Should throw if version is not in range')
  t.throws(function () { utils.getSymbolSize(41) }, 'Should throw if version is not in range')

  for (var i = 1; i <= 40; i++) {
    t.equal(utils.getSymbolSize(i), EXPECTED_SYMBOL_SIZES[i - 1], 'Should return correct symbol size')
  }

  t.end()
})

test('Symbol codewords', function (t) {
  for (var i = 1; i <= 40; i++) {
    t.ok(utils.getSymbolTotalCodewords(i), 'Should return positive number')
  }

  t.end()
})
