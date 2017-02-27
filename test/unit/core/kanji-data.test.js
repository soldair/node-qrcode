var test = require('tap').test
var BitBuffer = require('core/bit-buffer')
var KanjiData = require('core/kanji-data')
var Mode = require('core/mode')
var toSJIS = require('helper/to-sjis')
require('core/utils').setToSJISFunction(toSJIS)

test('Kanji Data', function (t) {
  var data = '漢字漾癶'
  var length = 4
  var bitLength = 52 // length * 13

  var dataBit = [57, 250, 134, 174, 129, 134, 0]

  var kanjiData = new KanjiData(data)

  t.equal(kanjiData.mode, Mode.KANJI, 'Mode should be KANJI')
  t.equal(kanjiData.getLength(), length, 'Should return correct length')
  t.equal(kanjiData.getBitsLength(), bitLength, 'Should return correct bit length')

  var bitBuffer = new BitBuffer()
  kanjiData.write(bitBuffer)
  t.deepEqual(bitBuffer.buffer, dataBit, 'Should write correct data to buffer')

  kanjiData = new KanjiData('abc')
  bitBuffer = new BitBuffer()
  t.throw(function () { kanjiData.write(bitBuffer) }, 'Should throw if data is invalid')

  t.end()
})
