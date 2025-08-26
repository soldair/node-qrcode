import * as QRCode from './lib/index.js'

QRCode.toDataURL('i am a pony!', {
  errorCorrectionLevel: 'L',
  type: 'image/png'
}, function (err, url) {
  if (err) {
    console.error('Error:', err)
    return
  }
  console.log('Expected value for error correction level L:')
  console.log(url)
})
