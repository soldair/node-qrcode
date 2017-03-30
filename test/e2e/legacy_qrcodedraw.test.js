var test = require('tap').test
var Canvas = require('canvas')
var QRCode = require('lib/browser')

test('qrcodedraw draw', function (t) {
  var canvasEl = new Canvas(200, 200)

  t.plan(7)

  var qrcodeDraw
  // eslint-disable-next-line new-cap
  t.notThrow(function () { qrcodeDraw = new QRCode.qrcodedraw() })

  t.throw(function () { qrcodeDraw.draw(canvasEl, 'some text') },
    'Should throw if a callback is not provided')

  t.throw(function () { qrcodeDraw.draw(canvasEl, 'some text', {}) },
    'Should throw if callback is not a function')

  qrcodeDraw.draw(canvasEl, 'some text', function (err, canvasEl) {
    t.ok(!err, 'There should be no error')
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object')
  })

  qrcodeDraw.draw(canvasEl, 'some text', {
    errorCorrectionLevel: 'H'
  }, function (err, canvasEl) {
    t.ok(!err, 'There should be no error')
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object')
  })
})
