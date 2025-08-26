import * as QRCode from '../lib/index.js'
QRCode.toString('yo yo yo', function (error, data) {
  if (error) {
    throw new Error(error)
  }
  console.log(data)
})
