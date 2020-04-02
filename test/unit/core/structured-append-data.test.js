var test = require('tap').test
var BitBuffer = require('core/bit-buffer')
var StructuredAppendData = require('core/structured-append-data')
var Mode = require('core/mode')

test('Structured Append Data', function (t) {
  var data = { position: 0x1, total: 0x3, parity: 0x0A }

  var bytes = [0x13, 0xA]

  var structuredAppendData = new StructuredAppendData(data)

  t.equal(structuredAppendData.mode, Mode.STRUCTURED_APPEND, 'Mode should be STRUCTURED_APPEND')
  t.equal(structuredAppendData.getLength(), 0, 'Should return correct length')
  t.equal(structuredAppendData.getBitsLength(), 16, 'Should return correct bit length')

  var bitBuffer = new BitBuffer()
  structuredAppendData.write(bitBuffer)
  t.deepEqual(bitBuffer.buffer, bytes, 'Should write correct data to buffer')

  t.end()
})
