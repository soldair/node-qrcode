var QRCode = require('../lib')

var path = './tmp.png'
QRCode.toFile(path, 'life of the party bros', {
  color: {
    dark: '#00F', // Blue modules
    light: '#0000' // Transparent background
  }
}, function (err) {
  if (err) throw err
  console.log('saved.')
})
