var Utils = require('./utils')

function getColorAttrib (color) {
  return 'fill="rgb(' + [color.r, color.g, color.b].join(',') + ')" ' +
    'fill-opacity="' + (color.a / 255).toFixed(2) + '"'
}

exports.render = function render (qrData, options) {
  var opts = Utils.getOptions(options)
  var size = qrData.modules.size
  var data = qrData.modules.data
  var qrcodesize = (size + opts.margin * 2) * opts.scale

  var xmlStr = '<?xml version="1.0" encoding="utf-8"?>\n'
  xmlStr += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'

  xmlStr += '<svg version="1.1" baseProfile="full"'
  xmlStr += ' width="' + qrcodesize + '" height="' + qrcodesize + '"'
  xmlStr += ' viewBox="0 0 ' + qrcodesize + ' ' + qrcodesize + '"'
  xmlStr += ' xmlns="http://www.w3.org/2000/svg"'
  xmlStr += ' xmlns:xlink="http://www.w3.org/1999/xlink"'
  xmlStr += ' xmlns:ev="http://www.w3.org/2001/xml-events">\n'

  xmlStr += '<rect x="0" y="0" width="' + qrcodesize + '" height="' + qrcodesize + '" ' + getColorAttrib(opts.color.light) + ' />\n'
  xmlStr += '<defs><rect id="p" width="' + opts.scale + '" height="' + opts.scale + '" /></defs>\n'
  xmlStr += '<g ' + getColorAttrib(opts.color.dark) + '>\n'

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if (!data[i * size + j]) continue

      var x = (opts.margin + j) * opts.scale
      var y = (opts.margin + i) * opts.scale
      xmlStr += '<use x="' + x + '" y="' + y + '" xlink:href="#p" />\n'
    }
  }

  xmlStr += '</g>\n'
  xmlStr += '</svg>'

  return xmlStr
}
