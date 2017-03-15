var test = require('tap').test
var ECLevel = require('core/error-correction-level')
var Version = require('core/version')
var QRCode = require('core/qrcode')
var toSJIS = require('helper/to-sjis')

test('QRCode interface', function (t) {
  t.throw(function () { QRCode() }, 'Should throw if no data is provided')
  t.notThrow(function () { QRCode('1234567') }, 'Should not throw')

  var qr = new QRCode('a123456A', { version: 1, errorCorrectionLevel: 'H' })
  t.equal(qr.getModuleCount(), 21, 'Should return correct modules count')

  var outOfBoundCoords = [
    [0, 22], [22, 0], [22, 22], [-1, 0], [0, -1]
  ]

  outOfBoundCoords.forEach(function (c) {
    t.throw(function () { qr.isDark(c[0], c[1]) }, 'Should throw with wrong coords')
  })

  var darkModule = qr.isDark(qr.getModuleCount() - 8, 8)
  t.ok(darkModule, 'Should have a dark module at coords [size-8][8]')

  t.throw(function () {
    qr = new QRCode({})
  }, 'Should throw if invalid data is passed')

  t.notThrow(function () {
    qr = new QRCode('AAAAA00000', { version: 5 })
  }, 'Should accept data as string')

  t.notThrow(function () {
    qr = new QRCode([
      { data: 'ABCDEFG', mode: 'alphanumeric' },
      { data: 'abcdefg' },
      { data: '晒三', mode: 'kanji' },
      { data: '0123456', mode: 'numeric' }
    ], { toSJISFunc: toSJIS })
  }, 'Should accept data as array of objects')

  t.notThrow(function () {
    qr = new QRCode('AAAAA00000', { errorCorrectionLevel: 'quartile' })
    qr = new QRCode('AAAAA00000', { errorCorrectionLevel: 'q' })
  }, 'Should accept errorCorrectionLevel as string')

  t.end()
})

test('QRCode error correction', function (t) {
  var qr
  var ecValues = [
    { name: ['l', 'low'], level: ECLevel.L },
    { name: ['m', 'medium'], level: ECLevel.M },
    { name: ['q', 'quartile'], level: ECLevel.Q },
    { name: ['h', 'high'], level: ECLevel.H }
  ]

  for (var l = 0; l < ecValues.length; l++) {
    for (var i = 0; i < ecValues[l].name.length; i++) {
      t.notThrow(function () {
        qr = new QRCode('ABCDEFG', { errorCorrectionLevel: ecValues[l].name[i] })
      }, 'Should accept errorCorrectionLevel value: ' + ecValues[l].name[i])

      t.deepEqual(qr.errorCorrectionLevel, ecValues[l].level,
        'Should have correct errorCorrectionLevel value')

      t.notThrow(function () {
        qr = new QRCode('ABCDEFG', { errorCorrectionLevel: ecValues[l].name[i].toUpperCase() })
      }, 'Should accept errorCorrectionLevel value: ' + ecValues[l].name[i].toUpperCase())

      t.deepEqual(qr.errorCorrectionLevel, ecValues[l].level,
        'Should have correct errorCorrectionLevel value')
    }
  }

  qr = new QRCode('ABCDEFG')
  t.equal(qr.errorCorrectionLevel, ECLevel.M, 'Should set default EC level to M')

  t.end()
})

test('QRCode version', function (t) {
  var qr = new QRCode('data', { version: 9, errorCorrectionLevel: ECLevel.M })

  t.equal(qr.version, 9, 'Should create qrcode with correct version')
  t.equal(qr.errorCorrectionLevel, ECLevel.M, 'Should set correct EC level')

  t.throw(function () {
    qr = new QRCode(new Array(Version.getCapacity(2, ECLevel.H)).join('a'),
      { version: 1, errorCorrectionLevel: ECLevel.H })
  }, 'Should throw if data cannot be contained with chosen version')

  t.throw(function () {
    qr = new QRCode(new Array(Version.getCapacity(40, ECLevel.H) + 2).join('a'),
      { version: 40, errorCorrectionLevel: ECLevel.H })
  }, 'Should throw if data cannot be contained in a qr code')

  t.notThrow(function () {
    qr = new QRCode('abcdefg', { version: 'invalid' })
  }, 'Should use best version if the one provided is invalid')

  t.end()
})

test('QRCode capacity', function (t) {
  var qr

  qr = new QRCode([{ data: 'abcdefg', mode: 'byte' }])
  t.equal(qr.version, 1, 'Should contain 7 byte characters')

  qr = new QRCode([{ data: '12345678901234567', mode: 'numeric' }])
  t.equal(qr.version, 1, 'Should contain 17 numeric characters')

  qr = new QRCode([{ data: 'ABCDEFGHIL', mode: 'alphanumeric' }])
  t.equal(qr.version, 1, 'Should contain 10 alphanumeric characters')

  qr = new QRCode([{ data: 'ＡＩぐサ', mode: 'kanji' }],
    { toSJISFunc: toSJIS })
  t.equal(qr.version, 1, 'Should contain 4 kanji characters')

  t.end()
})
