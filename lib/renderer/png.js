var fs = require('fs')
var PNG = require('pngjs').PNG
var Utils = require('./utils')

exports.render = function render (qrData, options) {
  if (!options) options = {}

  var opts = Utils.getOptions(options)
  var size = (qrData.modules.size + opts.margin * 2) * opts.scale

  var pngImage = new PNG({ width: size, height: size })
  Utils.qrToImageData(pngImage.data, qrData, opts.margin, opts.scale, opts.color)

  return pngImage
}

exports.renderToDataURL = function renderToDataURL (qrData, options) {
  var png = exports.render(qrData, options)
  var buffer = PNG.sync.write(png)

  return 'data:image/png;base64,' + buffer.toString('base64')
}

exports.renderToFile = function renderToFile (path, qrData, options) {
  var png = exports.render(qrData, options)
  var buffer = PNG.sync.write(png)
  fs.writeFileSync(path, buffer)
}

exports.renderToFileStream = function renderToFileStream (path, qrData, options) {
  var png = exports.render(qrData, options)
  var stream = fs.createWriteStream(path)

  png.pack().pipe(stream)

  return stream
}
