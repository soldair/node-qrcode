var stringOnly = require('./svg-render')

exports.render = stringOnly.render

exports.renderToFile = function renderToFile (path, qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }

  var fs = require('fs')
  var svg = exports.render(qrData, options)
  fs.writeFile(path, svg, cb)
}
