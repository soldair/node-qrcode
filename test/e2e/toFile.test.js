var test = require('tap').test
var sinon = require('sinon')
var fs = require('fs')
var path = require('path')
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
  var fileName = 'qrimage.png'
  var expectedBase64Output = [
    'iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAACtUlEQVR4Ae3BQW7kQAwEwS',
    'xC//9y7h55akCQxvYQjIj/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKN',
    'UqxRijXKxUNJ+EkqdyShU+mS0Kl0SfhJKk8Ua5RijVKsUS5epvKmJDyh8iaVNyXhTcUapV',
    'ijFGuUiw9Lwh0qdyShU+mS0Kl0Kk8k4Q6VTyrWKMUapVijXHw5lROVkyR0Kt+sWKMUa5Ri',
    'jXIxTBI6lS4JkxVrlGKNUqxRLj5M5Tcl4UTlCZW/pFijFGuUYo1y8bIk/KQkdCpdEjqVLg',
    'mdykkS/rJijVKsUYo1ysVDKt9M5UTlmxRrlGKNUqxRLh5Kwh0qXRJ+UxLuULkjCZ3KJxVr',
    'lGKNUqxRLh5S6ZLQqXRJ6FS6JHQqXRKeSEKn0iWhUzlJwolKl4QTlSeKNUqxRinWKBe/LA',
    'mdSpeETuUkCZ1Kl4QTlS4Jd6h0SehUuiS8qVijFGuUYo1y8WFJ6FS6JJyofFISOpVOpUtC',
    'p3KicqLypmKNUqxRijXKxYep3JGEE5UuCZ3KHSp3qHRJ6FR+U7FGKdYoxRol/scXS8ITKi',
    'dJeEKlS8KJyhPFGqVYoxRrlIuHkvCTVE5U7kjCicpJEk6S8JOKNUqxRinWKBcvU3lTEu5I',
    'wolKp/KEyh1J6FTeVKxRijVKsUa5+LAk3KHyJpWTJHQqdyShU/lNxRqlWKMUa5SLL6fSJa',
    'FLwhNJeCIJP6lYoxRrlGKNcvHlknCicpKEE5UuCSdJOFHpktCpPFGsUYo1SrFGufgwlZ+k',
    '0iWhU+lUnlDpktCpdEnoVN5UrFGKNUqxRrl4WRL+EpU7ktCpdCpdEjqVO5LQqTxRrFGKNU',
    'qxRon/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKP0OHEeqM',
    'EzpFAAAAAElFTkSuQmCC'].join('')

  t.plan(6)

  var fsStub = sinon.stub(fs, 'writeFileSync', function (path, buffer) {
    t.equal(path, fileName,
      'Should save file with correct file name')

    t.equal(buffer.toString('base64'), expectedBase64Output,
      'Should write correct content')
  }).reset()

  QRCode.toFile(fileName, 'i am a pony!', {
    errorCorrectionLevel: 'L'
  }, function (err) {
    t.ok(!err, 'There should be no error ' + err)
  })

  QRCode.toFile(fileName, 'i am a pony!', {
    errorCorrectionLevel: 'L',
    type: 'png'
  }, function (err) {
    t.ok(!err, 'There should be no errors if file type is specified')
  })

  fsStub.restore()
})

test('toFile svg', function (t) {
  var fileName = 'qrimage.svg'
  var expectedOutput = fs.readFileSync(
    path.join(__dirname,
    '/fixtures/expected-output.svg'),
    'UTF-8')

  t.plan(6)

  var fsStub = sinon.stub(fs, 'writeFileSync', function (path, buffer) {
    t.equal(path, fileName,
      'Should save file with correct file name')

    t.equal(buffer, expectedOutput,
      'Should write correct content')
  }).reset()

  QRCode.toFile(fileName, 'http://www.google.com', {
    errorCorrectionLevel: 'H'
  }, function (err) {
    t.ok(!err, 'There should be no error ' + err)
  })

  QRCode.toFile(fileName, 'http://www.google.com', {
    errorCorrectionLevel: 'H',
    type: 'svg'
  }, function (err) {
    t.ok(!err, 'There should be no errors if file type is specified')
  })

  fsStub.restore()
})

test('toFile utf8', function (t) {
  var fileName = 'qrimage.txt'
  var expectedOutput = [
    '                                 ',
    '                                 ',
    '    █▀▀▀▀▀█ ▀ ▄█▄▄█ █ █▀▀▀▀▀█    ',
    '    █ ███ █ ▀█   ██▀  █ ███ █    ',
    '    █ ▀▀▀ █ ▄▄█ ▄█▀   █ ▀▀▀ █    ',
    '    ▀▀▀▀▀▀▀ ▀ ▀ ▀ █ █ ▀▀▀▀▀▀▀    ',
    '    █▄█ ▄ ▀█▄▀▀█▄▄ ▄█▄▄█ ▄▀▄█    ',
    '    ▀█ ▄▄█▀█▄██▀█ ▄█▄▄█▄ █▀ ▀    ',
    '    ▀ ▄▄█▄▀▀ ▄  █▄ ██▀█▄   ▄█    ',
    '    ▀▀▀▄ █▀▀ ▀█▄█▀▄█▄ ▄▄ ▀▀ ▀    ',
    '    ▀▀▀▀ ▀▀ ██   █▀ █▀▀▀█ ▄▀▄    ',
    '    █▀▀▀▀▀█ ▀▀█▀ ▄ ▄█ ▀ █▀ ▄▀    ',
    '    █ ███ █   ▀▀█▀ ███▀███▄▄▀    ',
    '    █ ▀▀▀ █ ▀█▄▄█▀█ ▄█ ▄█  ▀▀    ',
    '    ▀▀▀▀▀▀▀ ▀▀▀  ▀▀ ▀    ▀  ▀    ',
    '                                 ',
    '                                 '].join('\n')

  t.plan(6)

  var fsStub = sinon.stub(fs, 'writeFileSync', function (path, buffer) {
    t.equal(path, fileName,
      'Should save file with correct file name')

    t.equal(buffer, expectedOutput,
      'Should write correct content')
  }).reset()

  QRCode.toFile(fileName, 'http://www.google.com', function (err) {
    t.ok(!err, 'There should be no error ' + err)
  })

  QRCode.toFile(fileName, 'http://www.google.com', {
    errorCorrectionLevel: 'M',
    type: 'utf8'
  }, function (err) {
    t.ok(!err, 'There should be no errors if file type is specified')
  })

  fsStub.restore()
})
