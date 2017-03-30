var test = require('tap').test
var Canvas = require('canvas')
var QRCode = require('lib')

test('toCanvas', function (t) {
  // Mock document object
  global.document = {
    createElement: function (el) {
      if (el === 'canvas') {
        return new Canvas(200, 200)
      }
    }
  }

  t.plan(7)

  t.throw(function () { QRCode.toCanvas() },
    'Should throw if no arguments are provided')

  t.throw(function () { QRCode.toCanvas('some text') },
    'Should throw if a callback is not provided')

  t.throw(function () { QRCode.toCanvas('some text', {}) },
    'Should throw if callback is not a function')

  QRCode.toCanvas('some text', function (err, canvasEl) {
    t.ok(!err, 'There should be no error')
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object')
  })

  QRCode.toCanvas('some text', {
    errorCorrectionLevel: 'H'
  }, function (err, canvasEl) {
    t.ok(!err, 'There should be no error')
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object')
  })

  global.document = undefined
})

test('toCanvas with specified canvas element', function (t) {
  var canvasEl = new Canvas(200, 200)

  t.plan(6)

  t.throw(function () { QRCode.toCanvas(canvasEl, 'some text') },
    'Should throw if a callback is not provided')

  t.throw(function () { QRCode.toCanvas(canvasEl, 'some text', {}) },
    'Should throw if callback is not a function')

  QRCode.toCanvas(canvasEl, 'some text', function (err, canvasEl) {
    t.ok(!err, 'There should be no error')
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object')
  })

  QRCode.toCanvas(canvasEl, 'some text', {
    errorCorrectionLevel: 'H'
  }, function (err, canvasEl) {
    t.ok(!err, 'There should be no error')
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object')
  })
})
