var Mode = require('./mode')
var bops = require('bops');

function ByteData(data) {
  this.mode = Mode.BYTE;
  this.data = data;
  var byteArray = [];
  
  this.parsedData = bops.from(data);
}

ByteData.prototype = {
  getLength: function (buffer) {
    return this.parsedData.length;
  },
  write: function (buffer) {
    for (var i = 0, l = this.parsedData.length; i < l; i++) {
      buffer.put(this.parsedData[i], 8);
    }
  }
};

module.exports = ByteData;
