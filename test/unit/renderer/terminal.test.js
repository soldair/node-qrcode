var test = require('tap').test
var QRCode = require('core/qrcode')
var TerminalRenderer = require('renderer/terminal')

test('TerminalRenderer interface', function (t) {
  t.type(TerminalRenderer.render, 'function',
    'Should have render function')

  t.end()
})

test('TerminalRenderer render', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })
  var str

  t.notThrow(function () { str = TerminalRenderer.render(sampleQrData) },
    'Should not throw with only qrData param')

  t.notThrow(function () {
    str = TerminalRenderer.render(sampleQrData, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  t.type(str, 'string',
    'Should return a string')

  t.notThrow(function () {
    str = TerminalRenderer.render(sampleQrData, { inverse: true })
  }, 'Should not throw with inverse options')

  t.type(str, 'string',
    'Should return a string if inverse option is set')

  t.end()
})
