var test = require('tap').test
var Mode = require('core/mode')

test('Mode bits', function (t) {
  var EXPECTED_BITS = {
    numeric: 1,
    alphanumeric: 2,
    byte: 4,
    kanji: 8,
    mixed: -1
  }

  t.equal(Mode.NUMERIC.bit, EXPECTED_BITS.numeric)
  t.equal(Mode.ALPHANUMERIC.bit, EXPECTED_BITS.alphanumeric)
  t.equal(Mode.BYTE.bit, EXPECTED_BITS.byte)
  t.equal(Mode.KANJI.bit, EXPECTED_BITS.kanji)
  t.equal(Mode.MIXED.bit, EXPECTED_BITS.mixed)

  t.end()
})

test('Char count bits', function (t) {
  var EXPECTED_BITS = {
    numeric: [10, 12, 14],
    alphanumeric: [9, 11, 13],
    byte: [8, 16, 16],
    kanji: [8, 10, 12]
  }

  var v
  for (v = 1; v < 10; v++) {
    t.equal(Mode.getCharCountIndicator(Mode.NUMERIC, v), EXPECTED_BITS.numeric[0])
    t.equal(Mode.getCharCountIndicator(Mode.ALPHANUMERIC, v), EXPECTED_BITS.alphanumeric[0])
    t.equal(Mode.getCharCountIndicator(Mode.BYTE, v), EXPECTED_BITS.byte[0])
    t.equal(Mode.getCharCountIndicator(Mode.KANJI, v), EXPECTED_BITS.kanji[0])
  }

  for (v = 10; v < 27; v++) {
    t.equal(Mode.getCharCountIndicator(Mode.NUMERIC, v), EXPECTED_BITS.numeric[1])
    t.equal(Mode.getCharCountIndicator(Mode.ALPHANUMERIC, v), EXPECTED_BITS.alphanumeric[1])
    t.equal(Mode.getCharCountIndicator(Mode.BYTE, v), EXPECTED_BITS.byte[1])
    t.equal(Mode.getCharCountIndicator(Mode.KANJI, v), EXPECTED_BITS.kanji[1])
  }

  for (v = 27; v <= 40; v++) {
    t.equal(Mode.getCharCountIndicator(Mode.NUMERIC, v), EXPECTED_BITS.numeric[2])
    t.equal(Mode.getCharCountIndicator(Mode.ALPHANUMERIC, v), EXPECTED_BITS.alphanumeric[2])
    t.equal(Mode.getCharCountIndicator(Mode.BYTE, v), EXPECTED_BITS.byte[2])
    t.equal(Mode.getCharCountIndicator(Mode.KANJI, v), EXPECTED_BITS.kanji[2])
  }

  t.throw(function () { Mode.getCharCountIndicator({}, 1) },
    'Should throw if mode is invalid')

  t.throw(function () { Mode.getCharCountIndicator(Mode.BYTE, 0) },
    'Should throw if version is invalid')

  t.end()
})

test('Best mode', function (t) {
  var EXPECTED_MODE = {
    '12345': Mode.NUMERIC,
    'abcde': Mode.BYTE,
    '1234a': Mode.BYTE,
    'ABCDa': Mode.BYTE,
    'ABCDE': Mode.ALPHANUMERIC,
    '12ABC': Mode.ALPHANUMERIC,
    '乂ЁЖぞβ': Mode.KANJI,
    'ΑΒΓψωЮЯабв': Mode.KANJI,
    '皿a晒三': Mode.BYTE
  }

  Object.keys(EXPECTED_MODE).forEach(function (data) {
    t.equal(Mode.getBestModeForData(data), EXPECTED_MODE[data],
      'Should return mode ' + Mode.toString(EXPECTED_MODE[data]) + ' for data: ' + data)
  })

  t.end()
})

test('Is valid', function (t) {
  t.ok(Mode.isValid(Mode.NUMERIC))
  t.ok(Mode.isValid(Mode.ALPHANUMERIC))
  t.ok(Mode.isValid(Mode.BYTE))
  t.ok(Mode.isValid(Mode.KANJI))

  t.notOk(Mode.isValid(undefined))
  t.notOk(Mode.isValid({ bit: 1 }))
  t.notOk(Mode.isValid({ ccBits: [] }))

  t.end()
})

test('From value', function (t) {
  var modes = [
    { name: 'numeric', mode: Mode.NUMERIC },
    { name: 'alphanumeric', mode: Mode.ALPHANUMERIC },
    { name: 'kanji', mode: Mode.KANJI },
    { name: 'byte', mode: Mode.BYTE }
  ]

  for (var m = 0; m < modes.length; m++) {
    t.equal(Mode.from(modes[m].name), modes[m].mode)
    t.equal(Mode.from(modes[m].name.toUpperCase()), modes[m].mode)
    t.equal(Mode.from(modes[m].mode), modes[m].mode)
  }

  t.equal(Mode.from('', Mode.NUMERIC), Mode.NUMERIC,
    'Should return default value if mode is invalid')

  t.equal(Mode.from(null, Mode.NUMERIC), Mode.NUMERIC,
    'Should return default value if mode undefined')

  t.end()
})

test('To string', function (t) {
  t.equal(Mode.toString(Mode.NUMERIC), 'Numeric')
  t.equal(Mode.toString(Mode.ALPHANUMERIC), 'Alphanumeric')
  t.equal(Mode.toString(Mode.BYTE), 'Byte')
  t.equal(Mode.toString(Mode.KANJI), 'Kanji')

  t.throw(function () { Mode.toString({}) }, 'Should throw if mode is invalid')

  t.end()
})
