/**
 * Data modes
 *
 * @type {Object}
 */
module.exports = {
  /**
   * Numeric mode encodes data from the decimal digit set (0 - 9) (byte values 30HEX to 39HEX).
   * Normally, 3 data characters are represented by 10 bits.
   */
  NUMERIC: 1 << 0,

  /**
   * Alphanumeric mode encodes data from a set of 45 characters,
   * i.e. 10 numeric digits (0 - 9),
   *      26 alphabetic characters (A - Z),
   *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
   * Normally, two input characters are represented by 11 bits.
   */
  ALPHA_NUM: 1 << 1,

  /**
   * In byte mode, data is encoded at 8 bits per character.
   */
  BYTE: 1 << 2,

  /**
   * The Kanji mode efficiently encodes Kanji characters in accordance with the Shift JIS system
   * based on JIS X 0208. The Shift JIS values are shifted from the JIS X 0208 values.
   * JIS X 0208 gives details of the shift coded representation.
   * Each two-byte character value is compacted to a 13-bit binary codeword.
   */
  KANJI: 1 << 3
}
