var GF = {
  log : function(n) {
  
    if (n < 1) {
      throw new Error("glog(" + n + ")");
    }
    
    return this.LOG_TABLE[n];
  },
  
  exp : function(n) {
  
    while (n < 0) {
      n += 255;
    }
  
    while (n >= 256) {
      n -= 255;
    }
  
    return this.EXP_TABLE[n];
  },
  
  EXP_TABLE : new Array(256),
  
  LOG_TABLE : new Array(256)

};
  
for (var i = 0; i < 8; i++) {
  GF.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
  GF.EXP_TABLE[i] = GF.EXP_TABLE[i - 4]
    ^ GF.EXP_TABLE[i - 5]
    ^ GF.EXP_TABLE[i - 6]
    ^ GF.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
  GF.LOG_TABLE[GF.EXP_TABLE[i] ] = i;
}

module.exports = GF

