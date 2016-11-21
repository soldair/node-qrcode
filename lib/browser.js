
var QRCodeLib = require('./renderer/qrcode-draw.js')

// monkey patch old api
QRCodeLib.qrcodedraw = QRCodeLib.QRCodeDraw

module.exports = QRCodeLib
