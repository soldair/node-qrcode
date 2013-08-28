
var QRCodeLib = require('./lib/qrcode-draw.js');

if(typeof window !== "undefined") {
  window.qrcodelib = window.QRCodeLib = QRCodeLib;
  // monkey patch old api
  QRCodeLib.qrcodedraw = QRCodeLib.QRCodeDraw;
}
