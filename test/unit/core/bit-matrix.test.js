var test = require('tap').test
var BitMatrix = require('core/bit-matrix')

test('Bit Matrix', function (t) {
  t.throw(function () { BitMatrix(0) }, 'Should throw if size is 0')
  t.throw(function () { BitMatrix(-1) }, 'Should throw if size less than 0')

  var bm = new BitMatrix(2)

  t.equal(bm.size, 2, 'Should have correct size')
  t.equal(bm.data.length, 4, 'Should correctly set buffer size')

  bm.set(0, 1, true, true)
  t.ok(bm.get(0, 1), 'Should correctly set bit to true')
  t.ok(bm.isReserved(0, 1), 'Should correctly set bit as reserved')

  bm.xor(0, 1, 1)
  t.ok(!bm.get(0, 1), 'Should correctly xor bit')

  bm.set(0, 1, false)
  t.notOk(bm.get(0, 1), 'Should correctly set bit to false')

  t.end()
})
