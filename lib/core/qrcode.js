var Utils = require('./utils')
var ECLevel = require('./error-correction-level')
var ByteData = require('./byte-data')
var BitBuffer = require('./bit-buffer')
var BitMatrix = require('./bit-matrix')
var AlignmentPattern = require('./alignment-pattern')
var FinderPattern = require('./finder-pattern')
var MaskPattern = require('./mask-pattern')
var ECCode = require('./error-correction-code')
var ReedSolomonEncoder = require('./reed-solomon-encoder')
var Version = require('./version')

/**
 * QRCode for JavaScript
 *
 * modified by Ryan Day for nodejs support
 * Copyright (c) 2011 Ryan Day
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * EXPORTS:
 *  {
 *  QRCode:QRCode
 *  QRErrorCorrectLevel:QRErrorCorrectLevel
 *  }
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
*/

// ---------------------------------------------------------------------
// QRCode
// ---------------------------------------------------------------------

exports.QRCode = QRCode
exports.QRErrorCorrectLevel = ECLevel

function QRCode (typeNumber, errorCorrectLevel) {
  this.typeNumber = typeNumber
  this.errorCorrectLevel = errorCorrectLevel
  this.modules = null
  this.moduleCount = 0
  this.dataCache = null
  this.data = null
}

QRCode.prototype = {

  addData: function (data) {
    if (this.data) this.data.append(data)
    else this.data = new ByteData(data)

    this.dataCache = null
  },

  isDark: function (row, col) {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      throw new Error(row + ',' + col)
    }

    return this.modules.get(row, col)
  },

  getModuleCount: function () {
    return this.moduleCount
  },

  make: function () {
    this.makeImpl(false, this.getBestMaskPattern())
  },

  makeImpl: function (test, maskPattern) {
    if (this.dataCache === null) {
      // Use higher error correction level as default
      if (typeof this.errorCorrectLevel === 'undefined') this.errorCorrectLevel = ECLevel.H

      // Get the min version that can contain data
      var bestVersion = Version.getBestVersionForData(this.data, this.errorCorrectLevel)

      // If no version is found, data cannot be stored
      if (!bestVersion) {
        throw new Error('The amount of data is too big to be stored in a QR Code')
      }

      // If not specified, use min version as default
      if (!this.typeNumber) {
        this.typeNumber = bestVersion

      // Check if the specified version can contain the data
      } else if (this.typeNumber < bestVersion) {
        throw new Error('\n' +
          'The chosen QR Code version cannot contain this amount of data.\n' +
          'Max characters allowed with current config: ' +
            Version.getCapacity(this.typeNumber, this.errorCorrectLevel) + '\n' +
          'Minimum version required to store current data: ' + bestVersion + '\n'
        )
      }

      this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.data)
    }

    // Allocate matrix buffer
    this.moduleCount = Utils.getSymbolSize(this.typeNumber)
    this.modules = new BitMatrix(this.moduleCount)

    this.setupPositionProbePattern()
    this.setupPositionAdjustPattern()
    this.setupTimingPattern()
    this.setupTypeInfo(test, maskPattern)

    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test)
    }

    this.mapData(this.dataCache, maskPattern)
  },

  setupPositionProbePattern: function () {
    var pos = FinderPattern.getPositions(this.typeNumber)
    for (var i = 0; i < pos.length; i++) {
      var row = pos[i][0]
      var col = pos[i][1]

      for (var r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue

        for (var c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue

          if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            this.modules.set(row + r, col + c, true, true)
          } else {
            this.modules.set(row + r, col + c, false, true)
          }
        }
      }
    }
  },

  getBestMaskPattern: function () {
    var minLostPoint = 0
    var pattern = 0

    for (var i = 0; i < 8; i++) {
      this.makeImpl(true, i)

      var lostPoint = Utils.getLostPoint(this)

      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint
        pattern = i
      }
    }

    return pattern
  },

  setupTimingPattern: function () {
    for (var r = 8; r < this.moduleCount - 8; r++) {
      var value = r % 2 === 0
      this.modules.set(r, 6, value, true)
      this.modules.set(6, r, value, true)
    }
  },

  setupPositionAdjustPattern: function () {
    var pos = AlignmentPattern.getPositions(this.typeNumber)

    for (var i = 0; i < pos.length; i++) {
      var row = pos[i][0]
      var col = pos[i][1]

      for (var r = -2; r <= 2; r++) {
        for (var c = -2; c <= 2; c++) {
          if (r === -2 || r === 2 || c === -2 || c === 2 ||
            (r === 0 && c === 0)) {
            this.modules.set(row + r, col + c, true, true)
          } else {
            this.modules.set(row + r, col + c, false, true)
          }
        }
      }
    }
  },

  setupTypeNumber: function (test) {
    var bits = Utils.getBCHTypeNumber(this.typeNumber)
    var i, mod, row, col
    for (i = 0; i < 18; i++) {
      mod = (!test && ((bits >> i) & 1) === 1)
      row = Math.floor(i / 3)
      col = i % 3 + this.moduleCount - 8 - 3

      this.modules.set(row, col, mod, true)
      this.modules.set(col, row, mod, true)
    }
  },

  setupTypeInfo: function (test, maskPattern) {
    var data = (this.errorCorrectLevel << 3) | maskPattern
    var bits = Utils.getBCHTypeInfo(data)
    var i, mod

    for (i = 0; i < 15; i++) {
      mod = (!test && ((bits >> i) & 1) === 1)

      // vertical
      if (i < 6) {
        this.modules.set(i, 8, mod, true)
      } else if (i < 8) {
        this.modules.set(i + 1, 8, mod, true)
      } else {
        this.modules.set(this.moduleCount - 15 + i, 8, mod, true)
      }

      // horizontal
      if (i < 8) {
        this.modules.set(8, this.moduleCount - i - 1, mod, true)
      } else if (i < 9) {
        this.modules.set(8, 15 - i - 1 + 1, mod, true)
      } else {
        this.modules.set(8, 15 - i - 1, mod, true)
      }
    }

    // fixed module
    this.modules.set(this.moduleCount - 8, 8, !test, true)
  },

  mapData: function (data, maskPattern) {
    var inc = -1
    var row = this.moduleCount - 1
    var bitIndex = 7
    var byteIndex = 0

    for (var col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--

      while (true) {
        for (var c = 0; c < 2; c++) {
          if (!this.modules.isReserved(row, col - c)) {
            var dark = false

            if (byteIndex < data.length) {
              dark = (((data[byteIndex] >>> bitIndex) & 1) === 1)
            }

            var mask = MaskPattern.getMaskAt(maskPattern, row, col - c)

            dark = MaskPattern.applyMaskTo(dark, mask)

            this.modules.set(row, col - c, dark)
            bitIndex--

            if (bitIndex === -1) {
              byteIndex++
              bitIndex = 7
            }
          }
        }

        row += inc

        if (row < 0 || this.moduleCount <= row) {
          row -= inc
          inc = -inc
          break
        }
      }
    }
  }
}

