var test = require('tap').test
var sinon = require('sinon')
var fs = require('fs')
var stream = require('stream')
var QRCode = require('core/qrcode')
var PngRenderer = require('renderer/png')
var PNG = require('pngjs').PNG

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
  var url

  t.notThrow(function () { url = PngRenderer.renderToDataURL(sampleQrData) },
    'Should not throw with only qrData param')

  t.notThrow(function () {
    url = PngRenderer.renderToDataURL(sampleQrData, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  t.type(url, 'string',
    'Should return a string')

  t.equal(url.split(',')[0], 'data:image/png;base64',
    'Should have correct header')

  var b64png = url.split(',')[1]
  t.equal(b64png.length % 4, 0,
    'Should have a correct length')

  t.end()
})

test('PNG renderToFile', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })
  var fileName = 'qrimage.png'

  var fsStub = sinon.stub(fs, 'writeFileSync', function (path, buffer) {
    t.equal(path, fileName,
      'Should save file with correct file name')
  })

  fsStub.reset()

  t.notThrow(function () { PngRenderer.renderToFile(fileName, sampleQrData) },
    'Should not throw with only qrData param')

  t.notThrow(function () {
    PngRenderer.renderToFile(fileName, sampleQrData, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  fsStub.restore()
  fsStub = sinon.stub(fs, 'writeFileSync').throws()
  fsStub.reset()

  t.throw(function () { PngRenderer.renderToFile(fileName, sampleQrData) },
    'Should throw if error occurs during save')

  fsStub.restore()
  t.end()
})

test('PNG renderToFileStream', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })
  var fileName = 'qrimage.png'
  var fileStream

  var fsStub = sinon.stub(fs, 'createWriteStream', function (path) {
    t.equal(path, fileName,
      'Should save file with correct file name')

    var mockStream = new stream.Writable()
    mockStream._write = function () {}

    return mockStream
  })

  fsStub.reset()

  t.notThrow(function () {
    fileStream = PngRenderer.renderToFileStream(fileName, sampleQrData)
  }, 'Should not throw with only qrData param')

  t.ok(fileStream instanceof stream.Writable,
    'Should return a writable stream')

  t.notThrow(function () {
    fileStream = PngRenderer.renderToFileStream(fileName, sampleQrData, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  t.ok(fileStream instanceof stream.Writable,
    'Should return a writable stream')

  fsStub.restore()
  fsStub = sinon.stub(fs, 'createWriteStream').throws()
  fsStub.reset()

  t.throw(function () { PngRenderer.renderToFileStream(fileName, sampleQrData) },
    'Should throw if error occurs during stream creation')

  fsStub.restore()
  t.end()
})
