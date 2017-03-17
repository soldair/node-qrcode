var Utf8Renderer = require('./utf8')
require('colors')

exports.render = function render (qrData, options) {
  var inverse = options && options.inverse
  var out = Utf8Renderer.render(qrData, options)

  // defaults tp inverse. this makes sense for people with dark terminals.
  return inverse ? out : out.inverse
}
