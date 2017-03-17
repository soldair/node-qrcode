var test = require('tap').test
var QRCode = require('core/qrcode')
var Utf8Renderer = require('renderer/utf8')

test('Utf8Renderer interface', function (t) {
  t.type(Utf8Renderer.render, 'function',
    'Should have render function')

  t.end()
})

test('Utf8Renderer render', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })
  var str

  t.notThrow(function () { str = Utf8Renderer.render(sampleQrData) },
    'Should not throw with only qrData param')

  t.notThrow(function () {
    str = Utf8Renderer.render(sampleQrData, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  t.type(str, 'string',
    'Should return a string')

  t.end()
})
