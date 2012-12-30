[![Build Status](https://secure.travis-ci.org/soldair/node-qrcode.png)](http://travis-ci.org/soldair/node-qrcode)


node-qrcode
===========


This is a server side QR code / 2d barcode generator.
it is an extension of "QRCode for JavaScript" which Kazuhiko Arase thankfully mit licensed

the qrcode-draw.js can be used  directly as a client side lib if its appended too or included with lib/qrcode.js
to use this on the server side please require('qrcode'); =)

examples
--------
simple test

```js

	var QRCode = require('qrcode');

	QRCode.toDataURL('i am a pony!',function(err,url){
		console.log(url);
	});

```
in your terminal if you install globally

```sh

	qrcode "hi i want a qrcode"

  qrcode "i like to save qrs to file" qr.png


```

in client side html. 

```html

<!--[if ie]><script type="text/javascript" src="/vendors/excanvas/excanvas.js"></script><![endif]-->
<script src="/build/qrcode.js"></script>
<canvas id="test"></canvas>
<script>

  var qrcodedraw = new qrcodelib.qrcodedraw();

  qrcodedraw.draw(document.getElementByID('test'),"this text will be in the code!",function(error,canvas){
    if(error) {
      return console.log('Error =( ',error);
    }
    console.log('success!');
  });
</script>

```

remeber to put excanvas and qrcode.js somewhere where your browser can find them

server side api
---------------

  QRCode.draw(text, [optional options], cb(error,canvas));
    returns node canvas object see https://github.com/LearnBoost/node-canvas for all of the cool node things you can do
    look up the canvas api for the other cool things

  QRCode.toDataURL(text, [optional options], cb(error,dataURL));
    returns mime image/png data url for the 2d barcode 

  QRCode.save(path, text, [optional options] , cb(error,written));
    saves png to the path specified returns bytes written

  QRCode.drawText(text, [optional options],cb)
    returns an ascii representation of the qrcode using unicode characters and ansi control codes for background control.

  QRCode.drawBitArray(text, [optional options], cb(error,bits,width));
    returns an array with each value being either 0 light or 1 dark and the width of each row.
    this is enough info to render a qrcode any way you want =)

options
---------

  errorCorrectLevel
    can be one of the values in qrcode.errorCorrectLevel
    can be a string. one of  "minumum","medium","high","max"
    if undefined defaults to H which is max error correction
    if invalid value defaults to minimum error correction

client side api
---------------

window.qrcodelib
  - qrcodelib.qrcodedraw() Constructor

qrcode = new qrcodelib.qrcodedraw()
  - qrcode.draw(canvasElement,text,[optional options],cb);


for quick client side use:

- run node test/clientsideserver.js
- open localhost:3031 in your browser

the javascript is in test/clientside.html

qr code capacity.
-----------------

this libary can encode a string up to lengths:
2953 in error correct level L
2331 in error correct level M
1663 in error correct level Q
1273 in error correct level H

the default is H. 
It can now be changed in an ugly way that wont be supported for more then another few days if you really need to.
also the default module size at qr version 40 is really too small for the camera on my Nexus 1 and to make it larger i run out of screen to show it. At 40 the barcode scanner even finds random UPC 1d barcodes in the mass of little squares.
the default module size cannot be changed through the public api at this time.

install
-------

	npm install qrcode

	to use qrcode from the command line to save  qrcode images or generate ones you can view in your termial

	npm install -g qrcode 


  node-canvas is a native module and requires dev packages of cairo and pixman to compile. 
  on ubuntu you can install them with apt-get and npm install will work great.

  ```sh
  
  sudo apt-get install libpixman-1-dev libcairo2-dev
  ```
  
  it is my higest priority for this module to use an all js png encoder and remove this dep.


dependencies
------------
these should be taken care of for you by npm but you should

	npm install canvas

if cairo gives you trouble and you cannot install canvas checkout the canvas site i know tj has setup a way to download and install a version of cairo/pixman for testing.

The word "QR Code" is registered trademark of 
DENSO WAVE INCORPORATED
