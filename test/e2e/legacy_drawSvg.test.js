var test = require('tap').test
var fs = require('fs')
var path = require('path')
var QRCode = require('lib')

test('Legacy drawSvg', function (t) {
  var file = path.join(__dirname, '/fixtures/expected-output.svg')
  t.plan(6)

  t.throw(function () { QRCode.drawSvg() },
    'Should throw if text is not provided')

  t.throw(function () { QRCode.drawSvg('some text') },
    'Should throw if a callback is not provided')

  QRCode.drawSvg('http://www.google.com', {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: 'H'
  }, function (err, code) {
    t.ok(err, 'there should be an error ')
    t.notOk(code, 'string should be null')
  })

  fs.readFile(file, 'utf8', function (err, expectedSvg) {
    if (err) throw err

    QRCode.drawSvg('http://www.google.com', {
      errorCorrectionLevel: 'H'
    }, function (err, code) {
      t.ok(!err, 'There should be no error')
      t.equal(code, expectedSvg, 'should output a valid svg')
    })
  })
})
