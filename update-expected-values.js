import canvas from 'canvas'
import * as QRCodeBrowser from './lib/browser.js'

const { createCanvas } = canvas

console.log('Generating expected values for toDataURL tests...')

// Test case 1: Canvas toDataURL with 'i am a pony!' and errorCorrectionLevel: 'H'
const canvas1 = createCanvas(200, 200)
QRCodeBrowser.toDataURL(canvas1, 'i am a pony!', {
  errorCorrectionLevel: 'H',
  type: 'image/png'
}, function (err, url) {
  if (err) {
    console.error('Error generating expected value 1:', err)
    return
  }
  console.log('Expected value 1 (errorCorrectionLevel: H):')
  console.log(url)
  console.log('')
})

// Test case 2: Canvas toDataURL with 'i am a pony!' and errorCorrectionLevel: 'M'
const canvas2 = createCanvas(200, 200)
QRCodeBrowser.toDataURL(canvas2, 'i am a pony!', {
  errorCorrectionLevel: 'M',
  type: 'image/png'
}, function (err, url) {
  if (err) {
    console.error('Error generating expected value 2:', err)
    return
  }
  console.log('Expected value 2 (errorCorrectionLevel: M):')
  console.log(url)
  console.log('')
})
