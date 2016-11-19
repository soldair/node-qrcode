var test = require('tap').test
var ByteData = require('../byte-data')
var ECLevel = require('../error-correction-level')
var Version = require('../version')
var QRCode = require('../qrcode')

test('QRCode interface', function (t) {
  var qr
  t.notThrow(function () { qr = new QRCode() }, 'Should not throw')

  qr.addData('1234567')
  t.ok(qr.data instanceof ByteData, 'Should add data in correct mode')

  qr.make()
  t.equal(qr.version, 1, 'Should create qrcode with correct version')
  t.equal(qr.getModuleCount(), 21, 'Should return correct modules count')
  t.equal(qr.errorCorrectionLevel, ECLevel.H, 'Should set default EC level to H')

  var outOfBoundCoords = [
    [0, 22], [22, 0], [22, 22], [-1, 0], [0, -1]
  ]

  outOfBoundCoords.forEach(function (c) {
    t.throw(function () { qr.isDark(c[0], c[1]) }, 'Should throw with wrong coords')
  })

  var darkModule = qr.isDark(qr.getModuleCount() - 8, 8)
  t.ok(darkModule, 'Should have a dark module at coords [size-8][8]')

  t.end()
})

test('QRCode version', function (t) {
  var qr = new QRCode(7, ECLevel.L)
  qr.addData('data')
  qr.make()
  t.equal(qr.version, 7, 'Should create qrcode with correct version')
  t.equal(qr.errorCorrectionLevel, ECLevel.L, 'Should set correct EC level')

  qr = new QRCode(1, ECLevel.H)
  qr.addData(new Array(Version.getCapacity(2, ECLevel.H)).join('-'))
  t.throw(function () { qr.make() }, 'Should throw if data cannot be contained with chosen version')

  qr = new QRCode(40, ECLevel.H)
  qr.addData(new Array(Version.getCapacity(40, ECLevel.H) + 2).join('-'))
  t.throw(function () { qr.make() }, 'Should throw if data cannot be contained in a qr code')

  t.end()
})
