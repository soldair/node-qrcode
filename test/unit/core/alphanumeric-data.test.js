var test = require('tap').test
var BitBuffer = require('core/bit-buffer')
var AlphanumericData = require('core/alphanumeric-data')
var Mode = require('core/mode')

var testData = [
  {
    data: 'A',
    length: 1,
    bitLength: 6,
    dataBit: [40]
  },
  {
    data: 'AB',
    length: 2,
    bitLength: 11,
    dataBit: [57, 160]
  },
  {
    data: 'ABC12',
    length: 5,
    bitLength: 28,
    dataBit: [57, 168, 116, 32]
  }
]

test('Alphanumeric Data', function (t) {
  testData.forEach(function (data) {
    var alphanumericData = new AlphanumericData(data.data)

    t.equal(alphanumericData.mode, Mode.ALPHANUMERIC, 'Mode should be ALPHANUMERIC')
    t.equal(alphanumericData.getLength(), data.length, 'Should return correct length')
    t.equal(alphanumericData.getBitsLength(), data.bitLength, 'Should return correct bit length')

    var bitBuffer = new BitBuffer()
    alphanumericData.write(bitBuffer)
    t.deepEqual(bitBuffer.buffer, data.dataBit, 'Should write correct data to buffer')
  })

  t.end()
})
