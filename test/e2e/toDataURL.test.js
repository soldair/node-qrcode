var test = require('tap').test
var QRCode = require('lib')
var QRCodeBrowser = require('lib/browser')
var Canvas = require('canvas')
var Helpers = require('test/helpers')

test('toDataURL - no promise available', function (t) {
  Helpers.removeNativePromise()

  t.throw(function () { QRCode.toDataURL() },
    'Should throw if no arguments are provided')

  t.throw(function () { QRCode.toDataURL(function () {}) },
    'Should throw if text is not provided')

  t.throw(function () { QRCode.toDataURL('some text') },
    'Should throw if a callback is not provided')

  t.throw(function () { QRCode.toDataURL('some text', {}) },
    'Should throw if a callback is not a function')

  t.throw(function () { QRCodeBrowser.toDataURL() },
    'Should throw if no arguments are provided (browser)')

  t.throw(function () { QRCodeBrowser.toDataURL(function () {}) },
    'Should throw if text is not provided (browser)')

  t.throw(function () { QRCodeBrowser.toDataURL('some text') },
    'Should throw if a callback is not provided (browser)')

  t.throw(function () { QRCodeBrowser.toDataURL('some text', {}) },
    'Should throw if a callback is not a function (browser)')

  t.end()

  Helpers.restoreNativePromise()
})

test('toDataURL - image/png', function (t) {
  var expectedDataURL = [
    'data:image/png;base64,',
    'iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKzSU',
    'RBVO3BQW7kQAwEwSxC//9y7h55akCQxvYQjIj/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp',
    '1ijFGqVYoxRrlGKNUqxRijXKxUNJ+EkqdyShU+mS0Kl0SfhJKk8Ua5RijVKsUS5epvKmJD',
    'yh8iaVNyXhTcUapVijFGuUiw9Lwh0qdyShU+mS0Kl0Kk8k4Q6VTyrWKMUapVijXHw5lROV',
    'kyR0Kt+sWKMUa5RijXIxTBI6lS4JkxVrlGKNUqxRLj5M5Tcl4UTlCZW/pFijFGuUYo1y8b',
    'Ik/KQkdCpdEjqVLgmdykkS/rJijVKsUYo1ysVDKt9M5UTlmxRrlGKNUqxRLh5Kwh0qXRJ+',
    'UxLuULkjCZ3KJxVrlGKNUqxRLh5S6ZLQqXRJ6FS6JHQqXRKeSEKn0iWhUzlJwolKl4QTlS',
    'eKNUqxRinWKBe/LAmdSpeETuUkCZ1Kl4QTlS4Jd6h0SehUuiS8qVijFGuUYo1y8WFJ6FS6',
    'JJyofFISOpVOpUtCp3KicqLypmKNUqxRijXKxYep3JGEE5UuCZ3KHSp3qHRJ6FR+U7FGKd',
    'YoxRol/scXS8ITKidJeEKlS8KJyhPFGqVYoxRrlIuHkvCTVE5U7kjCicpJEk6S8JOKNUqx',
    'RinWKBcvU3lTEu5IwolKp/KEyh1J6FTeVKxRijVKsUa5+LAk3KHyJpWTJHQqdyShU/lNxR',
    'qlWKMUa5SLL6fSJaFLwhNJeCIJP6lYoxRrlGKNcvHlknCicpKEE5UuCSdJOFHpktCpPFGs',
    'UYo1SrFGufgwlZ+k0iWhU+lUnlDpktCpdEnoVN5UrFGKNUqxRrl4WRL+EpU7ktCpdCpdEj',
    'qVO5LQqTxRrFGKNUqxRon/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKN',
    'UqxRijXKP0OHEepgrecVAAAAAElFTkSuQmCC'].join('')

  t.plan(8)

  t.throw(function () { QRCode.toDataURL() },
    'Should throw if no arguments are provided')

  QRCode.toDataURL('i am a pony!', {
    errorCorrectionLevel: 'L',
    type: 'image/png'
  }, function (err, url) {
    t.ok(!err, 'there should be no error ' + err)
    t.equals(url, expectedDataURL,
      'url should match expected value for error correction L')
  })

  QRCode.toDataURL('i am a pony!', {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: 'H',
    type: 'image/png'
  }, function (err, url) {
    t.ok(err, 'there should be an error ')
    t.notOk(url, 'url should be null')
  })

  t.equals(typeof QRCode.toDataURL('i am a pony!').then, 'function',
    'Should return a promise')

  QRCode.toDataURL('i am a pony!', {
    errorCorrectionLevel: 'L',
    type: 'image/png'
  }).then(function (url) {
    t.equals(url, expectedDataURL,
      'url should match expected value for error correction L (promise)')
  })

  QRCode.toDataURL('i am a pony!', {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: 'H',
    type: 'image/png'
  }).catch(function (err) {
    t.ok(err, 'there should be an error (promise)')
  })
})

