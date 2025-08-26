import tap from 'tap'
import BitBuffer from '../../../lib/core/bit-buffer.js'
import KanjiData from '../../../lib/core/kanji-data.js'
import * as Mode from '../../../lib/core/mode.js'
import toSJIS from '../../../helper/to-sjis.js'
import * as utils from '../../../lib/core/utils.js'
const test = tap.test
utils.setToSJISFunction(toSJIS)
test('Kanji Data', function (t) {
  const data = '漢字漾癶'
  const length = 4
  const bitLength = 52 // length * 13
  const dataBit = [57, 250, 134, 174, 129, 134, 0]
  let kanjiData = new KanjiData(data)
  t.equal(kanjiData.mode, Mode.KANJI, 'Mode should be KANJI')
  t.equal(kanjiData.getLength(), length, 'Should return correct length')
  t.equal(kanjiData.getBitsLength(), bitLength, 'Should return correct bit length')
  let bitBuffer = new BitBuffer()
  kanjiData.write(bitBuffer)
  t.deepEqual(bitBuffer.buffer, dataBit, 'Should write correct data to buffer')
  kanjiData = new KanjiData('abc')
  bitBuffer = new BitBuffer()
  t.throw(function () { kanjiData.write(bitBuffer) }, 'Should throw if data is invalid')
  t.end()
})
