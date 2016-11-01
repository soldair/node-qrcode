var MaskPattern = require('./mask-pattern')
var Mode = require('./mode')
var GF = require('./galois-field')
var Polynomial = require('./polynomial')

module.exports = {
  G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
  G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
  G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)  | (1 << 4) | (1 << 1),

  getBCHTypeInfo : function(data) {
    var d = data << 10;
    while (this.getBCHDigit(d) - this.getBCHDigit(this.G15) >= 0) {
      d ^= (this.G15 << (this.getBCHDigit(d) - this.getBCHDigit(this.G15) ) );  
    }
    return ( (data << 10) | d) ^ this.G15_MASK;
  },

  getBCHTypeNumber : function(data) {
    var d = data << 12;
    while (this.getBCHDigit(d) - this.getBCHDigit(this.G18) >= 0) {
      d ^= (this.G18 << (this.getBCHDigit(d) - this.getBCHDigit(this.G18) ) );  
    }
    return (data << 12) | d;
  },

  getBCHDigit : function(data) {

    var digit = 0;

    while (data != 0) {
      digit++;
      data >>>= 1;
    }

    return digit;
  },

  getMask : function(maskPattern, i, j) {
    
    switch (maskPattern) {
      
    case MaskPattern.PATTERN000 : return (i + j) % 2 == 0;
    case MaskPattern.PATTERN001 : return i % 2 == 0;
    case MaskPattern.PATTERN010 : return j % 3 == 0;
    case MaskPattern.PATTERN011 : return (i + j) % 3 == 0;
    case MaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0;
    case MaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 == 0;
    case MaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 == 0;
    case MaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 == 0;

    default :
      throw new Error("bad maskPattern:" + maskPattern);
    }
  },

  getErrorCorrectPolynomial : function(errorCorrectLength) {

    var a = new Polynomial([1], 0);

    for (var i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new Polynomial([1, GF.exp(i)], 0) );
    }

    return a;
  },

  getLengthInBits : function(mode, type) {

    if (1 <= type && type < 10) {

      // 1 - 9

      switch(mode) {
      case Mode.MODE_NUMBER   : return 10;
      case Mode.MODE_ALPHA_NUM  : return 9;
      case Mode.MODE_8BIT_BYTE  : return 8;
      case Mode.MODE_KANJI    : return 8;
      default :
        throw new Error("mode:" + mode);
      }

    } else if (type < 27) {

      // 10 - 26

      switch(mode) {
      case Mode.MODE_NUMBER   : return 12;
      case Mode.MODE_ALPHA_NUM  : return 11;
      case Mode.MODE_8BIT_BYTE  : return 16;
      case Mode.MODE_KANJI    : return 10;
      default :
        throw new Error("mode:" + mode);
      }

    } else if (type < 41) {

      // 27 - 40

      switch(mode) {
      case Mode.MODE_NUMBER   : return 14;
      case Mode.MODE_ALPHA_NUM  : return 13;
      case Mode.MODE_8BIT_BYTE  : return 16;
      case Mode.MODE_KANJI    : return 12;
      default :
        throw new Error("mode:" + mode);
      }

    } else {
      throw new Error("type:" + type);
    }
  },

  getLostPoint : function(qrCode) {
    
    var moduleCount = qrCode.getModuleCount();
    
    var lostPoint = 0;
    
    // LEVEL1
    
    for (var row = 0; row < moduleCount; row++) {

      for (var col = 0; col < moduleCount; col++) {

        var sameCount = 0;
        var dark = qrCode.isDark(row, col);

      for (var r = -1; r <= 1; r++) {

          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }

          for (var c = -1; c <= 1; c++) {

            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }

            if (r == 0 && c == 0) {
              continue;
            }

            if (dark == qrCode.isDark(row + r, col + c) ) {
              sameCount++;
            }
          }
        }

        if (sameCount > 5) {
          lostPoint += (3 + sameCount - 5);
        }
      }
    }

    // LEVEL2

    for (var row = 0; row < moduleCount - 1; row++) {
      for (var col = 0; col < moduleCount - 1; col++) {
        var count = 0;
        if (qrCode.isDark(row,     col    ) ) count++;
        if (qrCode.isDark(row + 1, col    ) ) count++;
        if (qrCode.isDark(row,     col + 1) ) count++;
        if (qrCode.isDark(row + 1, col + 1) ) count++;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }

    // LEVEL3

    for (var row = 0; row < moduleCount; row++) {
      for (var col = 0; col < moduleCount - 6; col++) {
        if (qrCode.isDark(row, col)
            && !qrCode.isDark(row, col + 1)
            &&  qrCode.isDark(row, col + 2)
            &&  qrCode.isDark(row, col + 3)
            &&  qrCode.isDark(row, col + 4)
            && !qrCode.isDark(row, col + 5)
            &&  qrCode.isDark(row, col + 6) ) {
          lostPoint += 40;
        }
      }
    }

    for (var col = 0; col < moduleCount; col++) {
      for (var row = 0; row < moduleCount - 6; row++) {
        if (qrCode.isDark(row, col)
            && !qrCode.isDark(row + 1, col)
            &&  qrCode.isDark(row + 2, col)
            &&  qrCode.isDark(row + 3, col)
            &&  qrCode.isDark(row + 4, col)
            && !qrCode.isDark(row + 5, col)
            &&  qrCode.isDark(row + 6, col) ) {
          lostPoint += 40;
        }
      }
    }

    // LEVEL4
    
    var darkCount = 0;

    for (var col = 0; col < moduleCount; col++) {
      for (var row = 0; row < moduleCount; row++) {
        if (qrCode.isDark(row, col) ) {
          darkCount++;
        }
      }
    }
    
    var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;

    return lostPoint;   
  }
};
