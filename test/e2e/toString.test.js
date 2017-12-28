var test = require('tap').test
var fs = require('fs')
var path = require('path')
var QRCode = require('lib')
var browser = require('lib/browser')
var Helpers = require('test/helpers')

test('toString - no promise available', function (t) {
  Helpers.removeNativePromise()

  t.throw(function () { QRCode.toString() },
    'Should throw if text is not provided')

  t.throw(function () { QRCode.toString('some text') },
    'Should throw if a callback is not provided')

  t.throw(function () { QRCode.toString('some text', {}) },
    'Should throw if a callback is not a function')

  t.throw(function () { QRCode.toString() },
    'Should throw if text is not provided (browser)')

  t.throw(function () { browser.toString('some text') },
    'Should throw if a callback is not provided (browser)')

  t.throw(function () { browser.toString('some text', {}) },
    'Should throw if a callback is not a function (browser)')

  t.end()

  Helpers.restoreNativePromise()
})

test('toString', function (t) {
  t.plan(5)

  t.throw(function () { QRCode.toString() },
    'Should throw if text is not provided')

  QRCode.toString('some text', function (err, str) {
    t.ok(!err, 'There should be no error')
    t.equals(typeof str, 'string',
      'Should return a string')
  })

  t.equals(typeof QRCode.toString('some text').then, 'function',
    'Should return a promise')

  QRCode.toString('some text', { errorCorrectionLevel: 'L' })
    .then(function (str) {
      t.equals(typeof str, 'string',
        'Should return a string')
    })
})

test('toString (browser)', function (t) {
  t.plan(5)

  t.throw(function () { browser.toString() },
    'Should throw if text is not provided')

  browser.toString('some text', function (err, str) {
    t.ok(!err, 'There should be no error (browser)')
    t.equals(typeof str, 'string',
      'Should return a string (browser)')
  })

  t.equals(typeof browser.toString('some text').then, 'function',
    'Should return a promise')

  browser.toString('some text', { errorCorrectionLevel: 'L' })
    .then(function (str) {
      t.equals(typeof str, 'string',
        'Should return a string')
    })
})

test('toString svg', function (t) {
  var file = path.join(__dirname, '/svgtag.expected.out')
  t.plan(6)

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

  QRCode.toString('http://www.google.com', {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: 'H',
    type: 'svg'
  }).catch(function (err) {
    t.ok(err, 'there should be an error (promise)')
  })

  fs.readFile(file, 'utf8', function (err, expectedSvg) {
    if (err) throw err

    QRCode.toString('http://www.google.com', {
      errorCorrectionLevel: 'H',
      type: 'svg'
    }).then(function (code) {
      t.equal(code, expectedSvg, 'should output a valid svg (promise)')
    })
  })
})

test('toString browser svg', function (t) {
  var file = path.join(__dirname, '/svgtag.expected.out')

  t.plan(3)

  fs.readFile(file, 'utf8', function (err, expectedSvg) {
    if (err) throw err

    browser.toString('http://www.google.com', {
      errorCorrectionLevel: 'H',
      type: 'svg'
    }, function (err, code) {
      t.ok(!err, 'There should be no error')
      t.equal(code, expectedSvg, 'should output a valid svg')
    })

    browser.toString('http://www.google.com', {
      errorCorrectionLevel: 'H',
      type: 'svg'
    }).then(function (code) {
      t.equal(code, expectedSvg, 'should output a valid svg (promise)')
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

  t.plan(9)

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

  QRCode.toString('http://www.google.com', {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: 'H',
    type: 'utf8'
  }).catch(function (err) {
    t.ok(err, 'there should be an error (promise)')
  })

  QRCode.toString('http://www.google.com', {
    errorCorrectionLevel: 'M',
    type: 'utf8'
  }).then(function (code) {
    t.equal(code, expectedUtf8, 'should output a valid symbol (promise)')
  })

  QRCode.toString('http://www.google.com').then(function (code) {
    t.equal(code, expectedUtf8,
      'Should output a valid symbol with default options (promise)')
  })
})

test('toString terminal', function (t) {
  var expectedTerminal = fs.readFileSync(path.join(__dirname, '/terminal.expected.out')) + ''

  t.plan(3)

  QRCode.toString('http://www.google.com', {
    errorCorrectionLevel: 'M',
    type: 'terminal'
  }, function (err, code) {
    t.ok(!err, 'There should be no error')
    t.equal(code + '\n', expectedTerminal, 'should output a valid symbol')
  })

  QRCode.toString('http://www.google.com', {
    errorCorrectionLevel: 'M',
    type: 'terminal'
  }).then(function (code) {
    t.equal(code + '\n', expectedTerminal, 'should output a valid symbol (promise)')
  })
})
