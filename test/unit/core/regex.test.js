var test = require('tap').test
var Regex = require('core/regex')

test('Regex', function (t) {
  t.ok(Regex.NUMERIC instanceof RegExp,
    'Should export a regex for NUMERIC')

  t.ok(Regex.ALPHANUMERIC instanceof RegExp,
    'Should export a regex for ALPHANUMERIC')

  t.ok(Regex.BYTE instanceof RegExp,
    'Should export a regex for BYTE')

  t.ok(Regex.KANJI instanceof RegExp,
    'Should export a regex for KANJI')

  t.ok(Regex.BYTE_KANJI instanceof RegExp,
    'Should export a regex for BYTE_KANJI')

  t.end()
})

test('Regex test', function (t) {
  t.ok(Regex.testNumeric('123456'), 'Should return true if is a number')
  t.notOk(Regex.testNumeric('a12345'), 'Should return false if is not a number')
  t.notOk(Regex.testNumeric('ABC123'), 'Should return false if is not a number')

  t.ok(Regex.testAlphanumeric('123ABC'), 'Should return true if is alphanumeric')
  t.ok(Regex.testAlphanumeric('123456'), 'Should return true if is alphanumeric')
  t.notOk(Regex.testAlphanumeric('ABCabc'), 'Should return false if is not alphanumeric')

  t.ok(Regex.testKanji('乂ЁЖぞβ'), 'Should return true if is a kanji')
  t.notOk(Regex.testKanji('皿a晒三A'), 'Should return false if is not a kanji')
  t.notOk(Regex.testKanji('123456'), 'Should return false if is not a kanji')
  t.notOk(Regex.testKanji('ABC123'), 'Should return false if is not a kanji')
  t.notOk(Regex.testKanji('abcdef'), 'Should return false if is not a kanji')

  t.end()
})
