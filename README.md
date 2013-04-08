[![Build Status](https://secure.travis-ci.org/soldair/node-qrcode.png)](http://travis-ci.org/soldair/node-qrcode)


node-qrcode
=

This is a server side QR code/2d barcode generator.

It is an extension of "QRCode for JavaScript" which Kazuhiko Arase thankfully MIT licensed.

The `qrcode-draw.js` can be used  directly as a client side lib if its appended too or included with `lib/qrcode.js`.

To use this on the server side please `require('qrcode');` =)

Examples
--------
A simple server side test...

    var QRCode = require('qrcode');
    
    QRCode.toDataURL('i am a pony!',function(err,url){
        console.log(url);
    });


In your terminal if you install globally...


    qrcode "hi i want a qrcode"
    
    qrcode "i like to save qrs to file" qr.png


In client side HTML...


    <!--[if ie]><script type="text/javascript" src="/vendors/excanvas/excanvas.js"></script><![endif]-->
    <script src="/build/qrcode.js"></script>
    <canvas id="test"></canvas>
    <script>
    
    var qrcodedraw = new QRCodeLib.QRCodeDraw();
    
    qrcodedraw.draw(document.getElementById('test'),"this text will be in the code!", function(error,canvas){
      if(error){
         return console.log('Error =( ',error);
      }
      console.log('success!');
    });
    </script>


Remember to put `excanvas.js` and `qrcode.js` somewhere where your browser can find them.

Server Side API
---

    QRCode.draw(text, [optional options], cb(error,canvas));
Returns a node canvas object see https://github.com/LearnBoost/node-canvas for all of the cool node things you can do. Look up the canvas api for the other cool things.
    
    QRCode.toDataURL(text, [optional options], cb(error,dataURL));
Returns mime image/png data url for the 2d barcode.
    
    QRCode.save(path, text, [optional options] , cb(error,written));
Saves png to the path specified returns bytes written.
    
    QRCode.drawText(text, [optional options],cb)
Returns an ascii representation of the qrcode using unicode characters and ansi control codes for background control.
    
    QRCode.drawBitArray(text, [optional options], cb(error,bits,width));
Returns an array with each value being either 0 light or 1 dark and the width of each row.
This is enough info to render a qrcode any way you want. =)


Options
---------

    errorCorrectLevel

Can be one of the values in `qrcode.errorCorrectLevel`.
Can be a string. one of `"minumum","medium","high","max"`.
If `undefined`, defaults to H which is max error correction.
If invalid value, defaults to minimum error correction.

client side api
---------------

    window.qrcodelib

`qrcodelib.qrcodedraw()` Constructor

    qrcode = new qrcodelib.qrcodedraw()
    qrcode.draw(canvasElement,text,[optional options],cb);


For quick client side use...

    node test/clientsideserver.js
    open http://localhost:3031

The JavaScript is in `test/clientside.html`.

QR code capacity
---

This libary can encode a string up to lengths:

- 2953 in error correct level L
- 2331 in error correct level M
- 1663 in error correct level Q
- 1273 in error correct level H

The default is H. 

It can now be changed in an ugly way that wont be supported for more then another few days if you really need to. Also the default module size at qr version 40 is really too small for the camera on my Nexus 1 and to make it larger i run out of screen to show it. At 40 the barcode scanner even finds random UPC 1d barcodes in the mass of little squares.
the default module size cannot be changed through the public api at this time.

Installation
--

    npm install qrcode
To use qrcode from the command line to save  qrcode images or generate ones you can view in your terminal...

    npm install -g qrcode 
`node-canvas` is a native module and requires dev packages of `cairo` and `pixman` to compile. 
 On ubuntu you can install them with `apt-get` and `npm install` will work great.
  

    sudo apt-get install libpixman-1-dev libcairo2-dev
It is my higest priority for this module to use an all `js` png encoder and remove this dep.


Dependencies
------------
These should be taken care of for you by npm but you should...

    npm install canvas

If `cairo` gives you trouble and you cannot install `canvas`, checkout the canvas site. I know @tjholowaychuk has setup a way to download and install a version of cairo/pixman for testing.

The word "QR Code" is registered trademark of:

DENSO WAVE INCORPORATED
