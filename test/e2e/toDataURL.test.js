import tap from 'tap'
import * as QRCode from '../../lib/index.js'
import * as QRCodeBrowser from '../../lib/browser.js'
import canvas from 'canvas'
import * as Helpers from '../helpers.js'
const test = tap.test
const { createCanvas } = canvas
test('toDataURL - no promise available', function (t) {
  Helpers.removeNativePromise()
  t.throw(function () { QRCode.toDataURL() }, 'Should throw if no arguments are provided')
  t.throw(function () { QRCode.toDataURL(function () { }) }, 'Should throw if text is not provided')
  t.throw(function () { QRCode.toDataURL('some text') }, 'Should throw if a callback is not provided')
  t.throw(function () { QRCode.toDataURL('some text', {}) }, 'Should throw if a callback is not a function')
  t.throw(function () { QRCodeBrowser.toDataURL() }, 'Should throw if no arguments are provided (browser)')
  t.throw(function () { QRCodeBrowser.toDataURL(function () { }) }, 'Should throw if text is not provided (browser)')
  t.throw(function () { QRCodeBrowser.toDataURL('some text') }, 'Should throw if a callback is not provided (browser)')
  t.throw(function () { QRCodeBrowser.toDataURL('some text', {}) }, 'Should throw if a callback is not a function (browser)')
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
    'UqxRijXKP0OHEepgrecVAAAAAElFTkSuQmCC'
  ].join('')
  t.plan(8)
  t.throw(function () { QRCode.toDataURL() }, 'Should throw if no arguments are provided')
  QRCode.toDataURL('i am a pony!', {
    errorCorrectionLevel: 'L',
    type: 'image/png'
  }, function (err, url) {
    t.ok(!err, 'there should be no error ' + err)
    t.equals(url, expectedDataURL, 'url should match expected value for error correction L')
  })
  QRCode.toDataURL('i am a pony!', {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: 'H',
    type: 'image/png'
  }, function (err, url) {
    t.ok(err, 'there should be an error ')
    t.notOk(url, 'url should be null')
  })
  t.equals(typeof QRCode.toDataURL('i am a pony!').then, 'function', 'Should return a promise')
  QRCode.toDataURL('i am a pony!', {
    errorCorrectionLevel: 'L',
    type: 'image/png'
  }).then(function (url) {
    t.equals(url, expectedDataURL, 'url should match expected value for error correction L (promise)')
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
  const expectedDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAABmJLR0QA/wD/AP+gvaeTAAAC4UlEQVR4nO3dQY7jMAwEwM1i///lzGUurYtWEEknQNV1Mo4TNGhFpuTX+/1+/4Fff58+AT6LQBAEgiAQBIEgCARBIAgCQRAIgkAQBIIgEASBIAgEQSAI/24P8Hq9as7kP63tG+v737Z3nB5v9/qnv59TKgRBIAgCQbgeQ6yqWzR31+DTa3z1+Zx+3unv55QKQRAIgkAQyscQq9NrXPc8wu28wdNjgO5lNCoEQSAIAkFoH0N0ux0zrG7vRXz7UlkVgiAQBIEgfP0Yors/YvpeydNUCIJAEASC0D6G+LTf5af3KnZjku4xyjQVgiAQBIEglI8hpn+Xd/c/3L7/7vWfRoUgCARBIAjXY4inf0ef9jec/v3W09/PKRWCIBAEgSC8up+XUT0PUL2Oonse4fTrrd6f4pQKQRAIgkAQyveYmr7mde/pdDsG6t4Dq5oKQRAIgkAQyu9lnF5zq6+Jt+s0qudFps/nlgpBEAiCQBDG13be3ouYnhfYjXmq98KensdZqRAEgSAIBGH8XsbqdJ6i+vir7mv0qvrz6IeglEAQBIJQ3lNZ/bt7d/xVdQ/jdM/m7v93jCEoJRAEgSC0z0N8ej/CqepnbHWvSzmlQhAEgiAQhI+bh6ieF3i6f2H6+LdUCIJAEASC8Hg/xGq653D6mVy3799NhSAIBEEgCO17THXr7o841d3f0f1schWCIBAEgSCUz0N0u33mVfUztKrXeXT3O+yoEASBIAgEoXx/iOppjdNr9O58uvee3r3/qel+CRWCIBAEgSC07zE1vTZxuqdy9//fRoUgCARBIAjj+1RWm17XcXt+q+o9tW6pEASBIAgE4evHENVrRaefy3n6evtUMkogCAJBaB9DTO8VPT1vsPv7bQ+lfggeJRAEgSBcr+18el3Gqep5hu59NU/fzzwEpQSCIBCEr98fgloqBEEgCAJBEAiCQBAEgiAQBIEgCARBIAgCQRAIgkAQBIIgEIQflZ7HAoWiHmAAAAAASUVORK5CYII='
  t.plan(11)
  t.throw(function () { QRCodeBrowser.toDataURL() }, 'Should throw if no arguments are provided')
  t.throw(function () { QRCodeBrowser.toDataURL(function () { }) }, 'Should throw if text is not provided')
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
