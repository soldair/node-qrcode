import * as GF from './galois-field.js'
export function mul (p1, p2) {
  const coeff = new Uint8Array(p1.length + p2.length - 1)
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      coeff[i + j] ^= GF.mul(p1[i], p2[j])
    }
  }
  return coeff
}
export function mod (divident, divisor) {
  let result = new Uint8Array(divident)
  while ((result.length - divisor.length) >= 0) {
    const coeff = result[0]
    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= GF.mul(divisor[i], coeff)
    }
    // remove all zeros from buffer head
    let offset = 0
    while (offset < result.length && result[offset] === 0) { offset++ }
    result = result.slice(offset)
  }
  return result
}
export function generateECPolynomial (degree) {
  let poly = new Uint8Array([1])
  for (let i = 0; i < degree; i++) {
    poly = mul(poly, new Uint8Array([1, GF.exp(i)]))
  }
  return poly
}
