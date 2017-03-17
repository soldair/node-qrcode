var test = require('tap').test
var Utils = require('renderer/utils')

test('Utils getOptions', function (t) {
  var defaultOptions = {
    scale: 4,
    margin: 4,
    color: {
      dark: { r: 0, g: 0, b: 0, a: 255 },
      light: { r: 255, g: 255, b: 255, a: 255 }
    },
    type: undefined
  }

  t.ok(Utils.getOptions,
    'getOptions should be defined')

  t.deepEqual(Utils.getOptions(), defaultOptions,
    'Should return default options if called without param')

  t.equal(Utils.getOptions({ scale: 8 }).scale, 8,
    'Should return correct scale value')

  t.equal(Utils.getOptions({ margin: 1 }).margin, 4,
    'Should return default margin if specified value is < 4')

  t.equal(Utils.getOptions({ margin: 20 }).margin, 20,
    'Should return correct margin value')

  t.deepEqual(Utils.getOptions({ color: { dark: '#fff', light: '#000000' } }).color,
    {
      dark: { r: 255, g: 255, b: 255, a: 255 },
      light: { r: 0, g: 0, b: 0, a: 255 }
    },
    'Should return correct colors value')

  t.throw(function () { Utils.getOptions({ color: { dark: 1234 } }) },
    'Should throw if color is not a string')

  t.throw(function () { Utils.getOptions({ color: { dark: '#aa' } }) },
    'Should throw if color is not in a valid hex format')

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

  var color = {
    dark: { r: 255, g: 255, b: 255, a: 255 },
    light: { r: 0, g: 0, b: 0, a: 255 }
  }

  var imageData = []

  var expectedImageSize = (sampleQrData.modules.size + margin * 2) * scale
  var expectedImageDataLength = Math.pow(expectedImageSize, 2) * 4

  Utils.qrToImageData(imageData, sampleQrData, margin, scale, color)

  t.equal(imageData.length, expectedImageDataLength,
    'Should return correct imageData length')

  t.end()
})
