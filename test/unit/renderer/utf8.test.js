var test = require('tap').test
var sinon = require('sinon')
var fs = require('fs')
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

test('Utf8 renderToFile', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })
  var fileName = 'qrimage.txt'
  var fsStub = sinon.stub(fs, 'writeFile').callsArg(2)
  fsStub.reset()

  t.plan(5)

  Utf8Renderer.renderToFile(fileName, sampleQrData, function (err) {
    t.ok(!err,
      'Should not generate errors with only qrData param')

    t.equal(fsStub.getCall(0).args[0], fileName,
      'Should save file with correct file name')
  })

  Utf8Renderer.renderToFile(fileName, sampleQrData, {
    margin: 10,
    scale: 1
  }, function (err) {
    t.ok(!err,
      'Should not generate errors with options param')

    t.equal(fsStub.getCall(0).args[0], fileName,
      'Should save file with correct file name')
  })

  fsStub.restore()
  fsStub = sinon.stub(fs, 'writeFile').callsArgWith(2, new Error())
  fsStub.reset()

  Utf8Renderer.renderToFile(fileName, sampleQrData, function (err) {
    t.ok(err,
      'Should fail if error occurs during save')
  })

  fsStub.restore()
})
