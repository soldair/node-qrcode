import * as svgTagRenderer from './svg-tag.js'
import fs from 'fs'

export const render = svgTagRenderer.render
export function renderToFile (path, qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }
  const svgTag = render(qrData, options)
  const xmlStr = '<?xml version="1.0" encoding="utf-8"?>' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
        svgTag
  fs.writeFile(path, xmlStr, cb)
}
