var QRCode = require('../qrcode.js')

QRCode.drawText('yo yo yo', function (error, data) {
  if (error) {
    throw new Error(error)
  }

  console.log(data)
})
