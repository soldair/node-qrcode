var test = require('tap').test
var Utils = require('renderer/utils')

test('Utils getOptions', function (t) {
  var defaultOptions = {
    width: undefined,
    scale: 4,
    margin: 4,
    color: {
      dark: { r: 0, g: 0, b: 0, a: 255, hex: '#000000' },
      light: { r: 255, g: 255, b: 255, a: 255, hex: '#ffffff' }
    },
    type: undefined,
    rendererOpts: {}
  }

  t.ok(Utils.getOptions,
    'getOptions should be defined')

  t.deepEqual(Utils.getOptions(), defaultOptions,
    'Should return default options if called without param')

  t.equal(Utils.getOptions({ scale: 8 }).scale, 8,
    'Should return correct scale value')

  t.equal(Utils.getOptions({ width: 300 }).scale, 4,
    'Should reset scale value to default if width is set')

  t.equal(Utils.getOptions({ margin: null }).margin, 4,
    'Should return default margin if specified value is null')

  t.equal(Utils.getOptions({ margin: -1 }).margin, 4,
    'Should return default margin if specified value is < 0')

  t.equal(Utils.getOptions({ margin: 20 }).margin, 20,
    'Should return correct margin value')

  t.deepEqual(Utils.getOptions({ color: { dark: '#fff', light: '#000000' } }).color,
    {
      dark: { r: 255, g: 255, b: 255, a: 255, hex: '#ffffff' },
      light: { r: 0, g: 0, b: 0, a: 255, hex: '#000000' }
    },
    'Should return correct colors value')

  t.throw(function () { Utils.getOptions({ color: { dark: 1234 } }) },
    'Should throw if color is not a string')

  t.throw(function () { Utils.getOptions({ color: { dark: '#aa' } }) },
    'Should throw if color is not in a valid hex format')

  t.end()
})

test('Utils getScale', function (t) {
  var symbolSize = 21

  t.equal(Utils.getScale(symbolSize, { scale: 5 }), 5,
    'Should return correct scale value')

  t.equal(Utils.getScale(symbolSize, { width: 50, margin: 2 }), 2,
    'Should calculate correct scale from width and margin')

  t.equal(Utils.getScale(symbolSize, { width: 21, margin: 2, scale: 4 }), 4,
    'Should return default scale if width is too small to contain the symbol')

  t.end()
})

test('Utils getImageWidth', function (t) {
  var symbolSize = 21

  t.equal(Utils.getImageWidth(symbolSize, { scale: 5, margin: 0 }), 105,
    'Should return correct width value')

  t.equal(Utils.getImageWidth(symbolSize, { width: 250, margin: 2 }), 250,
    'Should return specified width value')

  t.equal(Utils.getImageWidth(symbolSize, { width: 10, margin: 4, scale: 4 }), 116,
    'Should ignore width option if too small to contain the symbol')

  t.end()
})

test('Utils qrToImageData', function (t) {
  t.ok(Utils.qrToImageData,
    'qrToImageData should be defined')

  var sampleQrData = {
    modules: {
      data: [
        1, 0, 1, 0,
        0, 1, 0, 1,
        1, 0, 1, 0,
        0, 1, 0, 1
      ],
      size: 4
    }
  }

  var margin = 4
  var scale = 2
  var width = 100

  var color = {
    dark: { r: 255, g: 255, b: 255, a: 255 },
    light: { r: 0, g: 0, b: 0, a: 255 }
  }

  var opts = {
    margin: margin,
    scale: scale,
    color: color
  }

  var imageData = []
  var expectedImageSize = (sampleQrData.modules.size + margin * 2) * scale
  var expectedImageDataLength = Math.pow(expectedImageSize, 2) * 4

  Utils.qrToImageData(imageData, sampleQrData, opts)

  t.equal(imageData.length, expectedImageDataLength,
    'Should return correct imageData length')

  imageData = []
  opts.width = width
  expectedImageDataLength = Math.pow(width, 2) * 4

  Utils.qrToImageData(imageData, sampleQrData, opts)

  t.equal(imageData.length, expectedImageDataLength,
    'Should return correct imageData length')

  t.end()
})