QRCode.createData = function (version, errorCorrectionLevel, data) {
  // Prepare data buffer
  var buffer = new BitBuffer()

  // prefix data with mode indicator (4 bits in byte mode)
  buffer.put(data.mode, 4)

  // Prefix data with character count indicator.
  // The character count indicator is a string of bits that represents the number of characters
  // that are being encoded. The character count indicator must be placed after the mode indicator
  // and must be a certain number of bits long, depending on the QR version and data mode
  // @see {@link ByteData.getCharCountIndicator}.
  buffer.put(data.getLength(), data.getCharCountIndicator(version))

  // add binary data sequence to buffer
  data.write(buffer)

  // Calculate required number of bits
  var totalCodewords = Utils.getSymbolTotalCodewords(version)
  var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)
  var dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8

  // Add a terminator.
  // If the bit string is shorter than the total number of required bits,
  // a terminator of up to four 0s must be added to the right side of the string.
  // If the bit string is more than four bits shorter than the required number of bits,
  // add four 0s to the end.
  if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
    buffer.put(0, 4)
  }

  // If the bit string is fewer than four bits shorter, add only the number of 0s that
  // are needed to reach the required number of bits.

  // After adding the terminator, if the number of bits in the string is not a multiple of 8,
  // pad the string on the right with 0s to make the string's length a multiple of 8.
  while (buffer.getLengthInBits() % 8 !== 0) {
    buffer.putBit(0)
  }

  // Add pad bytes if the string is still shorter than the total number of required bits.
  // Extend the buffer to fill the data capacity of the symbol corresponding to
  // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
  // and 00010001 (0x11) alternately.
  var remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8
  for (var i = 0; i < remainingByte; i++) {
    buffer.put(i % 2 ? 0x11 : 0xEC, 8)
  }

  return QRCode.createCodewords(buffer, version, errorCorrectionLevel)
}

// Encode data buffer
QRCode.createCodewords = function createCodewords (bitBuffer, version, errorCorrectionLevel) {
  // Total codewords for this QR code version (Data + Error correction)
  var totalCodewords = Utils.getSymbolTotalCodewords(version)

  // Total number of error correction codewords
  var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)

  // Total number of data codewords
  var dataTotalCodewords = totalCodewords - ecTotalCodewords

  // Total number of blocks
  var ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel)

  // Calculate how many blocks each group should contain
  var blocksInGroup2 = totalCodewords % ecTotalBlocks
  var blocksInGroup1 = ecTotalBlocks - blocksInGroup2

  var totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks)

  var dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks)
  var dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1

  // Number of EC codewords is the same for both groups
  var ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1

  // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount
  var rs = new ReedSolomonEncoder(ecCount)

  var offset = 0
  var dcData = new Array(ecTotalBlocks)
  var ecData = new Array(ecTotalBlocks)
  var maxDataSize = 0
  var buffer = new Buffer(bitBuffer.buffer)

  // Divide the buffer into the required number of blocks
  for (var b = 0; b < ecTotalBlocks; b++) {
    var dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2

    // extract a block of data from buffer
    dcData[b] = buffer.slice(offset, offset + dataSize)

    // Calculate EC codewords for this data block
    ecData[b] = rs.encode(dcData[b])

    offset += dataSize
    maxDataSize = Math.max(maxDataSize, dataSize)
  }

  // Create final data
  // Interleave the data and error correction codewords from each block
  var data = new Buffer(totalCodewords)
  var index = 0
  var i, r

  // Add data codewords
  for (i = 0; i < maxDataSize; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      if (i < dcData[r].length) {
        data[index++] = dcData[r][i]
      }
    }
  }

  // Apped EC codewords
  for (i = 0; i < ecCount; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      if (i < ecData[r].length) {
        data[index++] = ecData[r][i]
      }
    }
  }

  return data
}
