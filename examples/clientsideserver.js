const express = require('express')
const app = express()// .createServer()
const http = require('http')
const fs = require('fs')
const QRCode = require('../lib')
const canvasutil = require('canvasutil')
const { createCanvas, loadImage } = require('canvas')

const path = require('path')

// app.use(express.methodOverride())
// app.use(express.bodyParser())
// app.use(app.router)
// app.use(express.static(path.resolve(__dirname, '..')))

app.get('/qrcode.js', (req, res) => {
  res.set('content-type', 'text/javascript')
  fs.createReadStream(path.join(__dirname, '..', 'build', 'qrcode.js')).pipe(res)
})

app.get('/qrcode.tosjis.js', (req, res) => {
  res.set('content-type', 'text/javascript')
  fs.createReadStream(path.join(__dirname, '..', 'build', 'qrcode.tosjis.js')).pipe(res)
})

app.get('/', function (req, res) {
  fs.readFile(path.join(__dirname, 'clientside.html'), function (err, data) {
    res.send(data ? data.toString() : err)
  })
})

const effectHandlers = {}

app.get('/generate', function (req, res) {
  const q = req.query || {}

  let effect = q.effect || 'plain'
  if (!effectHandlers[effect]) {
    effect = 'plain'
  }

  effectHandlers[effect](q, function (error, canvas) {
    if (!error) {
      canvas.toBuffer(function (err, buf) {
        if (!err) {
          res.header('Content-Type', 'image/png')
          res.send(buf)
        }
      })
    } else {
      const msg = error.message + '\n' + error.stack
      res.header('Content-Type', 'text/plain')
      res.send(msg)
      console.error(msg)
    }
  })
})

effectHandlers.node = function (args, cb) {
  args.src = path.join(__dirname, 'images', 'node_logo.png')
  this.image(path.join(args, cb))
}

effectHandlers.npm = function (args, cb) {
  args.src = path.join(__dirname, 'images', 'npm_logo.png')
  this.image(args, cb)
}

effectHandlers.bacon = function (args, cb) {
  args.src = path.join(__dirname, 'images', 'bacon-love.png')
  this.image(args, cb)
}

effectHandlers.rounded = function (args, cb) {
  const canvas = createCanvas(200, 200)
  QRCode.toCanvas(canvas, args.text || '', function (err) {
    if (err) {
      cb(err, canvas)
      return
    }

    const tpx = new canvasutil.PixelCore()
    const luma709Only = canvasutil.conversionLib.luma709Only
    const up = []
    const down = []
    const left = []
    const right = []
    let upPx
    let downPx
    let leftPx
    let rightPx
    let r
    let t
    let l
    let d
    let corner = 0

    tpx.threshold = 100

    tpx.iterate(canvas, function (px, i, len, pixels, w, h, pixelCore) {
      corner = 0

      // is dark
      if (luma709Only(px.r, px.g, px.b) < pixelCore.threshold) {
        if (i - w > 0) {
          upPx = (i - w) * 4
          up[0] = pixels[upPx + 0]
          up[1] = pixels[upPx + 1]
          up[2] = pixels[upPx + 2]
          // console.log('up',up);
        }

        if (i + w <= len) {
          downPx = (i + w) * 4
          down[0] = pixels[downPx + 0]
          down[1] = pixels[downPx + 1]
          down[2] = pixels[downPx + 2]
          // console.log('down',down);
        }

        // have left pixel but no wrapping
        if (i % w !== 0) {
          leftPx = (i - 1) * 4
          left[0] = pixels[leftPx + 0]
          left[1] = pixels[leftPx + 1]
          left[2] = pixels[leftPx + 2]
          // console.log('left',left);
        }

        if (i % w !== w - 1) {
          rightPx = (i + 1) * 4
          right[0] = pixels[rightPx + 0]
          right[1] = pixels[rightPx + 1]
          right[2] = pixels[rightPx + 2]
          // console.log('right',right);
        }

        r = rightPx ? luma709Only(right[0], right[1], right[2]) : 0
        t = upPx ? luma709Only(up[0], up[1], up[2]) : 0
        l = leftPx ? luma709Only(left[0], left[1], left[2]) : 0
        d = downPx ? luma709Only(down[0], down[1], down[2]) : 0

        if (l > pixelCore.threshold) { // if left is light and i am dark
          if (t > pixelCore.threshold) { // if top is light and i am dark
            corner = 1
            pixels[rightPx + 4] = 100
          } else if (d > pixelCore.threshold) { // if bottom is light and i am dark
            pixels[rightPx + 4] = 100
            corner = 1
          }
        } else if (r > pixelCore.threshold) {
          if (t > pixelCore.threshold) { // if top is light and i am dark
            corner = 1
          } else if (d > pixelCore.threshold) { // if bottom is light and i am dark
            corner = 1
          }
        }

        if (corner) {
          px.a = 50
        }
      }
    })
    cb(null, canvas)
  })
}

