var stream = require('stream')
var util = require('util')

function WritableStream () {
  stream.Writable.call(this)
  this.forceError = false

  this.once('finish', function () {
    this.close()
  })
}

util.inherits(WritableStream, stream.Writable)

WritableStream.prototype._write = function (data, encoding, cb) {
  if (this.forceError) this.emit('error', new Error('Fake error'))
  cb(this.forceError || null)
}

WritableStream.prototype.close = function (cb) {
  this.emit('close')
  if (cb) cb()
}

WritableStream.prototype.forceErrorOnWrite = function () {
  this.forceError = true
  return this
}

module.exports = WritableStream
