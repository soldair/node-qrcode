var test = require('tap').test
var sinon = require('sinon')
var fs = require('fs')
var QRCode = require('core/qrcode')
var PngRenderer = require('renderer/png')
var PNG = require('pngjs').PNG
var StreamMock = require('../../mocks/writable-stream')

test('PNG renderer interface', function (t) {
  t.type(PngRenderer.render, 'function',
    'Should have render function')

  t.type(PngRenderer.renderToDataURL, 'function',
    'Should have renderToDataURL function')

  t.type(PngRenderer.renderToFile, 'function',
    'Should have renderToFile function')

  t.type(PngRenderer.renderToFileStream, 'function',
    'Should have renderToFileStream function')

  t.end()
})

test('PNG render', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })
  var png

  t.notThrow(function () { png = PngRenderer.render(sampleQrData) },
    'Should not throw with only qrData param')

  t.ok(png instanceof PNG,
    'Should return an instance of PNG')

  t.equal(png.width, png.height,
    'Should be a square image')

  // modules: 25, margins: 4 * 2, scale: 4
  t.equal(png.width, (25 + 4 * 2) * 4,
    'Should have correct size')

  t.notThrow(function () {
    png = PngRenderer.render(sampleQrData, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  t.equal(png.width, png.height,
    'Should be a square image')

  // modules: 25, margins: 10 * 2, scale: 1
  t.equal(png.width, 25 + 10 * 2,
    'Should have correct size')

  t.end()
})

test('PNG renderToDataURL', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })

  t.plan(6)

  PngRenderer.renderToDataURL(sampleQrData, function (err, url) {
    t.ok(!err,
      'Should not generate errors with only qrData param')

    t.type(url, 'string',
      'Should return a string')
  })

  PngRenderer.renderToDataURL(sampleQrData, { margin: 10, scale: 1 },
    function (err, url) {
      t.ok(!err, 'Should not generate errors with options param')

      t.type(url, 'string',
        'Should return a string')

      t.equal(url.split(',')[0], 'data:image/png;base64',
        'Should have correct header')

      var b64png = url.split(',')[1]
      t.equal(b64png.length % 4, 0,
        'Should have a correct length')
    }
  )
})

test('PNG renderToFile', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })
  var fileName = 'qrimage.png'
  var fsStub = sinon.stub(fs, 'createWriteStream')
  fsStub.returns(new StreamMock())
  fsStub.reset()

  t.plan(6)

  PngRenderer.renderToFile(fileName, sampleQrData, function (err) {
    t.ok(!err,
      'Should not generate errors with only qrData param')

    t.equal(fsStub.getCall(0).args[0], fileName,
      'Should save file with correct file name')
  })

  PngRenderer.renderToFile(fileName, sampleQrData, {
    margin: 10,
    scale: 1
  }, function (err) {
    t.ok(!err,
      'Should not generate errors with options param')

    t.equal(fsStub.getCall(0).args[0], fileName,
      'Should save file with correct file name')
  })

  fsStub.restore()
  fsStub = sinon.stub(fs, 'createWriteStream')
  fsStub.returns(new StreamMock().forceErrorOnWrite())
  fsStub.reset()

  PngRenderer.renderToFile(fileName, sampleQrData, function (err) {
    t.ok(err,
      'Should fail if error occurs during save')
  })

  fsStub.restore()
})

test('PNG renderToFileStream', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })

  t.notThrow(function () {
    PngRenderer.renderToFileStream(new StreamMock(), sampleQrData)
  }, 'Should not throw with only qrData param')

  t.notThrow(function () {
    PngRenderer.renderToFileStream(new StreamMock(), sampleQrData, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  t.end()
})
