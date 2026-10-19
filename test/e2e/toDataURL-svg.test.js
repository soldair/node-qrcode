const test = require('tap').test
const QRCode = require('lib')

test('toDataURL - svg callbacks and promises', async function (t) {
  const options = {
    type: 'svg',
    width: 116,
    margin: 4,
    color: { dark: '#123456', light: '#ffffff80' }
  }
  const text = 'Unicode: café & <qr>'
  const expected = await QRCode.toString(text, options)
  const url = await QRCode.toDataURL(text, options)
  t.match(url, /^data:image\/svg\+xml,/, 'SVG media type')
  t.equal(decodeURIComponent(url.split(',')[1]), expected, 'decode to the complete SVG')
  t.notMatch(url, /[<>#\n]/, 'escape markup and color fragment delimiters')
  t.match(expected, /width="116"/, 'preserve width option')
  t.match(expected, /stroke="#123456"/, 'preserve dark color')
  t.match(expected, /fill-opacity=".50"/, 'preserve alpha')

  await new Promise(function (resolve, reject) {
    QRCode.toDataURL(text, options, function (err, result) {
      if (err) return reject(err)
      t.equal(result, url, 'callback and Promise agree')
      resolve()
    })
  })
})

test('toDataURL - svg reports encoding errors', async function (t) {
  const options = { type: 'svg', version: 1, errorCorrectionLevel: 'H' }
  await t.rejects(QRCode.toDataURL('too long for a version one high correction code', options))
  let calls = 0
  QRCode.toDataURL('too long for a version one high correction code', options, function (err, url) {
    calls++
    t.ok(err, 'callback receives the encoding error')
    t.notOk(url, 'no partial data URL')
  })
  t.equal(calls, 1, 'callback called once')
})
