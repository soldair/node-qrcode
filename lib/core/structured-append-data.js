var Mode = require('./mode')

function StructuredAppendData (data) {
  this.mode = Mode.STRUCTURED_APPEND
  this.data = data
}

StructuredAppendData.getBitsLength = function getBitsLength () {
  return 16
}

StructuredAppendData.prototype.getLength = function getLength () {
  return 0
}

StructuredAppendData.prototype.getBitsLength = function getBitsLength () {
  return StructuredAppendData.getBitsLength()
}

StructuredAppendData.prototype.write = function (bitBuffer) {
  bitBuffer.put(this.data.position, 4)
  bitBuffer.put(this.data.total, 4)
  bitBuffer.put(this.data.parity, 8)
}

module.exports = StructuredAppendData
