var test = require('tap').test
var sinon = require('sinon')
var fs = require('fs')
var stream = require('stream')
var QRCode = require('lib')

test('toFileStream png', function (t) {
  var fileName = 'qrimage.png'

  t.plan(8)

  t.throw(function () { QRCode.toFileStream('some text', function () {}) },
    'Should throw if path is not provided')

  t.throw(function () { QRCode.toFileStream(fileName) },
    'Should throw if text is not provided')

  t.throw(function () { QRCode.toFileStream(fileName, 'some text') },
    'Should throw if a callback is not provided')

  var fsStub = sinon.stub(fs, 'createWriteStream', function (path) {
    t.equal(path, fileName,
      'Should save file with correct file name')

    var mockStream = new stream.Writable()
    mockStream._write = function () {}

    return mockStream
  })

  QRCode.toFileStream(fileName, 'i am a pony!', function (err, fstream) {
    t.ok(!err, 'There should be no error')
    t.ok(fstream instanceof stream.Writable,
    'Should return a writable stream')
  })

  fsStub.restore()
  fsStub = sinon.stub(fs, 'createWriteStream').throws()
  fsStub.reset()

  QRCode.toFileStream(fileName, 'i am a pony!', function (err, fstream) {
    t.ok(err, 'There should be an error ')
    t.ok(!fstream, 'Should not return a stream')
  })

  fsStub.restore()
})
