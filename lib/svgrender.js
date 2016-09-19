module.exports.renderBits = renderBits;

function renderBits(bits,width,options) {
  if (typeof bits === 'undefined' || !(bits instanceof Array)) {
    throw new Error('"bits" must be a valid Array');
  }

  if (typeof bits === 'undefined' || isNaN(width)) {
    throw new Error('"width" must be a valid number');
  }

  var dotsize = options.scale || 4;
  var margin = options.margin || 20;
  var qrcodesize = width * dotsize + margin * 2;
  var lightColor = options.lightColor || '#ffffff';
  var darkColor = options.darkColor || '#000000';

  var xmlStr = '<?xml version="1.0" encoding="utf-8"?>\n';
  xmlStr += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n';

  xmlStr += '<svg version="1.1" baseProfile="full"';
  xmlStr += ' width="' + qrcodesize + '" height="' + qrcodesize + '"';
  xmlStr += ' viewBox="0 0 '+ qrcodesize + ' ' + qrcodesize + '"';
  xmlStr += ' xmlns="http://www.w3.org/2000/svg"';
  xmlStr += ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  xmlStr += ' xmlns:ev="http://www.w3.org/2001/xml-events">\n';
  
  xmlStr += '<rect x="0" y="0" width="' + qrcodesize + '" height="' + qrcodesize + '" fill="' + lightColor + '" />\n';
  xmlStr += '<defs><rect id="p" width="'+ dotsize +'" height="'+ dotsize + '" /></defs>\n';
  xmlStr += '<g fill="' + darkColor + '">\n';

  xmlStr = bits.reduce(function (xml, bit, index) {
    if (!bit) return xml;

    var x = margin + (index % width) * dotsize;
    var y = margin + Math.floor(index / width) * dotsize;
    return xml += '<use x="' + x + '" y="' + y + '" xlink:href="#p" />\n'
  }, xmlStr);

  xmlStr += '</g>\n';
  xmlStr += '</svg>';

  return xmlStr
}
