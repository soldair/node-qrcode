var GF = require('./galois-field')

function Polynomial(num, shift) {

  if (num.length == undefined) {
    throw new Error(num.length + "/" + shift);
  }

  var offset = 0;

  while (offset < num.length && num[offset] == 0) {
    offset++;
  }

  this.num = new Array(num.length - offset + shift);
  for (var i = 0; i < num.length - offset; i++) {
    this.num[i] = num[i + offset];
  }
}

Polynomial.prototype = {

  get : function(index) {
    return this.num[index];
  },
  
  getLength : function() {
    return this.num.length;
  },
  
  multiply : function(e) {
  
    var num = new Array(this.getLength() + e.getLength() - 1);
  
    for (var i = 0; i < this.getLength(); i++) {
      for (var j = 0; j < e.getLength(); j++) {
        num[i + j] ^= GF.exp(GF.log(this.get(i) ) + GF.log(e.get(j) ) );
      }
    }
  
    return new Polynomial(num, 0);
  },
  
  mod : function(e) {
  
    if (this.getLength() - e.getLength() < 0) {
      return this;
    }
  
    var ratio = GF.log(this.get(0) ) - GF.log(e.get(0) );
  
    var num = new Array(this.getLength() );
    
    for (var i = 0; i < this.getLength(); i++) {
      num[i] = this.get(i);
    }
    
    for (var i = 0; i < e.getLength(); i++) {
      num[i] ^= GF.exp(GF.log(e.get(i) ) + ratio);
    }
  
    // recursive call
    return new Polynomial(num, 0).mod(e);
  }
};

module.exports = Polynomial
