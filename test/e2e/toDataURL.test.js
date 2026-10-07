const test = require('tap').test
const QRCode = require('lib')
const QRCodeBrowser = require('lib/browser')
const { createCanvas } = require('canvas')
const Helpers = require('test/helpers')

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
  const expectedDataURL = [
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
  const expectedDataURL = [
    'data:image/png;base64,',
    'iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAABmJLR0QA/wD/AP+gvaeTAAACwElE',
    'QVR4nO3dwbLbIBAEwDiV//9l55LL6EIolgUl3Vf7ybJrarUPAfp8v9/vD/jj5+kT4C4CQRAIgkAQ',
    'BIIgEASBIAgEQSAIAkEQCIJAEASCIBAEgSD8Wj3A5/OpOI+/Npq+8Tyf5/tHr4+Mvu/o83Zbnd6i',
    'QhAEgiAQhOUe4ql6iubqNXi2Z5jtEWbd9vs8qRAEgSAIBKG8h3iavcatjgusjlOMxhFWxzFG5zOy',
    'exmNCkEQCIJAELb3EN1uG3d4GxWCIBAEgSC8vofo7hGqxyFuo0IQBIIgEITtPcTbrrGz9xZWe4rb',
    'fh8VgiAQBIEglPcQ3esQZq/hs+s0Zl8f6f59ZqkQBIEgCATh86/tdb16zf/f50+oEASBIAgEob2H',
    'qN5f4fS6iO51GtZl0EogCAJBKO8hdq+L6H7/bXtU6SFoJRAEgSAc7yFmjzere9/I1f0pZlUfT4Ug',
    'CARBIAjle12f3ot6t+o9qG6bY6lCEASCIBCE7esyVtc6Vs8P6P6/f/e9lGoqBEEgCAJBaN/runqc',
    'YvXvq3uQ6h7DfAiOEgiCQBDa95i67d5H9TjB23sMFYIgEASBIGx/bmf3uED38brXhrqXQSuBIAgE',
    'YXldxu5xgKfTx79tDmT1vQ0VgiAQBIEgLI9DrF7Duuc43ja/4vQcyicVgiAQBIEglK/t3K16vkH3',
    '8zG613HMUiEIAkEQCML2+RCrdj+7e/V4I6fHaWapEASBIAgEoX1t58jp+Q6j48/uMVVt91pPFYIg',
    'EASBIGzvIbp133vY/ZzP7n09VQiCQBAEgvD6HuL0fIbV+Quz+01Y20krgSAIBKF9j6nTn/e2Z2JZ',
    'l8FRAkEQCML252V0q94Hc/T+p+r5Et37VagQBIEgCASh/NnfvJsKQRAIgkAQBIIgEASBIAgEQSAI',
    'AkEQCIJAEASCIBAEgSAIBOE351SsFI8rI/0AAAAASUVORK5CYII='].join('')

  t.plan(11)

  t.throw(function () { QRCodeBrowser.toDataURL() },
    'Should throw if no arguments are provided')

  t.throw(function () { QRCodeBrowser.toDataURL(function () {}) },
    'Should throw if text is not provided')

  const canvas = createCanvas(200, 200)
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
        return createCanvas(200, 200)
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
