
const canPromise = require('./can-promise')

const QRCode = require('./core/qrcode')
const CanvasRenderer = require('./renderer/canvas')
const SvgRenderer = require('./renderer/svg-tag.js')

function renderFuncHasCallback (renderFunc) {
  return renderFunc === CanvasRenderer.renderToBlob || renderFunc === CanvasRenderer.renderToArrayBuffer
}

function renderCanvas (renderFunc, canvas, text, opts, cb) {
  const args = [].slice.call(arguments, 1)
  const argsNum = args.length
  const isLastArgCb = typeof args[argsNum - 1] === 'function'
  const renderFnHasCallback = renderFuncHasCallback(renderFunc)

  if (!isLastArgCb && !canPromise()) {
    throw new Error('Callback required as last argument')
  }

  if (isLastArgCb) {
    if (argsNum < 2) {
      throw new Error('Too few arguments provided')
    }

    if (argsNum === 2) {
      cb = text
      text = canvas
      canvas = opts = undefined
    } else if (argsNum === 3) {
      if (canvas.getContext && typeof cb === 'undefined') {
        cb = opts
        opts = undefined
      } else {
        cb = opts
        opts = text
        text = canvas
        canvas = undefined
      }
    }
  } else {
    if (argsNum < 1) {
      throw new Error('Too few arguments provided')
    }

    if (argsNum === 1) {
      text = canvas
      canvas = opts = undefined
    } else if (argsNum === 2 && !canvas.getContext) {
      opts = text
      text = canvas
      canvas = undefined
    }

    return new Promise(function (resolve, reject) {
      try {
        const data = QRCode.create(text, opts)
        if (renderFnHasCallback) {
          renderFunc(data, canvas, opts, (err, result) => {
            if (err) reject(err)
            else resolve(result)
          })
        } else {
          resolve(renderFunc(data, canvas, opts))
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  try {
    const data = QRCode.create(text, opts)
    if (renderFnHasCallback) {
      renderFunc(data, canvas, opts, cb)
    } else {
      cb(null, renderFunc(data, canvas, opts))
    }
  } catch (e) {
    cb(e)
  }
}

exports.create = QRCode.create
exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render)
exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL)
exports.toBlob = renderCanvas.bind(null, CanvasRenderer.renderToBlob)
exports.toArrayBuffer = renderCanvas.bind(null, CanvasRenderer.renderToArrayBuffer)

// only svg for now.
exports.toString = renderCanvas.bind(null, function (data, _, opts) {
  return SvgRenderer.render(data, opts)
})
