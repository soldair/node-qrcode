const PNG = require('pngjs').PNG
const channel = 4

function styleToColor (style) {
  switch (style) {
    case 'white': return [0xff, 0xff, 0xff, 0xff]
    case 'black': return [0, 0, 0, 0xff]
  }
  return [0, 0, 0, 0]
}

class Context {
  constructor (canvas) {
    this.canvas = canvas
    this._fillStyle = 'white'
  }

  clearRect (x, y, w, h) {
    w = w | this.canvas.width
    h = h | this.canvas.height
    this.drawRect(x, y, w, h, [0, 0, 0, 0])
  }

  drawRect (x, y, w, h, color) {
    for (let n = x; n < x + w; n++) {
      for (let m = y; m < y + h; m++) {
        this.canvas.setPixel(n, m, color)
      }
    }
  }

  fillRect (x, y, w, h) {
    this.drawRect(x, y, w, h, styleToColor(this._fillStyle))
  }

  set fillStyle (val) {
    this._fillStyle = val
  }
}

module.exports = class BufferCanvas {
  constructor (width, height) {
    this._width = width | 200
    this._height = height | 200
    this.resize()
  }

  get width () {
    return this._width
  }

  set width (val) {
    this._width = val
    this.resize()
  }

  get height () {
    return this._height
  }

  set height (val) {
    this._height = val
    this.resize()
  }

  // color = [r, g, b, a] // 0 to 0xFF
  setPixel (x, y, color) {
    const index = (y * this._width + x) * channel
    for (let i = 0; i < channel; i++) {
      this.data[index + i] = color[i]
    }
  }

  // returns [r, g, b, a]
  getPixel (x, y) {
    const index = (y * this._width + x) * channel
    return this.data.slice(index, index + channel)
  }

  resize () {
    this.data = new Uint8Array(this.width * this.height * channel)
  }

  toBuffer (callback) {
    const png = new PNG()
    png.data = this.data
    png.width = this.width
    png.height = this.height
    const buf = PNG.sync.write(png)
    callback(null, buf)
  }

  toDataURL (callback) {
    this.toBuffer(function (_, buf) {
      callback(null, 'data:image/png;base64,' + buf.toString('base64'))
    })
  }

  getContext (mode) {
    return new Context(this)
  }
}
