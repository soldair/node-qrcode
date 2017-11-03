var test = require('tap').test
var fs = require('fs')
var path = require('path')
var QRCode = require('lib')
var browser = require('lib/browser')

test('toString svg', function (t) {
  var file = path.join(__dirname, '/fixtures/expected-output.svg')
  t.plan(6)

  t.throw(function () { QRCode.toString() },
    'Should throw if text is not provided')

  t.throw(function () { QRCode.toString('some text') },
    'Should throw if a callback is not provided')

  QRCode.toString('http://www.google.com', {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: 'H',
    type: 'svg'
  }, function (err, code) {
    t.ok(err, 'there should be an error ')
    t.notOk(code, 'string should be null')
  })

  fs.readFile(file, 'utf8', function (err, expectedSvg) {
    if (err) throw err

    QRCode.toString('http://www.google.com', {
      errorCorrectionLevel: 'H',
      type: 'svg'
    }, function (err, code) {
      t.ok(!err, 'There should be no error')
      t.equal(code, expectedSvg, 'should output a valid svg')
    })
  })
})

test('toString browser svg', function (t) {
  var file = path.join(__dirname, '/fixtures/expected-output.svg')
  fs.readFile(file, 'utf8', function (err, expectedSvg) {
    if (err) throw err

    browser.toString('http://www.google.com', {
      errorCorrectionLevel: 'H',
      type: 'svg'
    }, function (err, code) {
      t.ok(!err, 'There should be no error')
      t.equal(code, expectedSvg, 'should output a valid svg')
      t.end()
    })
  })
})

test('toString utf8', function (t) {
  var expectedUtf8 = [
    '                                 ',
    '                                 ',
    '    █▀▀▀▀▀█ █ ▄█  ▀ █ █▀▀▀▀▀█    ',
    '    █ ███ █ ▀█▄▀▄█ ▀▄ █ ███ █    ',
    '    █ ▀▀▀ █ ▀▄ ▄ ▄▀ █ █ ▀▀▀ █    ',
    '    ▀▀▀▀▀▀▀ ▀ ▀ █▄▀ █ ▀▀▀▀▀▀▀    ',
    '    ▀▄ ▀▀▀▀█▀▀█▄ ▄█▄▀█ ▄█▄██▀    ',
    '    █▄ ▄▀▀▀▄▄█ █▀▀▄█▀ ▀█ █▄▄█    ',
    '    █▄ ▄█▄▀█▄▄  ▀ ▄██▀▀ ▄  ▄▀    ',
    '    █▀▄▄▄▄▀▀█▀▀█▀▀▀█ ▀ ▄█▀█▀█    ',
    '    ▀ ▀▀▀▀▀▀███▄▄▄▀ █▀▀▀█ ▀█     ',
    '    █▀▀▀▀▀█ █▀█▀▄ ▄▄█ ▀ █▀ ▄█    ',
    '    █ ███ █ █ █ ▀▀██▀███▀█ ██    ',
    '    █ ▀▀▀ █  █▀ ▀ █ ▀▀▄██ ███    ',
    '    ▀▀▀▀▀▀▀ ▀▀▀  ▀▀ ▀    ▀  ▀    ',
    '                                 ',
    '                                 '].join('\n')

  t.plan(8)

  t.throw(function () { QRCode.toString() },
    'Should throw if text is not provided')

  t.throw(function () { QRCode.toString('some text') },
    'Should throw if a callback is not provided')

  QRCode.toString('http://www.google.com', {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: 'H',
    type: 'utf8'
  }, function (err, code) {
    t.ok(err, 'there should be an error ')
    t.notOk(code, 'string should be null')
  })

  QRCode.toString('http://www.google.com', {
    errorCorrectionLevel: 'M',
    type: 'utf8'
  }, function (err, code) {
    t.ok(!err, 'There should be no error')
    t.equal(code, expectedUtf8, 'should output a valid symbol')
  })

  QRCode.toString('http://www.google.com', function (err, code) {
    t.ok(!err, 'There should be no error')
    t.equal(code, expectedUtf8,
      'Should output a valid symbol with default options')
  })
})

test('toString terminal', function (t) {
  var expectedTerminal = fs.readFileSync(path.join(__dirname, '/terminal.expected.out')) + ''

  t.plan(4)

  t.throw(function () { QRCode.toString() },
    'Should throw if text is not provided')

  t.throw(function () { QRCode.toString('some text') },
    'Should throw if a callback is not provided')

  QRCode.toString('http://www.google.com', {
    errorCorrectionLevel: 'M',
    type: 'terminal'
  }, function (err, code) {
    t.ok(!err, 'There should be no error')
    t.equal(code + '\n', expectedTerminal, 'should output a valid symbol')
  })
})
