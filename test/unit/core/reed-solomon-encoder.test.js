const test = require('tap').test
const RS = require('core/reed-solomon-encoder')

test('Reed-Solomon encoder', function (t) {
  let enc = new RS()

  t.notOk(enc.genPoly, 'Should have an undefined generator polynomial')
  t.throw(function () { enc.encode([]) }, 'Should throw if generator polynomial is undefined')

  enc.initialize(2)
  t.equal(enc.degree, 2, 'Should set correct degree value')
  t.ok(enc.genPoly, 'Generator polynomial should be defined')

  const result = enc.encode(new Uint8Array([48, 49, 50, 51, 52]))
  t.equal(result.length, 2, 'Should return a number of codewords equal to gen poly degree')

  enc = new RS(2)
  const genPoly = enc.genPoly
  t.equal(enc.degree, 2, 'Should set correct degree value')
  t.ok(genPoly, 'Generator polynomial should be defined')

  enc.initialize(3)
  t.notEqual(enc.genPoly, genPoly, 'Should reinitialize the generator polynomial')

  enc = new RS(0)
  t.notOk(enc.genPoly, 'Should not create a generator polynomial if degree is 0')

  enc = new RS(1)
  t.deepEqual(enc.encode(new Uint8Array([0])), new Uint8Array([0]),
    'Should return correct buffer')

  t.end()
})
