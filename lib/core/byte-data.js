var Mode = require('./mode')

function ByteData (data) {
  this.mode = Mode.BYTE
  this.data = new Buffer(data)
}

ByteData.getCharCountIndicator = function getCharCountIndicator (version) {
  if (version >= 1 && version < 10) {
    // 1 - 9
    return 8
  } else if (version >= 10 && version < 41) {
    // 10 - 40
    return 16
  } else {
    throw new Error('version: ' + version)
  }
}

ByteData.prototype = {
  getLength: function (buffer) {
    return this.data.length
  },

  append: function (data) {
    this.data = Buffer.concat([this.data, new Buffer(data)])
    return this
  },

  write: function (buffer) {
    for (var i = 0, l = this.data.length; i < l; i++) {
      buffer.put(this.data[i], 8)
    }
  },

  getCharCountIndicator: ByteData.getCharCountIndicator
}

module.exports = ByteData