effectHandlers.remoteImage = function (args, cb) {
  let src = args.src
  let domain
  let uri

  if (!src) {
    cb(new Error('src required'), null)
  } else {
    if (src.indexof('://') !== -1) {
      src = src.split('://').unshift()
      const parts = src.split('/')

      domain = parts.shift()
      uri = parts.join('/')
    }
  }

  if (!domain || !uri) {
    cb(new Error('missing domain or uri ' + args.src))
    return
  }

  const options = {
    host: domain,
    port: 80,
    path: uri,
    method: 'GET'
  }

  const req = http.request(options, function (res) {
    if (res.statusCode < 200 || res.statusCode > 299) {
      cb(new Error('http ' + res.statusCode + ' response code'), null)
      return
    }

    res.setEncoding('utf8')

    let data = ''
    res.on('data', function (chunk) {
      data += chunk
      console.log('BODY: ' + chunk)
    })

    res.on('complete', function () {
      cb(null, data)
    })

    res.on('error', function (error) {
      cb(error, null)
      cb = function () {}
    })
  })

  req.end()
}

effectHandlers.image = function (args, cb) {
  loadImage(args.src || '').then((img) => {
    const convert = canvasutil.conversionLib
    const canvas = createCanvas(200, 200)
    QRCode.toCanvas(canvas, args.text || '', function (err) {
      if (err) {
        cb(err, false)
        return
      }

      const codeCtx = canvas.getContext('2d')
      const frame = codeCtx.getImageData(0, 0, canvas.width, canvas.width)
      const tpx = new canvasutil.PixelCore()
      const baconCanvas = createCanvas(canvas.width, canvas.width)
      const ctx = baconCanvas.getContext('2d')
      const topThreshold = args.darkThreshold || 25
      const bottomThreshold = args.lightThreshold || 75

      tpx.threshold = 50

      // scale image
      let w = canvas.width
      let h = canvas.height

      if (img.width > img.height) {
        w = w * (canvas.height / h)
        h = canvas.height
      } else {
        h = h * (canvas.height / w)
        w = canvas.width
      }
      ctx.drawImage(img, 0, 0, w, h)

      try {
        tpx.iterate(baconCanvas, function (px, i, l, pixels, w, h, pixelCore) {
          const luma = (0.2125 * px.r + 0.7154 * px.g + 0.0721 * px.b)
          const codeLuma = convert.luma709Only(frame.data[i * 4], frame.data[i * 4 + 1], frame.data[i * 4 + 2])
          let yuv
          let rgb

          if (codeLuma > pixelCore.threshold) {
            if (luma < bottomThreshold) {
              yuv = convert.rgbToYuv(px.r, px.g, px.b)

              rgb = convert.yuvToRgb(bottomThreshold, yuv[1], yuv[2])

              px.r = rgb[0]
              px.g = rgb[1]
              px.b = rgb[2]
              px.a = 255
            }
          } else {
            if (luma > topThreshold) {
              yuv = convert.rgbToYuv(px.r, px.g, px.b)

              rgb = convert.yuvToRgb(topThreshold, yuv[1], yuv[2])

              px.r = rgb[0]
              px.g = rgb[1]
              px.b = rgb[2]
            }
          }
        })
      } catch (e) {
        cb(err, false)
      }

      cb(null, baconCanvas)
    })
  }, (error) => {
    cb(error, null)
  })
}

effectHandlers.plain = function (args, cb) {
  const canvas = createCanvas(200, 200)
  const text = args.text || ''
  QRCode.toCanvas(canvas, text || '', function (err) {
    cb(err, canvas)
  })
}

app.listen(3031)
console.log('listening on 3031')
