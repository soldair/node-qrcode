var QRCode = require('./core/qrcode')
var PngRenderer = require('./renderer/png')
var Utf8Renderer = require('./renderer/utf8')
var TerminalRenderer = require('./renderer/terminal')
var SvgRenderer = require('./renderer/svg')

function checkParams (text, opts, cb) {
  if (typeof text === 'undefined') {
    throw new Error('String required as first argument')
  }

  if (typeof cb === 'undefined') {
    cb = opts
    opts = {}
  }

  if (typeof cb !== 'function') {
    throw new Error('Callback required as last argument')
  }

  return {
    opts: opts,
    cb: cb
  }
}

function getTypeFromFilename (path) {
  return path.slice((path.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
}

function getRendererFromType (type) {
  switch (type) {
    case 'svg':
      return SvgRenderer

    case 'txt':
    case 'utf8':
      return Utf8Renderer

    case 'png':
    case 'image/png':
    default:
      return PngRenderer
  }
}

function getStringRendererFromType (type) {
  switch (type) {
    case 'svg':
      return SvgRenderer

    case 'terminal':
      return TerminalRenderer

    case 'utf8':
    default:
      return Utf8Renderer
  }
}

function render (renderFunc, text, params) {
  try {
    var data = QRCode.create(text, params.opts)
    return params.cb(null, renderFunc(data, params.opts))
  } catch (e) {
    return params.cb(e)
  }
}

exports.create = QRCode.create

exports.toCanvas = require('./browser').toCanvas

exports.toString = function toString (text, opts, cb) {
  var params = checkParams(text, opts, cb)
  var renderer = getStringRendererFromType(params.opts.type)
  return render(renderer.render, text, params)
}

exports.toDataURL = function toDataURL (text, opts, cb) {
  var params = checkParams(text, opts, cb)
  var renderer = getRendererFromType(params.opts.type)

  return render(renderer.renderToDataURL, text, params)
}

exports.toFile = function toFile (path, text, opts, cb) {
  if (arguments.length < 3) {
    throw new Error('Too few arguments provided')
  }

  var params = checkParams(text, opts, cb)
  var type = params.opts.type || getTypeFromFilename(path)
  var renderer = getRendererFromType(type)
  var renderToFile = renderer.renderToFile.bind(null, path)

  return render(renderToFile, text, params)
}

exports.toFileStream = function toFileStream (path, text, opts, cb) {
  if (arguments.length < 3) {
    throw new Error('Too few arguments provided')
  }

  var params = checkParams(text, opts, cb)
  var type = params.opts.type || getTypeFromFilename(path)
  var renderer = getRendererFromType(type)
  var renderToFileStream = renderer.renderToFileStream.bind(null, path)

  return render(renderToFileStream, text, params)
}
