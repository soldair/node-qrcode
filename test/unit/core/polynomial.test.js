const test = require('tap').test
const Poly = require('core/polynomial')

test('Generator polynomial', function (t) {
  const result = Poly.generateECPolynomial(0)
  t.ok(result instanceof Uint8Array, 'Should return an Uint8Array')
  t.deepEqual(result, new Uint8Array([1]), 'Should return coeff [1] for polynomial of degree 0')

  for (let e = 2; e <= 68; e++) {
    t.equal(Poly.generateECPolynomial(e).length, e + 1, 'Should return a number of coefficients equal to (degree + 1)')
  }

  t.end()
})

test('Polynomial', function (t) {
  const p1 = [0, 1, 2, 3, 4]
  const p2 = [5, 6]

  let result = Poly.mul(p1, p2)
  t.ok(result instanceof Uint8Array, 'Should return an Uint8Array')
  t.equal(result.length, 6, 'Should return correct number of coefficients')

  result = Poly.mod(p1, Poly.generateECPolynomial(2))
  t.ok(result instanceof Uint8Array, 'Should return an Uint8Array')
  t.equal(result.length, 2, 'Should return correct number of coefficients')

  t.end()
})
