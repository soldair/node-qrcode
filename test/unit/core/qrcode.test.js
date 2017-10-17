var test = require('tap').test
var ECLevel = require('core/error-correction-level')
var Version = require('core/version')
var QRCode = require('core/qrcode')
var toSJIS = require('helper/to-sjis')

test('QRCode interface', function (t) {
  t.type(QRCode.create, 'function', 'Should have "create" function')
  t.throw(function () { QRCode.create() }, 'Should throw if no data is provided')
  t.notThrow(function () { QRCode.create('1234567') }, 'Should not throw')

  var qr = QRCode.create('a123456A', {
    version: 1,
    maskPattern: 1,
    errorCorrectionLevel: 'H'
  })
  t.equal(qr.modules.size, 21, 'Should return correct modules count')
  t.equal(qr.maskPattern, 1, 'Should return correct mask pattern')

  var darkModule = qr.modules.get(qr.modules.size - 8, 8)
  t.ok(darkModule, 'Should have a dark module at coords [size-8][8]')

  t.throw(function () {
    qr = QRCode.create({})
  }, 'Should throw if invalid data is passed')

  t.notThrow(function () {
    qr = QRCode.create('AAAAA00000', { version: 5 })
  }, 'Should accept data as string')

  t.notThrow(function () {
    qr = QRCode.create([
      { data: 'ABCDEFG', mode: 'alphanumeric' },
      { data: 'abcdefg' },
      { data: '晒三', mode: 'kanji' },
      { data: '0123456', mode: 'numeric' }
    ], { toSJISFunc: toSJIS })
  }, 'Should accept data as array of objects')

  t.notThrow(function () {
    qr = QRCode.create('AAAAA00000', { errorCorrectionLevel: 'quartile' })
    qr = QRCode.create('AAAAA00000', { errorCorrectionLevel: 'q' })
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
        qr = QRCode.create('ABCDEFG', { errorCorrectionLevel: ecValues[l].name[i] })
      }, 'Should accept errorCorrectionLevel value: ' + ecValues[l].name[i])

      t.deepEqual(qr.errorCorrectionLevel, ecValues[l].level,
        'Should have correct errorCorrectionLevel value')

      t.notThrow(function () {
        qr = QRCode.create('ABCDEFG', { errorCorrectionLevel: ecValues[l].name[i].toUpperCase() })
      }, 'Should accept errorCorrectionLevel value: ' + ecValues[l].name[i].toUpperCase())

      t.deepEqual(qr.errorCorrectionLevel, ecValues[l].level,
        'Should have correct errorCorrectionLevel value')
    }
  }

  qr = QRCode.create('ABCDEFG')
  t.equal(qr.errorCorrectionLevel, ECLevel.M, 'Should set default EC level to M')

  t.end()
})

test('QRCode version', function (t) {
  var qr = QRCode.create('data', { version: 9, errorCorrectionLevel: ECLevel.M })

  t.equal(qr.version, 9, 'Should create qrcode with correct version')
  t.equal(qr.errorCorrectionLevel, ECLevel.M, 'Should set correct EC level')

  t.throw(function () {
    qr = QRCode.create(new Array(Version.getCapacity(2, ECLevel.H)).join('a'),
      { version: 1, errorCorrectionLevel: ECLevel.H })
  }, 'Should throw if data cannot be contained with chosen version')

  t.throw(function () {
    qr = QRCode.create(new Array(Version.getCapacity(40, ECLevel.H) + 2).join('a'),
      { version: 40, errorCorrectionLevel: ECLevel.H })
  }, 'Should throw if data cannot be contained in a qr code')

  t.notThrow(function () {
    qr = QRCode.create('abcdefg', { version: 'invalid' })
  }, 'Should use best version if the one provided is invalid')

  t.end()
})

test('QRCode capacity', function (t) {
  var qr

  qr = QRCode.create([{ data: 'abcdefg', mode: 'byte' }])
  t.equal(qr.version, 1, 'Should contain 7 byte characters')

  qr = QRCode.create([{ data: '12345678901234567', mode: 'numeric' }])
  t.equal(qr.version, 1, 'Should contain 17 numeric characters')

  qr = QRCode.create([{ data: 'ABCDEFGHIL', mode: 'alphanumeric' }])
  t.equal(qr.version, 1, 'Should contain 10 alphanumeric characters')

  qr = QRCode.create([{ data: 'ＡＩぐサ', mode: 'kanji' }],
    { toSJISFunc: toSJIS })
  t.equal(qr.version, 1, 'Should contain 4 kanji characters')

  t.end()
})
