import tap from 'tap'
import BitBuffer from '../../../lib/core/bit-buffer.js'
const test = tap.test
test('Bit Buffer', function (t) {
  const testData = 0x41 // 'A'
  const expectedDataBits = [false, true, false, false, false, false, false, true]
  const bitBuffer = new BitBuffer()
  t.equal(bitBuffer.getLengthInBits(), 0, 'Initial length should be 0')
  bitBuffer.put(testData, 8)
  t.equal(bitBuffer.getLengthInBits(), 8, 'Length should be 8')
  for (let i = 0; i < 8; i++) {
    t.deepEqual(bitBuffer.get(i), expectedDataBits[i], 'Should return correct bit value')
  }
  t.end()
})
