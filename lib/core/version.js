import * as Utils from './utils.js'
import * as ECCode from './error-correction-code.js'
import * as ECLevel from './error-correction-level.js'
import * as Mode from './mode.js'
import * as VersionCheck from './version-check.js'
// Generator polynomial used to encode version information
const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0)
const G18_BCH = Utils.getBCHDigit(G18)
function getBestVersionForDataLength (mode, length, errorCorrectionLevel) {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    if (length <= getCapacity(currentVersion, errorCorrectionLevel, mode)) {
      return currentVersion
    }
  }
  return undefined
}
function getReservedBitsCount (mode, version) {
  // Character count indicator + mode indicator bits
  return Mode.getCharCountIndicator(mode, version) + 4
}
function getTotalBitsFromDataArray (segments, version) {
  let totalBits = 0
  segments.forEach(function (data) {
    const reservedBits = getReservedBitsCount(data.mode, version)
    totalBits += reservedBits + data.getBitsLength()
  })
  return totalBits
}
function getBestVersionForMixedData (segments, errorCorrectionLevel) {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    const length = getTotalBitsFromDataArray(segments, currentVersion)
    if (length <= getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
      return currentVersion
    }
  }
  return undefined
}
export function from (value, defaultValue) {
  if (VersionCheck.isValid(value)) {
    return parseInt(value, 10)
  }
  return defaultValue
}
export function getCapacity (version, errorCorrectionLevel, mode) {
  if (!VersionCheck.isValid(version)) {
    throw new Error('Invalid QR Code version')
  }
  // Use Byte mode as default
  if (typeof mode === 'undefined') { mode = Mode.BYTE }
  // Total codewords for this QR code version (Data + Error correction)
  const totalCodewords = Utils.getSymbolTotalCodewords(version)
  // Total number of error correction codewords
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)
  // Total number of data codewords
  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8
  if (mode === Mode.MIXED) { return dataTotalCodewordsBits }
  const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version)
  // Return max number of storable codewords
  switch (mode) {
    case Mode.NUMERIC:
      return Math.floor((usableBits / 10) * 3)
    case Mode.ALPHANUMERIC:
      return Math.floor((usableBits / 11) * 2)
    case Mode.KANJI:
      return Math.floor(usableBits / 13)
    case Mode.BYTE:
    default:
      return Math.floor(usableBits / 8)
  }
}
export function getBestVersionForData (data, errorCorrectionLevel) {
  let seg
  const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M)
  if (Array.isArray(data)) {
    if (data.length > 1) {
      return getBestVersionForMixedData(data, ecl)
    }
    if (data.length === 0) {
      return 1
    }
    seg = data[0]
  } else {
    seg = data
  }
  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl)
}
export function getEncodedBits (version) {
  if (!VersionCheck.isValid(version) || version < 7) {
    throw new Error('Invalid QR Code version')
  }
  let d = version << 12
  while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
    d ^= (G18 << (Utils.getBCHDigit(d) - G18_BCH))
  }
  return (version << 12) | d
}
