var test = require('tap').test
var RS = require('core/reed-solomon-encoder')

test('Reed-Solomon encoder', function (t) {
  var enc = new RS()

  t.notOk(enc.genPoly, 'Should have an undefined generator polynomial')
  t.throw(function () { enc.encode([]) }, 'Should throw if generator polynomial is undefined')

  enc.initialize(2)
  t.equal(enc.degree, 2, 'Should set correct degree value')
  t.ok(enc.genPoly, 'Generator polynomial should be defined')

  var result = enc.encode(new Buffer('01234'))
  t.equal(result.length, 2, 'Should return a number of codewords equal to gen poly degree')

  enc = new RS(2)
  var genPoly = enc.genPoly
  t.equal(enc.degree, 2, 'Should set correct degree value')
  t.ok(genPoly, 'Generator polynomial should be defined')

  enc.initialize(3)
  t.notEqual(enc.genPoly, genPoly, 'Should reinitialize the generator polynomial')

  enc = new RS(0)
  t.notOk(enc.genPoly, 'Should not create a generator polynomial if degree is 0')

  enc = new RS(1)
  t.deepEqual(enc.encode(new Buffer([0])), new Buffer([0]),
    'Should return correct buffer')

  t.end()
})
