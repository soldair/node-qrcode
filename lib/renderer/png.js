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
    get: function () {
      return this._fillStyle
    },
    set: function (value) {
      this._fillStyle = value
    }
  })
}

Context.prototype.clearRect = function (x, y, width, height) {
  width = width | this.canvas.width
  height = height | this.canvas.height
  this.drawRect(x, y, width, height, [0, 0, 0, 0])
}

Context.prototype.drawRect = function (x, y, width, height, color) {
  for (var n = x; n < (x + width); n += 1) {
    for (var m = y; m < (y + height); m += 1) {
      this.canvas.setPixel(n, m, color)
    }
  }
}

Context.prototype.fillRect = function (x, y, width, height) {
  this.drawRect(x, y, width, height, styleToColor(this._fillStyle))
}

var Canvas = function (width, height) {
  this._width = width | 200
  this._height = height | 200
  this.resize()

  Object.defineProperty(this, 'width', {
    get: function () {
      return this._width
    },
    set: function (value) {
      this._width = value
      this.resize()
    }
  })

  Object.defineProperty(this, 'height', {
    get: function () {
      return this._height
    },
    set: function (value) {
      this._height = value
      this.resize()
    }
  })
}

Canvas.prototype.setPixel = function (x, y, color) {
  var index = (y * this._width + x) * channel
  for (var i = 0; i < channel; i += 1) {
    this.data[index + i] = color[i]
  }
}

Canvas.prototype.getPixel = function (x, y) {
  var index = (y * this._width + x) * channel
  return this.data.slice(index, index + channel)
}

Canvas.prototype.resize = function () {
  this.data = new Uint8Array(this.width * this.height * channel)
}

Canvas.prototype.toBuffer = function (callback) {
  var png = new PNG()
  png.data = this.data
  png.width = this.width
  png.height = this.height
  var buffer = PNG.sync.write(png)
  callback(null, buffer)
}

Canvas.prototype.toDataURL = function (callback) {
  this.toBuffer(function (err, buffer) {
    if (err) {
      callback(err)
    }
    callback(null, 'data:image/png;base64,' + buffer.toString('base64'))
  })
}

Canvas.prototype.getContext = function (mode) {
  return new Context(this)
}

module.exports = Canvas