test('Canvas toDataURL - image/png', function (t) {
  var expectedDataURL = [
    'data:image/png;base64,',
    'iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAABmJLR0QA/wD/AP+gvaeTAA',
    'AC20lEQVR4nO3dQY7jMAwEwM1i///lzGUurYtWEEknQNV1EidjNGhFpuTX+/1+/4Fff5/+',
    'AnwWgSAIBEEgCAJBEAiCQBAEgiAQBIEgCARBIAgCQRAIgkAQ/t0e4PV6VXyP/7a2b6yff9',
    'vecXq83eufPj+nVAiCQBAEgnA9hlhVt2jursGn1/hbt2OW6fNzSoUgCARBIAjlY4jV6TWu',
    'ex7hdt7g6TFA9zIaFYIgEASBILSPIbrdjhlWt/civn2prApBEAiCQBC+fgzR3R8xfa/kaS',
    'oEQSAIAkFoH0N82u/y03sVuzFJ9xhlmgpBEAiCQBDKxxDTv8u7+x9uP3/3+k+jQhAEgiAQ',
    'hOsxxNO/o0/7G07/fuvp83NKhSAIBEEgCK/u52VUzwNUr6Ponkc4Pb3V+1OcUiEIAkEQCE',
    'L5HlPT17zuPZ1ux0Dde2BVUyEIAkEQCEL5vYzTa271NfF2nUb1vMj097mlQhAEgiAQhPG1',
    'nbf3IqbnBXZjnuq9sKfncVYqBEEgCAJBGL+XsTqdp6g+/qr7Gr2q/n/0Q1BKIAgCQSjvqa',
    'z+3b07/qq6h3G6Z3P3/h1jCEoJBEEgCO3zEJ/ej3Cq+hlb3etSTqkQBIEgCATh4+YhqucF',
    'nu5fmD7+LRWCIBAEgSA83g+xmu45nH4m1+3nd1MhCAJBEAhC+x5T3br7I05193d0P5tchS',
    'AIBEEgCOXzEN1un3lV/Qyt6nUe3f0OOyoEQSAIAkEo3x+ielrj9Bq96h5z7Dx9b+eUCkEQ',
    'CIJAENr3mJpemzjdU7l7/7dRIQgCQRAIwvg+ldWm13Wc6t4Hs5oKQRAIgkAQvn4MUb1WdP',
    'q5nKevt08lowSCIBCE9jHE9F7R0/MGu7/f9lDqh+BRAkEQCML12s6n12Wcqp5n6N5X8/Tz',
    'zENQSiAIAkH4+v0hqKVCEASCIBAEgSAIBEEgCAJBEAiCQBAEgiAQBIEgCARBIAgCQfgBlZ',
    '7HAm5AupgAAAAASUVORK5CYII='].join('')

  t.plan(11)

  t.throw(function () { QRCodeBrowser.toDataURL() },
    'Should throw if no arguments are provided')

  t.throw(function () { QRCodeBrowser.toDataURL(function () {}) },
      'Should throw if text is not provided')

  var canvas = new Canvas(200, 200)
  QRCodeBrowser.toDataURL(canvas, 'i am a pony!', {
    errorCorrectionLevel: 'H',
    type: 'image/png'
  }, function (err, url) {
    t.ok(!err, 'there should be no error ' + err)
    t.equals(url, expectedDataURL, 'url generated should match expected value')
  })

  QRCodeBrowser.toDataURL(canvas, 'i am a pony!', {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: 'H',
    type: 'image/png'
  }, function (err, url) {
    t.ok(err, 'there should be an error ')
    t.notOk(url, 'url should be null')
  })

  QRCodeBrowser.toDataURL(canvas, 'i am a pony!', {
    errorCorrectionLevel: 'H',
    type: 'image/png'
  }).then(function (url) {
    t.equals(url, expectedDataURL, 'url generated should match expected value (promise)')
  })

  QRCodeBrowser.toDataURL(canvas, 'i am a pony!', {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: 'H',
    type: 'image/png'
  }).catch(function (err) {
    t.ok(err, 'there should be an error (promise)')
  })

  // Mock document object
  global.document = {
    createElement: function (el) {
      if (el === 'canvas') {
        return new Canvas(200, 200)
      }
    }
  }

  QRCodeBrowser.toDataURL('i am a pony!', {
    errorCorrectionLevel: 'H',
    type: 'image/png'
  }, function (err, url) {
    t.ok(!err, 'there should be no error ' + err)
    t.equals(url, expectedDataURL, 'url generated should match expected value')
  })

  QRCodeBrowser.toDataURL('i am a pony!', {
    errorCorrectionLevel: 'H',
    type: 'image/png'
  }).then(function (url) {
    t.equals(url, expectedDataURL, 'url generated should match expected value (promise)')
  })
})
