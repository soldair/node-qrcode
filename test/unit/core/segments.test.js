var test = require('tap').test
var Mode = require('core/mode')
var Segments = require('core/segments')
var NumericData = require('core/numeric-data')
var AlphanumericData = require('core/alphanumeric-data')
var ByteData = require('core/byte-data')
var toSJIS = require('helper/to-sjis')
var Utils = require('core/utils')

var testData = [
  {
    input: '1A1',
    result: [{data: '1A1', mode: Mode.ALPHANUMERIC}]
  },
  {
    input: 'a-1-b-2?',
    result: [{data: 'a-1-b-2?', mode: Mode.BYTE}]
  },
  {
    input: 'AB123456CDF',
    result: [{data: 'AB123456CDF', mode: Mode.ALPHANUMERIC}]
  },
  {
    input: 'aABC000000-?-----a',
    result: [
      {data: 'aABC', mode: Mode.BYTE},
      {data: '000000', mode: Mode.NUMERIC},
      {data: '-?-----a', mode: Mode.BYTE}
    ]
  },
  {
    input: 'aABC000000A?',
    result: [
      {data: 'aABC', mode: Mode.BYTE},
      {data: '000000', mode: Mode.NUMERIC},
      {data: 'A?', mode: Mode.BYTE}
    ]
  },
  {
    input: 'a1234ABCDEF?',
    result: [
      {data: 'a', mode: Mode.BYTE},
      {data: '1234ABCDEF', mode: Mode.ALPHANUMERIC},
      {data: '?', mode: Mode.BYTE}
    ]
  },
  {
    input: '12345A12345',
    result: [
      {data: '12345A12345', mode: Mode.ALPHANUMERIC}
    ]
  },
  {
    input: 'aABCDEFGHILMNa',
    result: [
      {data: 'a', mode: Mode.BYTE},
      {data: 'ABCDEFGHILMN', mode: Mode.ALPHANUMERIC},
      {data: 'a', mode: Mode.BYTE}
    ]
  },
  {
    input: 'Aa12345',
    result: [
      {data: 'Aa', mode: Mode.BYTE},
      {data: '12345', mode: Mode.NUMERIC}
    ]
  },
  {
    input: 'a1A2B3C4D5E6F4G7',
    result: [
      {data: 'a', mode: Mode.BYTE},
      {data: '1A2B3C4D5E6F4G7', mode: Mode.ALPHANUMERIC}
    ]
  },
  {
    input: '123456789QWERTYUIOPASD',
    result: [
      {data: '123456789', mode: Mode.NUMERIC},
      {data: 'QWERTYUIOPASD', mode: Mode.ALPHANUMERIC}
    ]
  },
  {
    input: 'QWERTYUIOPASD123456789',
    result: [
      {data: 'QWERTYUIOPASD', mode: Mode.ALPHANUMERIC},
      {data: '123456789', mode: Mode.NUMERIC}
    ]
  },
  {
    input: 'ABCDEF123456a',
    result: [
      {data: 'ABCDEF123456', mode: Mode.ALPHANUMERIC},
      {data: 'a', mode: Mode.BYTE}
    ]
  },
  {
    input: 'abcdefABCDEF',
    result: [
      {data: 'abcdef', mode: Mode.BYTE},
      {data: 'ABCDEF', mode: Mode.ALPHANUMERIC}
    ]
  },
  {
    input: 'a123456ABCDEa',
    result: [
      {data: 'a', mode: Mode.BYTE},
      {data: '123456ABCDE', mode: Mode.ALPHANUMERIC},
      {data: 'a', mode: Mode.BYTE}
    ]
  },
  {
    input: 'AAAAA12345678?A1A',
    result: [
      {data: 'AAAAA', mode: Mode.ALPHANUMERIC},
      {data: '12345678', mode: Mode.NUMERIC},
      {data: '?A1A', mode: Mode.BYTE}
    ]
  },
  {
    input: 'Aaa',
    result: [{data: 'Aaa', mode: Mode.BYTE}]
  },
  {
    input: 'Aa12345A',
    result: [
      {data: 'Aa', mode: Mode.BYTE},
      {data: '12345A', mode: Mode.ALPHANUMERIC}
    ]
  }
]

var kanjiTestData = [
  {
    input: '乂ЁЖぞβ',
    result: [{data: '乂ЁЖぞβ', mode: Mode.KANJI}]
  },
  {
    input: 'ΑΒΓψωЮЯабв',
    result: [{data: 'ΑΒΓψωЮЯабв', mode: Mode.KANJI}]
  },
  {
    input: '皿a晒三',
    result: [
      {data: '皿a', mode: Mode.BYTE},
      {data: '晒三', mode: Mode.KANJI}
    ]
  }
]

testData = testData.concat(kanjiTestData)

test('Segments from array', function (t) {
  t.deepEqual(Segments.fromArray(['abcdef', '12345']),
    [new ByteData('abcdef'), new NumericData('12345')],
    'Should return correct segment from array of string')

  t.deepEqual(Segments.fromArray(
    [{ data: 'abcdef', mode: Mode.BYTE }, { data: '12345', mode: Mode.NUMERIC }]),
    [new ByteData('abcdef'), new NumericData('12345')],
    'Should return correct segment from array of objects')

  t.deepEqual(Segments.fromArray(
    [{ data: 'abcdef', mode: 'byte' }, { data: '12345', mode: 'numeric' }]),
    [new ByteData('abcdef'), new NumericData('12345')],
    'Should return correct segment from array of objects if mode is specified as string')

  t.deepEqual(Segments.fromArray(
    [{ data: 'abcdef' }, { data: '12345' }]),
    [new ByteData('abcdef'), new NumericData('12345')],
    'Should return correct segment from array of objects if mode is not specified')

  t.deepEqual(Segments.fromArray([{}]), [],
    'Should return an empty array')

  t.throw(function () { Segments.fromArray([{ data: 'ABCDE', mode: 'numeric' }]) },
    'Should throw if segment cannot be encoded with specified mode')

  t.deepEqual(Segments.fromArray(
    [{ data: '０１２３', mode: Mode.KANJI }]), [new ByteData('０１２３')],
    'Should use Byte mode if kanji support is disabled')

  t.end()
})

test('Segments optimization', function (t) {
  t.deepEqual(Segments.fromString('乂ЁЖ', 1), Segments.fromArray([{ data: '乂ЁЖ', mode: 'byte' }]),
    'Should use Byte mode if Kanji support is disabled')

  Utils.setToSJISFunction(toSJIS)
  testData.forEach(function (data) {
    t.deepEqual(Segments.fromString(data.input, 1), Segments.fromArray(data.result))
  })

  t.end()
})

test('Segments raw split', function (t) {
  var splitted = [
    new ByteData('abc'),
    new AlphanumericData('DEF'),
    new NumericData('123')
  ]

  t.deepEqual(Segments.rawSplit('abcDEF123'), splitted)

  t.end()
})
