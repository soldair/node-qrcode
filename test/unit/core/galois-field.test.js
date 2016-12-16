var test = require('tap').test
var GF = require('core/galois-field')

test('Galois Field', function (t) {
  t.throw(function () { GF.log(0) }, 'Should throw for log(n) with n < 1')

  for (var i = 1; i < 255; i++) {
    t.equal(GF.log(GF.exp(i)), i, 'log and exp should be one the inverse of the other')
    t.equal(GF.exp(GF.log(i)), i, 'exp and log should be one the inverse of the other')
  }

  t.equal(GF.mul(0, 1), 0, 'Should return 0 if first param is 0')
  t.equal(GF.mul(1, 0), 0, 'Should return 0 if second param is 0')
  t.equal(GF.mul(0, 0), 0, 'Should return 0 if both params are 0')

  for (var j = 1; j < 255; j++) {
    t.equal(GF.mul(j, 255 - j), GF.mul(255 - j, j), 'Multiplication should be commutative')
  }

  t.end()
})
