# node-qrcode
> QR code/2d barcode generator.

[![Travis](https://img.shields.io/travis/soldair/node-qrcode.svg?style=flat-square)](http://travis-ci.org/soldair/node-qrcode)
[![npm](https://img.shields.io/npm/v/qrcode.svg?style=flat-square)](https://www.npmjs.com/package/qrcode)
[![npm](https://img.shields.io/npm/dt/qrcode.svg?style=flat-square)](https://www.npmjs.com/package/qrcode)
[![npm](https://img.shields.io/npm/l/qrcode.svg?style=flat-square)](https://github.com/soldair/node-qrcode/blob/master/license)

- [Highlights](#highlights)
- [Installation](#installation)
- [Usage](#usage)
- [Error correction level](#error-correction-level)
- [QR Code capacity](#qr-code-capacity)
- [Encoding Modes](#encoding-modes)
- [Multibyte characters](#multibyte-characters)
- [API](#api)
- [GS1 QR Codes](#gs1)
- [Credits](#credits)
- [License](#license)

## Highlights
- Works on server and client
- CLI utility
- Save QR code as image
- Support for Numeric, Alphanumeric, Kanji and Byte mode
- Support for mixed modes
- Support for chinese, cyrillic, greek and japanese characters
- Support for multibyte characters (like emojis :smile:)
- Auto generates optimized segments for best data compression and smallest QR Code size

## Installation
Inside your project folder do:

```shell
npm install --save qrcode
```

or, install it globally to use `qrcode` from the command line to save qrcode images or generate ones you can view in your terminal.

```shell
npm install -g qrcode
```

### Dependencies
`node-canvas` is required.<br>
(note: this dependency is only needed for server side use and will be likely removed in the future)

#### Install node-canvas dependencies
`node-canvas` is a native module and requires dev packages of `Cairo` and `Pango` to compile.<br>
Make sure to have these libs available on your system before run `npm install qrcode`

Installation instructions are available on [node-canvas](https://github.com/Automattic/node-canvas#installation) page.

## Usage
### CLI

```shell
qrcode <text> [output file]
```
Output image format is detected from file extension.<br>
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

### Browser
`node-qrcode` can be used in browser through module bundlers like [Browserify](https://github.com/substack/node-browserify) and [Webpack](https://github.com/webpack/webpack) or by including the precompiled bundle present in `build/` folder.

#### Module bundlers
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

Precompiled files are generated in `build/` folder during installation.<br>
To manually rebuild the lib run:

```shell
npm run build
```

### NodeJS
Simply require the module `qrcode`

```javascript
var QRCode = require('qrcode')

QRCode.toDataURL('I am a pony!', function (err, url) {
  console.log(url)
})
```

## Error correction level
Error correction capability allows to successfully scan a QR Code even if the symbol is dirty or damaged.
Four levels are available to choose according to the operating environment.

Higher levels offer a better error resistance but reduce the symbol's capacity.<br>
If the chances that the QR Code symbol may be corrupted are low (for example if it is showed through a monitor)
is possible to safely use a low error level such as `Low` or `Medium`.

Possible levels are shown below:

| Level            | Error resistance |
|------------------|:----------------:|
| **L** (Low)      | **~7%**          |
| **M** (Medium)   | **~15%**         |
| **Q** (Quartile) | **~25%**         |
| **H** (High)     | **~30%**         |

The percentage indicates the maximum amount of damaged surface after which the symbol becomes unreadable.

Error level can be set through `options.errorCorrectionLevel` property.<br>
If not specified, the default value is `M`.

```javascript
QRCode.toDataURL('some text', { errorCorrectionLevel: 'H' }, function (err, url) {
  console.log(url)
})
```

## QR Code capacity
Capacity depends on symbol version and error correction level. Also encoding modes may influence the amount of storable data.

The QR Code versions range from version **1** to version **40**.<br>
Each version has a different number of modules (black and white dots), which define the symbol's size.
For version 1 they are `21x21`, for version 2 `25x25` e so on.
Higher is the version, more are the storable data, and of course bigger will be the QR Code symbol.

The table below shows the maximum number of storable characters in each encoding mode and for each error correction level.

| Mode         | L    | M    | Q    | H    |
|--------------|------|------|------|------|
| Numeric      | 7089 | 5596 | 3993 | 3057 |
| Alphanumeric | 4296 | 3391 | 2420 | 1852 |
| Byte         | 2953 | 2331 | 1663 | 1273 |
| Kanji        | 1817 | 1435 | 1024 | 784  |

**Note:** Maximum characters number can be different when using [Mixed modes](#mixed-modes).

QR Code version can be set through `options.version` property.<br>
If no version is specified, the more suitable value will be used. Unless a specific version is required, this option is not needed.

```javascript
QRCode.toDataURL('some text', { version: 2 }, function (err, url) {
  console.log(url)
})
```

## Encoding modes
Modes can be used to encode a string in a more efficient way.<br>
A mode may be more suitable than others depending on the string content.
A list of supported modes are shown in the table below:

| Mode         | Characters                                                | Compression                               |
|--------------|-----------------------------------------------------------|-------------------------------------------|
| Numeric      | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9                              | 3 characters are represented by 10 bits   |
| Alphanumeric | 0–9, A–Z (upper-case only), space, $, %, *, +, -, ., /, : | 2 characters are represented by 11 bits   |
| Kanji        | Characters from the Shift JIS system based on JIS X 0208  | 2 kanji are represented by 13 bits        |
| Byte         | Characters from the ISO/IEC 8859-1 character set          | Each characters are represented by 8 bits |

Choose the right mode may be tricky if the input text is unknown.<br>
In these cases **Byte** mode is the best choice since all characters can be encoded with it. (See [Multibyte characters](#multibyte-characters))<br>
However, if the QR Code reader supports mixed modes, using [Auto mode](#auto-mode) may produce better results.

### Mixed modes
Mixed modes are also possible. A QR code can be generated from a series of segments having different encoding modes to optimize the data compression.<br>
However, switching from a mode to another has a cost which may lead to a worst result if it's not taken into account.
See [Manual mode](#manual-mode) for an example of how to specify segments with different encoding modes.

### Auto mode
By **default**, automatic mode selection is used.<br>
The input string is automatically splitted in various segments optimized to produce the shortest possible bitstream using mixed modes.<br>
This is the preferred way to generate the QR Code.

For example, the string **ABCDE12345678?A1A** will be splitted in 3 segments with the following modes:

| Segment  | Mode         |
|----------|--------------|
| ABCDE    | Alphanumeric |
| 12345678 | Numeric      |
| ?A1A     | Byte         |

Any other combinations of segments and modes will result in a longer bitstream.<br>
If you need to keep the QR Code size small, this mode will produce the best results.

### Manual mode
If auto mode doesn't work for you or you have specific needs, is also possible to manually specify each segment with the relative mode.
In this way no segment optimizations will be applied under the hood.<br>
Segments list can be passed as an array of object:

```javascript
  var QRCode = require('qrcode')

  var segs = [
    { data: 'ABCDEFG', mode: 'alphanumeric' },
    { data: '0123456', mode: 'numeric' }
  ]

  QRCode.toDataURL(segs, function (err, url) {
    console.log(url)
  })
```

### Kanji mode
With kanji mode is possible to encode characters from the Shift JIS system in an optimized way.<br>
Unfortunately, there isn't a way to calculate a Shifted JIS values from, for example, a character encoded in UTF-8, for this reason a conversion table from the input characters to the SJIS values is needed.<br>
This table is not included by default in the bundle to keep the size as small as possible.

If your application requires kanji support, you will need to pass a function that will take care of converting the input characters to appropriate values.

An helper method is provided by the lib through an optional file that you can include as shown in the example below.

**Note:** Support for Kanji mode is only needed if you want to benefit of the data compression, otherwise is still possible to encode kanji using Byte mode (See [Multibyte characters](#multibyte-characters)).

```javascript
  var QRCode = require('qrcode')
  var toSJIS = require('qrcode/helper/to-sjis')

  QRCode.toDataURL(kanjiString, { toSJISFunc: toSJIS }, function (err, url) {
    console.log(url)
  })
```

With precompiled bundle:

```html
<canvas id="canvas"></canvas>

<script src="/build/qrcode.min.js"></script>
<script src="/build/qrcode.tosjis.min.js"></script>
<script>
  var qrcodedraw = new qrcodelib.qrcodedraw()

  qrcodedraw.draw(document.getElementById('canvas'),
    'sample text', { toSJISFunc: qrcodelib.toSJIS }, function (error, canvas) {
    if (error) console.error(error)
    console.log('success!');
  })
</script>
```

## Multibyte characters
Support for multibyte characters isn't present in the initial QR Code standard, but is possible to encode UTF-8 characters in Byte mode.

QR Codes provide a way to specify a different type of character set through ECI (Extended Channel Interpretation), but it's not fully implemented in this lib yet.

Most QR Code readers, however, are able to recognize multibyte characters even without ECI.

Note that a single Kanji/Kana or Emoji can take up to 4 bytes.

## API
### Browser

#### draw(canvasElement, text, [options], cb(error, canvas))
Draws qr code symbol to canvas

##### canvasElement
Type: `DOMElement`

Canvas where to draw QR Code

##### text
Type: `String|Array`

Text to encode or a list of objects describing segments

##### options
- ###### version
  Type: `Number`<br>

  QR Code version. If not specified the more suitable value will be calculated.

- ###### errorCorrectionLevel
  Type: `String`<br>
  Default: `M`

  Error correction level.
  Possible values are `low, medium, quartile, high` or `L, M, Q, H`.

- ###### toSJISFunc
  Type: `Function`<br>

  Helper function used internally to convert a kanji to its Shift JIS value.<br>
  Provide this function if you need support for Kanji mode.

##### cb
Type: `Function`

Callback function called on finish



### Server
#### draw(text, [options], cb(error, canvas))
Draws qr code symbol to canvas
Returns a node canvas object. See https://github.com/Automattic/node-canvas

#### QRCode.toDataURL(text, [optional options], cb(error, dataURL));
Returns mime image/png data url for the 2d barcode.

#### QRCode.drawSvg(text, [optional options], cb(error, svgString));
SVG output!

#### QRCode.save(path, text, [optional options], cb(error, written));
Saves png to the path specified returns bytes written.

#### QRCode.drawText(text, [optional options], cb)
Returns an ascii representation of the qrcode using unicode characters and ansi control codes for background control.

#### QRCode.drawBitArray(text, [optional options], cb(error, bits, width));
Returns an array with each value being either 0 light or 1 dark and the width of each row.
This is enough info to render a qrcode any way you want. =)

##### text
Type: `String|Array`

Text to encode or a list of objects describing segments

##### options
- ###### version
  Type: `Number`<br>

  QR Code version. If not specified the more suitable value will be calculated.

- ###### errorCorrectionLevel
  Type: `String`<br>
  Default: `M`

  Error correction level.
  Possible values are `low, medium, quartile, high` or `L, M, Q, H`.

- ###### toSJISFunc
  Type: `Function`<br>

  Helper function used internally to convert a kanji to its Shift JIS value.<br>
  Provide this function if you need support for Kanji mode.

##### cb
Type: `Function`

Callback function called on finish


## GS1 QR Codes
There was a real good discussion here about them. but in short any qrcode generator will make gs1 compatible qrcodes, but what defines a gs1 qrcode is a header with metadata that describes your gs1 information.

https://github.com/soldair/node-qrcode/issues/45


## Credits
This lib is based on "QRCode for JavaScript" which Kazuhiko Arase thankfully MIT licensed.

## License
[MIT](https://github.com/soldair/node-qrcode/blob/master/license)

The word "QR Code" is registered trademark of:<br>
DENSO WAVE INCORPORATED
