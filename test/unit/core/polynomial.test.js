var test = require('tap').test
var Poly = require('core/polynomial')

test('Generator polynomial', function (t) {
  var result = Poly.generateECPolynomial(0)
  t.ok(Buffer.isBuffer(result), 'Should return a buffer')
  t.deepEqual(result, new Buffer([1]), 'Should return coeff [1] for polynomial of degree 0')

  for (var e = 2; e <= 68; e++) {
    t.equal(Poly.generateECPolynomial(e).length, e + 1, 'Should return a number of coefficients equal to (degree + 1)')
  }

  t.end()
})

test('Polynomial', function (t) {
  var p1 = [0, 1, 2, 3, 4]
  var p2 = [5, 6]

  var result = Poly.mul(p1, p2)
  t.ok(Buffer.isBuffer(result), 'Should return a buffer')
  t.equal(result.length, 6, 'Should return correct number of coefficients')

  result = Poly.mod(p1, Poly.generateECPolynomial(2))
  t.ok(Buffer.isBuffer(result), 'Should return a buffer')
  t.equal(result.length, 2, 'Should return correct number of coefficients')

  t.end()
})
