var test = require('tap').test
var fs = require('fs')
var path = require('path')
var tmpDir = require('os-tmpdir')
var QRCode = require('lib')

test('toFile', function (t) {
  var fileName = 'qrimage.png'

  t.throw(function () { QRCode.toFile('some text', function () {}) },
    'Should throw if path is not provided')

  t.throw(function () { QRCode.toFile(fileName) },
    'Should throw if text is not provided')

  t.throw(function () { QRCode.toFile(fileName, 'some text') },
    'Should throw if a callback is not provided')

  t.end()
})

test('toFile png', function (t) {
  var fileName = path.join(tmpDir(), 'qrimage.png')
  var expectedBase64Output = [
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

  t.plan(4)

  QRCode.toFile(fileName, 'i am a pony!', {
    errorCorrectionLevel: 'L'
  }, function (err) {
    t.ok(!err, 'There should be no error')

    fs.stat(fileName, function (err) {
      t.ok(!err,
        'Should save file with correct file name')
    })

    fs.readFile(fileName, function (err, buffer) {
      if (err) throw err

      t.equal(buffer.toString('base64'), expectedBase64Output,
        'Should write correct content')
    })
  })

  QRCode.toFile(fileName, 'i am a pony!', {
    errorCorrectionLevel: 'L',
    type: 'png'
  }, function (err) {
    t.ok(!err, 'There should be no errors if file type is specified')
  })
})

test('toFile svg', function (t) {
  var fileName = path.join(tmpDir(), 'qrimage.svg')
  var expectedOutput = fs.readFileSync(
    path.join(__dirname,
    '/fixtures/expected-output.svg'),
    'UTF-8')

  t.plan(4)

  QRCode.toFile(fileName, 'http://www.google.com', {
    errorCorrectionLevel: 'H'
  }, function (err) {
    t.ok(!err, 'There should be no error')

    fs.stat(fileName, function (err) {
      t.ok(!err,
        'Should save file with correct file name')
    })

    fs.readFile(fileName, 'utf8', function (err, content) {
      if (err) throw err
      t.equal(content, expectedOutput,
        'Should write correct content')
    })
  })

  QRCode.toFile(fileName, 'http://www.google.com', {
    errorCorrectionLevel: 'H',
    type: 'svg'
  }, function (err) {
    t.ok(!err, 'There should be no errors if file type is specified')
  })
})

test('toFile utf8', function (t) {
  var fileName = path.join(tmpDir(), 'qrimage.txt')
  var expectedOutput = [
    '                                 ',
    '                                 ',
    '    █▀▀▀▀▀█ █ ▄█  ▀ █ █▀▀▀▀▀█    ',
    '    █ ███ █ ▀█▄▀▄█ ▀▄ █ ███ █    ',
    '    █ ▀▀▀ █ ▀▄ ▄ ▄▀ █ █ ▀▀▀ █    ',
    '    ▀▀▀▀▀▀▀ ▀ ▀ █▄▀ █ ▀▀▀▀▀▀▀    ',
    '    ▀▄ ▀▀▀▀█▀▀█▄ ▄█▄▀█ ▄█▄██▀    ',
    '    █▄ ▄▀▀▀▄▄█ █▀▀▄█▀ ▀█ █▄▄█    ',
    '    █▄ ▄█▄▀█▄▄  ▀ ▄██▀▀ ▄  ▄▀    ',
    '    █▀▄▄▄▄▀▀█▀▀█▀▀▀█ ▀ ▄█▀█▀█    ',
    '    ▀ ▀▀▀▀▀▀███▄▄▄▀ █▀▀▀█ ▀█     ',
    '    █▀▀▀▀▀█ █▀█▀▄ ▄▄█ ▀ █▀ ▄█    ',
    '    █ ███ █ █ █ ▀▀██▀███▀█ ██    ',
    '    █ ▀▀▀ █  █▀ ▀ █ ▀▀▄██ ███    ',
    '    ▀▀▀▀▀▀▀ ▀▀▀  ▀▀ ▀    ▀  ▀    ',
    '                                 ',
    '                                 '].join('\n')

  t.plan(4)

  QRCode.toFile(fileName, 'http://www.google.com', function (err) {
    t.ok(!err, 'There should be no error')

    fs.stat(fileName, function (err) {
      t.ok(!err,
        'Should save file with correct file name')
    })

    fs.readFile(fileName, 'utf8', function (err, content) {
      if (err) throw err
      t.equal(content, expectedOutput,
        'Should write correct content')
    })
  })

  QRCode.toFile(fileName, 'http://www.google.com', {
    errorCorrectionLevel: 'M',
    type: 'utf8'
  }, function (err) {
    t.ok(!err, 'There should be no errors if file type is specified')
  })
})
