var PNG = require('pngjs').PNG
var channel = 4

function styleToColor (style) {
  switch (style) {
    case 'white': return [0xff, 0xff, 0xff, 0xff]
    case 'black': return [0, 0, 0, 0xff]
  }
  return [0, 0, 0, 0]
}

var Context = function (canvas) {
  this.canvas = canvas
  this._fillStyle = 'white'

  Object.defineProperty(this, 'fillStyle', {
    get: function () { return this._fillStyle },
    set: function (val) { this._fillStyle = val }
  })
}

Context.prototype.clearRect = function (x, y, w, h) {
  w = w | this.canvas.width
  h = h | this.canvas.height
  this.drawRect(x, y, w, h, [0, 0, 0, 0])
}

Context.prototype.drawRect = function (x, y, w, h, color) {
  for (var n = x; n < x + w; n++) {
    for (var m = y; m < y + h; m++) {
      this.canvas.setPixel(n, m, color)
    }
  }
}

Context.prototype.fillRect = function (x, y, w, h) {
  this.drawRect(x, y, w, h, styleToColor(this._fillStyle))
}

var BufferCanvas = function (width, height) {
  this._width = width | 200
  this._height = height | 200
  this.resize()

  Object.defineProperty(this, 'width', {
    get: function () { return this._width },
    set: function (val) {
      this._width = val
      this.resize()
    }
  })

  Object.defineProperty(this, 'height', {
    get: function () { return this._height },
    set: function (val) {
      this._height = val
      this.resize()
    }
  })
}

// color = [r, g, b, a] // 0 to 0xFF
BufferCanvas.prototype.setPixel = function (x, y, color) {
  var index = (y * this._width + x) * channel
  for (var i = 0; i < channel; i++) {
    this.data[index + i] = color[i]
  }
}

// returns [r, g, b, a]
BufferCanvas.prototype.getPixel = function (x, y) {
  var index = (y * this._width + x) * channel
  return this.data.slice(index, index + channel)
}

BufferCanvas.prototype.resize = function () {
  this.data = new Uint8Array(this.width * this.height * channel)
}

BufferCanvas.prototype.toBuffer = function (callback) {
  var png = new PNG()
  png.data = this.data
  png.width = this.width
  png.height = this.height
  var buf = PNG.sync.write(png)
  callback(null, buf)
}

BufferCanvas.prototype.toDataURL = function (callback) {
  this.toBuffer(function (_, buf) {
    callback(null, 'data:image/png;base64,' + buf.toString('base64'))
  })
}

BufferCanvas.prototype.getContext = function (mode) {
  return new Context(this)
}

module.exports = BufferCanvas
