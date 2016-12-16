var Buffer = require('../utils/buffer')
var Utils = require('./utils')
var ECCode = require('./error-correction-code')
var ECLevel = require('./error-correction-level')
var ByteData = require('./byte-data')

// Generator polynomial used to encode version information
var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0)
var G18_BCH = Utils.getBCHDigit(G18)

var getBestVersionForDataLength = function getBestVersionForDataLength (length, errorCorrectionLevel) {
  for (var currentVersion = 1; currentVersion <= 40; currentVersion++) {
    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel)) return currentVersion
  }

  return undefined
}

/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
exports.isValidVersion = function isValidVersion (version) {
  return !isNaN(version) && version >= 1 && version <= 40
}

/**
 * Returns how much data can be stored with the specified QR code version
 * and error correction level
 *
 * @param  {Number} version              QR Code version (1-40)
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Quantity of storable data
 */
exports.getCapacity = function getCapacity (version, errorCorrectionLevel) {
  if (!exports.isValidVersion(version)) {
    throw new Error('Invalid QR Code version')
  }

  // Total codewords for this QR code version (Data + Error correction)
  var totalCodewords = Utils.getSymbolTotalCodewords(version)

  // Total number of error correction codewords
  var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)

  // Total number of data codewords
  var dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8

  // Character count indicator + mode indicator bits
  var reservedBits = ByteData.getCharCountIndicator(version) + 4

  // Return max number of storable codewords
  return Math.floor((dataTotalCodewordsBits - reservedBits) / 8)
}

/**
 * Returns the minimum version needed to contain the amount of data
 *
 * @param  {Buffer, Array, ByteData} data    Data buffer
 * @param  {Number} [errorCorrectionLevel=H] Error correction level
 * @return {Number}                          QR Code version
 */
exports.getBestVersionForData = function getBestVersionForData (data, errorCorrectionLevel) {
  var dataLength

  if (data instanceof ByteData) dataLength = data.getLength()
  else if (Buffer.isBuffer(data)) dataLength = data.length
  else dataLength = new Buffer(data).length

  var ecl = errorCorrectionLevel

  if (typeof ecl === 'undefined') ecl = ECLevel.H

  return getBestVersionForDataLength(dataLength, ecl)
}

/**
 * Returns version information with relative error correction bits
 *
 * The version information is included in QR Code symbols of version 7 or larger.
 * It consists of an 18-bit sequence containing 6 data bits,
 * with 12 error correction bits calculated using the (18, 6) Golay code.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Encoded version info bits
 */
exports.getEncodedBits = function getEncodedBits (version) {
  if (!exports.isValidVersion(version) || version < 7) {
    throw new Error('Invalid QR Code version')
  }

  var d = version << 12

  while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
    d ^= (G18 << (Utils.getBCHDigit(d) - G18_BCH))
  }

  return (version << 12) | d
}
