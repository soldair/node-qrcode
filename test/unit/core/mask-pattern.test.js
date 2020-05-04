const test = require('tap').test
const BitMatrix = require('core/bit-matrix')
const MaskPattern = require('core/mask-pattern')

test('Mask pattern - Pattern references', function (t) {
  const patternsCount = Object.keys(MaskPattern.Patterns).length
  t.equals(patternsCount, 8, 'Should return 8 patterns')

  t.end()
})

const expectedPattern000 = [
  1, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0,
  0, 1, 0, 1, 0, 1
]

const expectedPattern001 = [
  1, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0
]

const expectedPattern010 = [
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0
]

const expectedPattern011 = [
  1, 0, 0, 1, 0, 0,
  0, 0, 1, 0, 0, 1,
  0, 1, 0, 0, 1, 0,
  1, 0, 0, 1, 0, 0,
  0, 0, 1, 0, 0, 1,
  0, 1, 0, 0, 1, 0
]

const expectedPattern100 = [
  1, 1, 1, 0, 0, 0,
  1, 1, 1, 0, 0, 0,
  0, 0, 0, 1, 1, 1,
  0, 0, 0, 1, 1, 1,
  1, 1, 1, 0, 0, 0,
  1, 1, 1, 0, 0, 0
]

const expectedPattern101 = [
  1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 1, 0, 1, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 0, 0, 0
]

const expectedPattern110 = [
  1, 1, 1, 1, 1, 1,
  1, 1, 1, 0, 0, 0,
  1, 1, 0, 1, 1, 0,
  1, 0, 1, 0, 1, 0,
  1, 0, 1, 1, 0, 1,
  1, 0, 0, 0, 1, 1
]

const expectedPattern111 = [
  1, 0, 1, 0, 1, 0,
  0, 0, 0, 1, 1, 1,
  1, 0, 0, 0, 1, 1,
  0, 1, 0, 1, 0, 1,
  1, 1, 1, 0, 0, 0,
  0, 1, 1, 1, 0, 0
]

test('MaskPattern validity', function (t) {
  t.notOk(MaskPattern.isValid(), 'Should return false if no input')
  t.notOk(MaskPattern.isValid(''), 'Should return false if value is not a number')
  t.notOk(MaskPattern.isValid(-1), 'Should return false if value is not in range')
  t.notOk(MaskPattern.isValid(8), 'Should return false if value is not in range')

  t.end()
})

test('MaskPattern from value', function (t) {
  t.equal(MaskPattern.from(5), 5, 'Should return correct mask pattern from a number')
  t.equal(MaskPattern.from('5'), 5, 'Should return correct mask pattern from a string')
  t.equal(MaskPattern.from(-1), undefined, 'Should return undefined if value is invalid')
  t.equal(MaskPattern.from(null), undefined, 'Should return undefined if value is null')

  t.end()
})

test('Mask pattern - Apply mask', function (t) {
  const patterns = Object.keys(MaskPattern.Patterns).length
  const expectedPatterns = [
    expectedPattern000, expectedPattern001, expectedPattern010, expectedPattern011,
    expectedPattern100, expectedPattern101, expectedPattern110, expectedPattern111
  ]

  for (let p = 0; p < patterns; p++) {
    const matrix = new BitMatrix(6)
    MaskPattern.applyMask(p, matrix)
    t.deepEqual(matrix.data, new Uint8Array(expectedPatterns[p]), 'Should return correct pattern')
  }

  const matrix = new BitMatrix(2)
  matrix.set(0, 0, false, true)
  matrix.set(0, 1, false, true)
  matrix.set(1, 0, false, true)
  matrix.set(1, 1, false, true)
  MaskPattern.applyMask(0, matrix)

  t.deepEqual(matrix.data, new Uint8Array([false, false, false, false]), 'Should leave reserved bit unchanged')

  t.throws(function () { MaskPattern.applyMask(-1, new BitMatrix(1)) }, 'Should throw if pattern is invalid')

  t.end()
})

test('Mask pattern - Penalty N1', function (t) {
  let matrix = new BitMatrix(11)
  matrix.data = [
    1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1
  ]

  t.equals(MaskPattern.getPenaltyN1(matrix), 59,
    'Should return correct penalty points')

  matrix = new BitMatrix(6)
  matrix.data = expectedPattern000

  t.equals(MaskPattern.getPenaltyN1(matrix), 0,
    'Should return correct penalty points')

  matrix.data = expectedPattern001

  t.equals(MaskPattern.getPenaltyN1(matrix), 24,
    'Should return correct penalty points')

  matrix.data = expectedPattern010

  t.equals(MaskPattern.getPenaltyN1(matrix), 24,
    'Should return correct penalty points')

  matrix.data = expectedPattern101

  t.equals(MaskPattern.getPenaltyN1(matrix), 20,
    'Should return correct penalty points')

  t.end()
})

test('Mask pattern - Penalty N2', function (t) {
  let matrix = new BitMatrix(8)
  matrix.data = [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 1, 1,
    0, 1, 1, 1, 0, 0, 1, 1,
    1, 0, 0, 0, 1, 1, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 1, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 0, 0,
    1, 1, 0, 0, 1, 0, 1, 1
  ]

  t.equals(MaskPattern.getPenaltyN2(matrix), 45,
    'Should return correct penalty points')

  matrix = new BitMatrix(6)
  matrix.data = expectedPattern000

  t.equals(MaskPattern.getPenaltyN2(matrix), 0,
    'Should return correct penalty points')

  matrix.data = expectedPattern010

  t.equals(MaskPattern.getPenaltyN2(matrix), 30,
    'Should return correct penalty points')

  matrix.data = expectedPattern100

  t.equals(MaskPattern.getPenaltyN2(matrix), 36,
    'Should return correct penalty points')

  t.end()
})

test('Mask pattern - Penalty N3', function (t) {
  const matrix = new BitMatrix(11)
  matrix.data = [
    0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1,
    0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1,
    0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1,
    0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1,
    1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0
  ]

  t.equals(MaskPattern.getPenaltyN3(matrix), 160,
    'Should return correct penalty points')

  matrix.data = [
    1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
    0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1,
    1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1
  ]

  t.equals(MaskPattern.getPenaltyN3(matrix), 280,
    'Should return correct penalty points')

  t.end()
})

test('Mask pattern - Penalty N4', function (t) {
  const matrix = new BitMatrix(10)
  matrix.data = new Array(50).fill(1).concat(new Array(50).fill(0))

  t.equals(MaskPattern.getPenaltyN4(matrix), 0,
    'Should return correct penalty points')

  const matrix2 = new BitMatrix(21)
  matrix2.data = new Array(190).fill(1).concat(new Array(251).fill(0))

  t.equals(MaskPattern.getPenaltyN4(matrix2), 10,
    'Should return correct penalty points')

  const matrix3 = new BitMatrix(10)
  matrix3.data = new Array(22).fill(1).concat(new Array(78).fill(0))

  t.equals(MaskPattern.getPenaltyN4(matrix3), 50,
    'Should return correct penalty points')

  t.end()
})

test('Mask pattern - Best mask', function (t) {
  const matrix = new BitMatrix(11)
  matrix.data = [
    0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1,
    0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1,
    0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1,
    0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1,
    1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0
  ]

  const mask = MaskPattern.getBestMask(matrix, function () {})
  t.ok(!isNaN(mask), 'Should return a number')

  t.ok(mask >= 0 && mask < 8,
    'Should return a number in range 0,7')

  t.end()
})
