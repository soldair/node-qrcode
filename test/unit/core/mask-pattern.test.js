var test = require('tap').test
var BitMatrix = require('core/bit-matrix')
var MaskPattern = require('core/mask-pattern')

test('Mask pattern - Pattern references', function (t) {
  var patternsCount = Object.keys(MaskPattern.Patterns).length
  t.equals(patternsCount, 8, 'Should return 8 patterns')

  t.end()
})

var expectedPattern000 = [
  1, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 1
]

var expectedPattern001 = [
  1, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0
]

var expectedPattern010 = [
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0
]

var expectedPattern011 = [
  1, 0, 0, 1, 0, 0,
  0, 0, 1, 0, 0, 1,
  0, 1, 0, 0, 1, 0,
  1, 0, 0, 1, 0, 0,
  0, 0, 1, 0, 0, 1,
  0, 1, 0, 0, 1, 0
]

var expectedPattern100 = [
  1, 1, 1, 0, 0, 0,
  1, 1, 1, 0, 0, 0,
  0, 0, 0, 1, 1, 1,
  0, 0, 0, 1, 1, 1,
  1, 1, 1, 0, 0, 0,
  1, 1, 1, 0, 0, 0
]

var expectedPattern101 = [
  1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 1, 0, 1, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 0, 0, 0
]

var expectedPattern110 = [
  1, 1, 1, 1, 1, 1,
  1, 1, 1, 0, 0, 0,
  1, 1, 0, 1, 1, 0,
  1, 0, 1, 0, 1, 0,
  1, 0, 1, 1, 0, 1,
  1, 0, 0, 0, 1, 1
]

var expectedPattern111 = [
  1, 0, 1, 0, 1, 0,
  0, 0, 0, 1, 1, 1,
  1, 0, 0, 0, 1, 1,
  0, 1, 0, 1, 0, 1,
  1, 1, 1, 0, 0, 0,
  0, 1, 1, 1, 0, 0
]

test('Mask pattern - Apply mask', function (t) {
  var patterns = Object.keys(MaskPattern.Patterns).length
  var expectedPatterns = [
    expectedPattern000, expectedPattern001, expectedPattern010, expectedPattern011,
    expectedPattern100, expectedPattern101, expectedPattern110, expectedPattern111
  ]

  for (var p = 0; p < patterns; p++) {
    var matrix = new BitMatrix(6)
    MaskPattern.applyMask(p, matrix)
    t.deepEqual(matrix.data, new Buffer(expectedPatterns[p]), 'Should return correct pattern')
  }

  matrix = new BitMatrix(2)
  matrix.set(0, 0, false, true)
  matrix.set(0, 1, false, true)
  matrix.set(1, 0, false, true)
  matrix.set(1, 1, false, true)
  MaskPattern.applyMask(0, matrix)

  t.deepEqual(matrix.data, new Buffer([false, false, false, false]), 'Should leave reserved bit unchanged')

  t.throws(function () { MaskPattern.applyMask(-1, new BitMatrix(1)) }, 'Should throw if pattern is invalid')

  t.end()
})

test('Mask pattern - Best mask', function (t) {
  var matrix = new BitMatrix(7)
  // Draw a pattern with ratio 1:1:3:1:1 to test penality N3
  matrix.set(0, 1, true)
  matrix.set(0, 5, true)
  matrix.set(1, 0, true)
  matrix.set(5, 0, true)

  var mask = MaskPattern.getBestMask(matrix)
  t.ok(!isNaN(mask), 'Should return a number')

  t.end()
})
