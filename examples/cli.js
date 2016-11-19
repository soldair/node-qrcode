var QRCode = require('../lib')

QRCode.drawText('yo yo yo', function (error, data) {
  if (error) {
    throw new Error(error)
  }

  console.log(data)
})
