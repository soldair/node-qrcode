var Polynomial = require('./polynomial')

function ReedSolomonEncoder (degree) {
  this.genPoly = undefined
  if (degree) this.initialize(degree)
}

/**
 * Initialize the encoder.
 * The input param should correspond to the number of error correction codewords.
 *
 * @param  {Number} degree
 */
ReedSolomonEncoder.prototype.initialize = function initialize (degree) {
  // create an irreducible generator polynomial
  this.genPoly = Polynomial.generateECPolynomial(degree)
}

/**
 * Encodes a chunk of data
 *
 * @param  {Buffer} data Buffer containing input data
 * @return {Buffer}      Buffer containing encoded data
 */
ReedSolomonEncoder.prototype.encode = function encode (data) {
  if (!this.genPoly) {
    throw new Error('Encoder not initialized')
  }

  // Calculate EC for this data block
  // extends data size to data+genPoly size
  var pad = new Buffer(this.genPoly.length - 1).fill(0)
  var paddedData = Buffer.concat([data, pad], data.length + this.genPoly.length - 1)

  // The error correction codewords are the remainder after dividing the data codewords
  // by a generator polynomial
  var remainder = Polynomial.mod(paddedData, this.genPoly)

  // create EC data block
  var ecdata = new Buffer(this.genPoly.length - 1)

  for (var i = 0; i < ecdata.length; i++) {
    var modIndex = i + remainder.length - ecdata.length
    ecdata[i] = (modIndex >= 0) ? remainder[modIndex] : 0
  }

  return ecdata
}

module.exports = ReedSolomonEncoder
