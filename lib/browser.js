
var QRCodeLib = require('./renderer/qrcode-draw.js')

if (typeof window !== 'undefined') {
  window.qrcodelib = window.QRCodeLib = QRCodeLib
  // monkey patch old api
  QRCodeLib.qrcodedraw = QRCodeLib.QRCodeDraw
}
