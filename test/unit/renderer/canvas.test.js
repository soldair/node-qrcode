const test = require('tap').test
const { Canvas, createCanvas } = require('canvas')
const QRCode = require('core/qrcode')
const CanvasRenderer = require('renderer/canvas')

test('CanvasRenderer interface', function (t) {
  t.type(CanvasRenderer.render, 'function',
    'Should have render function')

  t.type(CanvasRenderer.renderToDataURL, 'function',
    'Should have renderToDataURL function')

  t.end()
})

test('CanvasRenderer render', function (t) {
  // Mock document object
  global.document = {
    createElement: function (el) {
      if (el === 'canvas') {
        return createCanvas(200, 200)
      }
    }
  }

  const sampleQrData = QRCode.create('sample text', { version: 2 })
  let canvasEl

  t.notThrow(function () { canvasEl = CanvasRenderer.render(sampleQrData) },
    'Should not throw if canvas is not provided')

  t.ok(canvasEl instanceof Canvas,
    'Should return a new canvas object')

  t.notThrow(function () {
    canvasEl = CanvasRenderer.render(sampleQrData, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  // modules: 25, margins: 10 * 2, scale: 1
  t.equal(canvasEl.width, 25 + 10 * 2,
    'Should have correct size')

  t.equal(canvasEl.width, canvasEl.height,
    'Should be a square image')

  global.document = undefined

  t.throw(function () { canvasEl = CanvasRenderer.render(sampleQrData) },
    'Should throw if canvas cannot be created')

  t.end()
})

test('CanvasRenderer render to provided canvas', function (t) {
  const sampleQrData = QRCode.create('sample text', { version: 2 })
  const canvasEl = createCanvas(200, 200)

  t.notThrow(function () { CanvasRenderer.render(sampleQrData, canvasEl) },
    'Should not throw with only qrData and canvas param')

  t.notThrow(function () {
    CanvasRenderer.render(sampleQrData, canvasEl, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  // modules: 25, margins: 10 * 2, scale: 1
  t.equal(canvasEl.width, 25 + 10 * 2,
    'Should have correct size')

  t.equal(canvasEl.width, canvasEl.height,
    'Should be a square image')

  t.end()
})

test('CanvasRenderer renderToDataURL', function (t) {
  // Mock document object
  global.document = {
    createElement: function (el) {
      if (el === 'canvas') {
        return createCanvas(200, 200)
      }
    }
  }

  const sampleQrData = QRCode.create('sample text', { version: 2 })
  let url

  t.notThrow(function () { url = CanvasRenderer.renderToDataURL(sampleQrData) },
    'Should not throw if canvas is not provided')

  t.notThrow(function () {
    url = CanvasRenderer.renderToDataURL(sampleQrData, {
      margin: 10,
      scale: 1,
      type: 'image/png'
    })
  }, 'Should not throw with options param')

  t.type(url, 'string',
    'Should return a string')

  t.equal(url.split(',')[0], 'data:image/png;base64',
    'Should have correct header')

  const b64png = url.split(',')[1]
  t.equal(b64png.length % 4, 0,
    'Should have a correct length')

  global.document = undefined
  t.end()
})

test('CanvasRenderer renderToDataURL to provided canvas', function (t) {
  const sampleQrData = QRCode.create('sample text', { version: 2 })
  const canvasEl = createCanvas(200, 200)
  let url

  t.notThrow(function () {
    url = CanvasRenderer.renderToDataURL(sampleQrData, canvasEl)
  }, 'Should not throw with only qrData and canvas param')

  t.notThrow(function () {
    url = CanvasRenderer.renderToDataURL(sampleQrData, canvasEl, {
      margin: 10,
      scale: 1,
      type: 'image/png'
    })
  }, 'Should not throw with options param')

  t.type(url, 'string',
    'Should return a string')

  t.equal(url.split(',')[0], 'data:image/png;base64',
    'Should have correct header')

  const b64png = url.split(',')[1]
  t.equal(b64png.length % 4, 0,
    'Should have a correct length')

  t.end()
})
