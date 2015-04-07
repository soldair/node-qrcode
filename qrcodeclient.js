
var QRCodeLib = require('qrcode-canvas/lib/qrcode-draw');

if(typeof window !== "undefined") {
  window.qrcodelib = window.QRCodeLib = QRCodeLib;
  // monkey patch old api
  QRCodeLib.qrcodedraw = QRCodeLib.QRCodeDraw;
}
