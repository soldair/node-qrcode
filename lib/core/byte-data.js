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
  }
}

module.exports = ByteData;
