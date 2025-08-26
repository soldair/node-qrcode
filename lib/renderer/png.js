import fs from 'fs'
import pngjs from 'pngjs'
import * as Utils from './utils.js'
const PNG = pngjs.PNG
export function render (qrData, options) {
  const opts = Utils.getOptions(options)
  const pngOpts = opts.rendererOpts
  const size = Utils.getImageWidth(qrData.modules.size, opts)
  pngOpts.width = size
  pngOpts.height = size
  const pngImage = new PNG(pngOpts)
  Utils.qrToImageData(pngImage.data, qrData, opts)
  return pngImage
}
export function renderToDataURL (qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }
  renderToBuffer(qrData, options, function (err, output) {
    if (err) { cb(err) }
    let url = 'data:image/png;base64,'
    url += output.toString('base64')
    cb(null, url)
  })
}
export function renderToBuffer (qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }
  const png = render(qrData, options)
  const buffer = []
  png.on('error', cb)
  png.on('data', function (data) {
    buffer.push(data)
  })
  png.on('end', function () {
    cb(null, Buffer.concat(buffer))
  })
  png.pack()
}
export function renderToFile (path, qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }
  let called = false
  const done = (...args) => {
    if (called) { return }
    called = true
    cb.apply(null, args)
  }
  const stream = fs.createWriteStream(path)
  stream.on('error', done)
  stream.on('close', done)
  renderToFileStream(stream, qrData, options)
}
export function renderToFileStream (stream, qrData, options) {
  const png = render(qrData, options)
  png.pack().pipe(stream)
}
