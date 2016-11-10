var Utils = require('./utils')
var ECCode = require('./error-correction-code')
var ECLevel = require('./error-correction-level')
var ByteData = require('./byte-data')

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

  if ('getLength' in data) dataLength = data.getLength()
  else if (Buffer.isBuffer(data)) dataLength = data.length
  else dataLength = Buffer.byteLength(data)

  var ecl = errorCorrectionLevel

  if (typeof ecl === 'undefined') ecl = ECLevel.H

  return getBestVersionForDataLength(dataLength, ecl)
}
