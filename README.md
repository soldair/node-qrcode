[![Travis](https://img.shields.io/travis/soldair/node-qrcode.svg?style=flat-square)](http://travis-ci.org/soldair/node-qrcode)
[![npm](https://img.shields.io/npm/v/qrcode.svg?style=flat-square)](https://www.npmjs.com/package/qrcode)
[![npm](https://img.shields.io/npm/dt/qrcode.svg?style=flat-square)](https://www.npmjs.com/package/qrcode)
[![npm](https://img.shields.io/npm/l/qrcode.svg?style=flat-square)](https://github.com/soldair/node-qrcode/blob/master/license)


# node-qrcode
> QR code/2d barcode generator.

It is an extension of "QRCode for JavaScript" which Kazuhiko Arase thankfully MIT licensed.

## Installation
Inside your project folder do:
```shell
npm install --save qrcode
```

or, install it globally to use `qrcode` from the command line to save qrcode images or generate ones you can view in your terminal.
```shell
npm install -g qrcode
```

## Dependencies

`node-canvas` is required.  
(note: this dependency is only needed for server side use and will be likely removed in the future)

### Install node-canvas dependencies
`node-canvas` is a native module and requires dev packages of `Cairo` and `Pango` to compile.  
Make sure to have these libs available on your system before run `npm install qrcode`

Installation instructions are available on [node-canvas](https://github.com/Automattic/node-canvas#installation) page.

## Usage

```shell
qrcode <text> [output file]
```
Output image format is detected from file extension.  
Only `png` and `svg` format are supported for now.

If no output file is specified, the QR Code will be rendered directly in the terminal.

#### Example

```shell
qrcode "Draw a QR Code in my terminal"
```
```shell
qrcode "I like to save qrs as a PNG" qr.png
```
```shell
qrcode "I also like to save them as a SVG" qr.svg
```

## Client side
`node-qrcode` can be used in browser through [Browserify](https://github.com/substack/node-browserify), [Webpack](https://github.com/webpack/webpack) or by including the precompiled
bundle present in `dist/` folder.

#### Browserify or Webpack

```html
<!-- index.html -->
<html>
  <body>
    <canvas id="canvas"></canvas>
    <script src="bundle.js"></script>
  </body>
</html>
```

```javascript
// index.js -> bundle.js
var QRCode = require('qrcode')
var QRCodeDraw = new QRCode.QRCodeDraw()
var canvas = document.getElementById('canvas')

QRCodeDraw.draw(canvas, 'sample text', function (error, canvas) {
  if (error) console.error(error)
  console.log('success!');
})
```

#### Precompiled bundle

```html
<canvas id="canvas"></canvas>

<script src="/build/qrcode.min.js"></script>
<script>
  var qrcodedraw = new qrcodelib.qrcodedraw()

  qrcodedraw.draw(document.getElementById('canvas'), 'sample text', function (error, canvas) {
    if (error) console.error(error)
    console.log('success!');
  })
</script>
```

Precompiled files are generated in `dist/` folder during installation.  
To manually rebuild the lib run:
```shell
npm run build
```

### Methods
```javascript
draw(canvasElement, text, [optional options], cb(error, canvas));
```

##### Options

```javascript
errorCorrectLevel
```
Can be one of the values in `QRCode.errorCorrectLevel`.  
If `undefined`, defaults to H which is max error correction.

## Server side API
```javascript
QRCode.draw(text, [optional options], cb(error, canvas));
```
Returns a node canvas object see https://github.com/Automattic/node-canvas for all of the cool node things you can do. Look up the canvas api for the other cool things.

```javascript
QRCode.toDataURL(text, [optional options], cb(error, dataURL));
```
Returns mime image/png data url for the 2d barcode.

```javascript
QRCode.drawSvg(text, [optional options], cb(error, svgString));
```
SVG output!

```javascript
QRCode.save(path, text, [optional options], cb(error, written));
```
Saves png to the path specified returns bytes written.

```javascript
QRCode.drawText(text, [optional options], cb)
```
Returns an ascii representation of the qrcode using unicode characters and ansi control codes for background control.

```javascript
QRCode.drawBitArray(text, [optional options], cb(error, bits, width));
```
Returns an array with each value being either 0 light or 1 dark and the width of each row.
This is enough info to render a qrcode any way you want. =)

##### Options

```javascript
errorCorrectLevel
```
Can be one of the values in `qrcode.errorCorrectLevel`.  
Can be a string, one of `"minimum", "medium", "high", "max"`.  
If `undefined`, defaults to H which is max error correction.

#### Example
```javascript
var QRCode = require('qrcode')

QRCode.toDataURL('I am a pony!', function (err, url) {
  console.log(url)
})
```

## GS1 QR Codes

There was a real good discussion here about them. but in short any qrcode generator will make gs1 compatable qrcodes, but what defines a gs1 qrcode is a header with metadata that describes your gs1 information.

https://github.com/soldair/node-qrcode/issues/45

## License

[MIT](https://github.com/soldair/node-qrcode/blob/master/license)

The word "QR Code" is registered trademark of:  
DENSO WAVE INCORPORATED
