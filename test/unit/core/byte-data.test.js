var test = require('tap').test
var BitBuffer = require('core/bit-buffer')
var ByteData = require('core/byte-data')
var Mode = require('core/mode')

test('Byte Data', function (t) {
  var text = '1234'
  var textBitLength = 32
  var textByte = [49, 50, 51, 52] // 1, 2, 3, 4
  var utf8Text = '\u00bd + \u00bc = \u00be' // 9 char, 12 byte

  var byteData = new ByteData(text)

  t.equal(byteData.mode, Mode.BYTE, 'Mode should be BYTE')
  t.equal(byteData.getLength(), text.length, 'Should return correct length')
  t.equal(byteData.getBitsLength(), textBitLength, 'Should return correct bit length')

  var bitBuffer = new BitBuffer()
  byteData.write(bitBuffer)
  t.deepEqual(bitBuffer.buffer, textByte, 'Should write correct data to buffer')

  var byteDataUtf8 = new ByteData(utf8Text)
  t.equal(byteDataUtf8.getLength(), 12, 'Should return correct length for utf8 chars')

  t.end()
})
