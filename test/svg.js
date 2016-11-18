var test = require('tap').test
var fs = require('fs')
var path = require('path')
var QRCode = require('../lib')

test('drawSvg', function (t) {
  var expectedSvg = fs.readFileSync(path.join(__dirname, '/fixtures/expected-output.svg'), 'UTF-8')

  QRCode.drawSvg('http://www.google.com', function (err, code) {
    t.ok(!err, 'there should be no error')
    t.equal(code, expectedSvg, 'should output a valid svg')

    t.end()
  })
})
