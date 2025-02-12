const Utils = require('./utils')

function getColorAttrib (color, attrib) {
  const alpha = color.a / 255
  const str = attrib + '="' + color.hex + '"'

  return alpha < 1
    ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"'
    : str
}

/** Converts a number to string with leading and trailing zeros stripped @param {number} num */
function svgNum(num) {
  return num.toFixed(3).replace(/\.?0+$/, "").replace(/^0(?=\.)/, "");
}

/** @param {{ tl:number, tr:number, bl:number, br:number }} corners */
function qrToPathCorners(data, size, margin, corners) {
  let path = "";
  let run = 0, i = 0;

  // Calculate scale ratio and corner sizes
  const s = Math.min(1, 1 / Math.max(corners.tl + corners.tr, corners.bl + corners.br));
  const tl = Math.max(corners.tl, 0) * s, stl = svgNum(tl);
  const tr = Math.max(corners.tr, 0) * s, str = svgNum(tr);
  const bl = Math.max(corners.bl, 0) * s, sbl = svgNum(bl);
  const br = Math.max(corners.br, 0) * s, sbr = svgNum(br);

  for (let y = 0; y < size; ++y) {
    for (let x = 0; x < size; ++x, ++i) {
      if (!data[i]) { continue; }

      const top = (y === 0) || !data[i - size];
      const bot = (y === (size - 1)) || !data[i + size];

      if (!run++) {
        path += (bot && bl)
          ? `M${svgNum(x + margin + bl)},${y + margin + 1}a${sbl},${sbl} 0 0 1 -${sbl},-${sbl}`
          : `M${svgNum(x + margin)},${y + margin + 1}` + (bl ? `v-${sbl}` : "");

        path += (top && tl)
          ? `V${svgNum(y + margin + tl)}a${stl},${stl} 0 0 1 ${stl},-${stl}`
          : `V${svgNum(y + margin)}`;
      }

      if ((x === (size - 1)) || !data[i + 1]) {
        path += (top && tr)
          ? `H${svgNum(x + margin + 1 - tr)}a${str},${str} 0 0 1 ${str},${str}`
          : `H${svgNum(x + margin + 1)}` + (tr ? `v${str}` : "");

        path += (bot && br)
          ? `V${svgNum(y + margin + 1 - br)}a${sbr},${sbr} 0 0 1 -${sbr},${sbr}z`
          : `V${svgNum(y + margin + 1)}z`;

        run = 0;
      }
    }
  }

  return path;
}

exports.render = function render (qrData, options, cb) {
  const opts = Utils.getOptions(options)
  const size = qrData.modules.size
  const data = qrData.modules.data
  const qrcodesize = size + opts.margin * 2

  const bg = !opts.color.light.a
    ? ''
    : `<path ${getColorAttrib(opts.color.light, 'fill')} d="M0 0h${qrcodesize}v${qrcodesize}H0z"/>`

  const path = `<path ${getColorAttrib(opts.color.dark, 'fill')} d="${
    qrToPathCorners(data, size, opts.margin, {
      tl: opts.rendererOpts?.corners?.topLeft || 0,
      tr: opts.rendererOpts?.corners?.topRight || 0,
      bl: opts.rendererOpts?.corners?.bottomLeft || 0,
      br: opts.rendererOpts?.corners?.bottomRight || 0,
    })}"/>`;

  const viewBox = `viewBox="0 0 ${qrcodesize} ${qrcodesize}"`;
  const width = !opts.width ? '' : `width="${opts.width}" height="${opts.width}" `;
  const svgTag = `<svg xmlns="http://www.w3.org/2000/svg" ${width}${viewBox}>${bg}${path}</svg>\n`;

  if (typeof cb === 'function') {
    cb(null, svgTag)
  }

  return svgTag
}

exports.renderToDataURL = function renderToDataURL (qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }

  const svgTag = exports.render(qrData, options);
  const uriStr = `data:image/svg+xml;base64,${Buffer.from(svgTag).toString('base64')}`;

  cb(null, uriStr)
};

exports.renderToFile = function renderToFile (path, qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }

  const fs = require('fs')
  const svgTag = exports.render(qrData, options)

  const xmlStr = '<?xml version="1.0" encoding="utf-8"?>' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
    svgTag

  fs.writeFile(path, xmlStr, cb)
}
