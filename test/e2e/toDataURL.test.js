var test = require('tap').test
var QRCode = require('lib')
var QRCodeBrowser = require('lib/browser')
var Canvas = require('canvas')

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

  t.plan(6)

  t.throw(function () { QRCode.toDataURL() },
    'Should throw if text is not provided')

  t.throw(function () { QRCode.toDataURL('some text') },
    'Should throw if a callback is not provided')

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
})

test('Canvas toDataURL - image/png', function (t) {
  var expectedDataURL = [
    'data:image/png;base64,',
    'iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAABmJLR0QA/wD/AP+gvaeTAA',
    'AC0klEQVR4nO3dQY6jMBAF0KY1979yZjObz8ZjucqG6L1tJwShr6LaNub6fD6fH/jn9/QJ',
    '8CwCQRAIgkAQBIIgEASBIAgEQSAIAkEQCIJAEASCIBAEgSD8WT3AdV0V5/Hf7ss37r+/ur',
    'xj9nijz5++PrNUCIJAEASCsNxD3FUv0ay+B4+ON9szzHr69VEhCAJBEAhCeQ9xN3uPm73H',
    'zo5LrPYIp3uA7sdoVAiCQBAEgtDeQ3SbnUsY3YNH39/dY+ymQhAEgiAQhNf3EHerY/vV6y',
    'veRoUgCARBIAjtPcTpe/Dqmshup6/PnQpBEAiCQBDKe4jdzyHcVT+3UT1Xcvr6jKgQBIEg',
    'CATh+va9rqvv8V9+uVQIkkAQBIKwfT1E9f4Ls5+f7RGq11SuPofR3eOoEASBIAgEoXyPqe',
    'o9lqr/7189v6f1GNVUCIJAEASCsNxDrD4rebc6TvC0uYannc+ICkEQCIJAEMrXQ3T3AKfH',
    'NbrnYk5TIQgCQRAIQvtcxkj1fP/qcxTd+1xWq+5RVAiCQBAEgrD9uYzqNYHVPcOq7jWQ1l',
    'SylUAQBIKwfRyi+p65ej53u+c6Rt/fTYUgCARBIAjt6yGq5xJ2r7d4+p5V1VQIgkAQBIJQ',
    'Pg6x+v3qnmH290eq50Ke1lOoEASBIAgE4fX7VFaPS1T3NCPda0hnqRAEgSAIBOH4OMSs2e',
    'ckVo8/+vvsfhfVx6+mQhAEgiAQhPK9rqvv6dVzE7vfl9E9zFN9fBWCIBAEgSC0vy9jdb3B',
    'rNm9qKvnHrqfFe2mQhAEgiAQhO3v3KpW/Q6t3e/7WD0f4xC0EgiCQBBe30N074s5a/fchT',
    'WVtBIIgkAQ2nuI3WPxp9d4jjy9Z1EhCAJBEAhCeQ9xep/F1TWT3e8A637nmHEISgkEQSAI',
    'r98fgloqBEEgCAJBEAiCQBAEgiAQBIEgCARBIAgCQRAIgkAQBIIgEIS/tUuOEc+/Ls0AAA',
    'AASUVORK5CYII='].join('')

  t.plan(6)

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
})
