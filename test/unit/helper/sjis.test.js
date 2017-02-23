var test = require('tap').test
var toSJIS = require('helper/to-sjis')

test('SJIS from char', function (t) {
  t.notOk(toSJIS(''),
    'Should return undefined if character is invalid')

  t.notOk(toSJIS('A'),
    'Should return undefined if character is not a kanji')

  t.equal(toSJIS('襦'), 0xe640,
    'Should return correct SJIS value')

  t.equal(toSJIS('￢'), 0x81ca,
    'Should return correct SJIS value')

  t.end()
})
