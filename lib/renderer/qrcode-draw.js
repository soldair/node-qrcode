/*
* copyright 2010-2012 Ryan Day
* http://github.com/soldair/node-qrcode
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*
* canvas example and fallback support example provided by Joshua Koo
* http://jabtunes.com/labs/qrcode.html
* "Instant QRCode Mashup by Joshua Koo!"
* as far as i can tell the page and the code on the page are public domain
*
* original table example and library provided by Kazuhiko Arase
* http://d-project.googlecode.com/svn/trunk/misc/qrcode/js/
*
*/

var QRCodeLib = require('../core/qrcode')
var ErrorCorrectionLevel = require('../core/error-correction-level')

exports.QRCodeDraw = QRCodeDraw
exports.QRErrorCorrectLevel = ErrorCorrectionLevel
exports.QRCode = QRCodeLib

function QRCodeDraw () {}

QRCodeDraw.prototype = {
  scale: 4, // 4 px module size
  defaultMargin: 20,
  marginScaleFactor: 5,
  color: {
    dark: 'black',
    light: 'white'
  },
  QRErrorCorrectLevel: ErrorCorrectionLevel,

  draw: function (canvas, text, options, cb) {
    var error

    var args = Array.prototype.slice.call(arguments)
    cb = args.pop()
    canvas = args.shift()
    text = args.shift()
    options = args.shift() || {}

    if (typeof cb !== 'function') {
      // enforce callback api just in case the processing can be made async in the future
      // or support proc open to libqrencode
      throw new Error('callback required')
    }

    if (typeof options !== 'object') {
      options.errorCorrectionLevel = options
    }

    this.scale = options.scale || this.scale
    this.margin = typeof (options.margin) === 'undefined' ? this.defaultMargin : options.margin

    // create qrcode!
    try {
      var qr = new QRCodeLib(text, options)
      var scale = this.scale || 4
      var ctx = canvas.getContext('2d')
      var width = 0

      var margin = this.marginWidth()
      var currenty = margin
      width = this.dataWidth(qr) + margin * 2

      this.resetCanvas(canvas, ctx, width)

      for (var r = 0, rl = qr.getModuleCount(); r < rl; r++) {
        var currentx = margin
        for (var c = 0, cl = qr.getModuleCount(); c < cl; c++) {
          if (qr.isDark(r, c)) {
            ctx.fillStyle = this.color.dark
            ctx.fillRect(currentx, currenty, scale, scale)
          } else if (this.color.light) {
            // if falsy configured color
            ctx.fillStyle = this.color.light
            ctx.fillRect(currentx, currenty, scale, scale)
          }
          currentx += scale
        }
        currenty += scale
      }
    } catch (e) {
      error = e
    }

    cb(error, canvas, width)
  },

  drawBitArray: function (/* text, errorCorrectLevel,options,cb */) {
    var args = Array.prototype.slice.call(arguments)
    var cb = args.pop()
    var text = args.shift()
    var options = args.shift() || {}
    var error

    // argument processing
    if (typeof cb !== 'function') {
      // enforce callback api just in case the processing can be made async in the future
      // or support proc open to libqrencode
      throw new Error('callback required as last argument')
    }

    // create qrcode!
    try {
      var qr = new QRCodeLib(text, options)
      var width = 0
      var bits
      var bitc = 0

      width = this.dataWidth(qr, 1)
      bits = new Array(width * width)

      for (var r = 0, rl = qr.getModuleCount(); r < rl; r++) {
        for (var c = 0, cl = qr.getModuleCount(); c < cl; c++) {
          if (qr.isDark(r, c)) {
            bits[bitc] = 1
          } else {
            bits[bitc] = 0
          }
          bitc++
        }
      }
    } catch (e) {
      error = e
      console.log(e.stack)
    }

    cb(error, bits, width)
  },

  marginWidth: function () {
    var margin = this.margin
    this.scale = this.scale || 4
    // elegant white space next to code is required by spec
    if ((this.scale * this.marginScaleFactor > margin) && margin > 0) {
      margin = this.scale * this.marginScaleFactor
    }
    return margin
  },

  dataWidth: function (qr, scale) {
    return qr.getModuleCount() * (scale || this.scale || 4)
  },

  resetCanvas: function (canvas, ctx, width) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!canvas.style) canvas.style = {}
    canvas.style.height = canvas.height = width// square!
    canvas.style.width = canvas.width = width

    if (this.color.light) {
      ctx.fillStyle = this.color.light
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      // support transparent backgrounds?
      // not exactly to spec but i really would like someone to be able to add a background with heavily reduced luminosity for simple branding
      // i could just ditch this because you could also just set #******00 as the color =P
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
}
