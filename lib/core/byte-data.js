var Mode = require('./mode')

function ByteData (data) {
  this.mode = Mode.BYTE
  this.data = new Buffer(data)
}

ByteData.prototype = {
  getLength: function (buffer) {
    return this.data.length
  },

  write: function (buffer) {
    for (var i = 0, l = this.data.length; i < l; i++) {
      buffer.put(this.data[i], 8)
    }
  },

  getCharCountIndicator: function (version) {
    if (version >= 1 && version < 10) {
      // 1 - 9
      return 8
    } else if (version < 41) {
      // 10 - 40
      return 16
    } else {
      throw new Error('version: ' + version)
    }
  }
}

module.exports = ByteData
