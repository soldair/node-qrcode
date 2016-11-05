var test = require('tap').test
var maskPattern = require('../mask-pattern')

test('Mask pattern - Pattern references', function (t) {
  var patternsCount = Object.keys(maskPattern.getPatterns()).length
  t.equals(patternsCount, 8, 'Should return 8 patterns')

  t.end()
})

test('Mask pattern - Apply mask', function (t) {
  var darkModule = true
  var lightModule = false

  var expectedMaskedDarkModule = false
  var expectedMaskedLightModule = true

  t.equals(maskPattern.applyMaskTo(darkModule, true), expectedMaskedDarkModule, 'Should return inverted module value')
  t.equals(maskPattern.applyMaskTo(lightModule, true), expectedMaskedLightModule, 'Should return inverted module value')

  t.equals(maskPattern.applyMaskTo(darkModule, false), darkModule, 'Should return unmodified module value')
  t.equals(maskPattern.applyMaskTo(lightModule, false), lightModule, 'Should return unmodified module value')

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

function getPatternArray (pattern) {
  var masked = []

  for (var j = 0; j < 6; j++) {
    for (var i = 0; i < 6; i++) {
      masked[i * 6 + j] = maskPattern.getMaskAt(pattern, i, j) ? 1 : 0
    }
  }

  return masked
}

test('Mask pattern - Get mask', function (t) {
  var patterns = maskPattern.getPatterns()

  t.throws(function () { maskPattern.getMaskAt() }, 'Should throw if pattern is invalid')

  t.deepEqual(getPatternArray(patterns.PATTERN000), expectedPattern000, 'Should return correct pattern')
  t.deepEqual(getPatternArray(patterns.PATTERN001), expectedPattern001, 'Should return correct pattern')
  t.deepEqual(getPatternArray(patterns.PATTERN010), expectedPattern010, 'Should return correct pattern')
  t.deepEqual(getPatternArray(patterns.PATTERN011), expectedPattern011, 'Should return correct pattern')
  t.deepEqual(getPatternArray(patterns.PATTERN100), expectedPattern100, 'Should return correct pattern')
  t.deepEqual(getPatternArray(patterns.PATTERN101), expectedPattern101, 'Should return correct pattern')
  t.deepEqual(getPatternArray(patterns.PATTERN110), expectedPattern110, 'Should return correct pattern')
  t.deepEqual(getPatternArray(patterns.PATTERN111), expectedPattern111, 'Should return correct pattern')

  t.end()
})
