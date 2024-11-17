const Utils = require('./utils')

function clearCanvas (ctx, canvas, size) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!canvas.style) canvas.style = {}
  canvas.height = size
  canvas.width = size
  canvas.style.height = size + 'px'
  canvas.style.width = size + 'px'
}

function getCanvasElement () {
  try {
    return document.createElement('canvas')
  } catch (e) {
    throw new Error('You need to specify a canvas element')
  }
}

exports.render = function render (qrData, canvas, options) {
  let opts = options
  let canvasEl = canvas

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!canvas) {
    canvasEl = getCanvasElement()
  }

  opts = Utils.getOptions(opts)
  const size = Utils.getImageWidth(qrData.modules.size, opts)

  const ctx = canvasEl.getContext('2d')
  const image = ctx.createImageData(size, size)
  Utils.qrToImageData(image.data, qrData, opts)

  clearCanvas(ctx, canvasEl, size)
  ctx.putImageData(image, 0, 0)

  return canvasEl
}

exports.renderToDataURL = function renderToDataURL (qrData, canvas, options) {
  let opts = options

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!opts) opts = {}

  const canvasEl = exports.render(qrData, canvas, opts)

  const type = opts.type || 'image/png'
  const rendererOpts = opts.rendererOpts || {}

  return canvasEl.toDataURL(type, rendererOpts.quality)
}

exports.renderToBlob = function renderToBlob (qrData, canvas, options, callback) {
  let opts = options

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!opts) opts = {}

  const canvasEl = exports.render(qrData, canvas, opts)
  const type = opts.type || 'image/png'
  const rendererOpts = opts.rendererOpts || {}

  canvasEl.toBlob((blobOrNull) => {
    if (blobOrNull === null) {
      callback(new Error('Failed to get canvas as blob'))
    } else {
      callback(null, blobOrNull)
    }
  }, type, rendererOpts.quality)
}

exports.renderToArrayBuffer = function renderToArrayBuffer (qrData, canvas, options, callback) {
  let opts = options

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!opts) opts = {}

  const canvasEl = exports.render(qrData, canvas, opts)
  const type = opts.type || 'image/png'

  canvasEl.toBlob(async (blobOrNull) => {
    if (blobOrNull === null) {
      callback(new Error('Failed to get canvas as blob'))
    } else {
      try {
        const arrayBuffer = await blobOrNull.arrayBuffer()
        callback(null, arrayBuffer)
      } catch (e) {
        callback(e)
      }
    }
  }, type, opts.rendererOpts.quality)
}
