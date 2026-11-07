const test = require('tap').test
const sinon = require('sinon')
const fs = require('fs')
const htmlparser = require('htmlparser2')
const QRCode = require('core/qrcode')
const SvgRenderer = require('renderer/svg')

function getExpectedViewbox (size, margin) {
  const expectedQrCodeSize = size + margin * 2
  return '0 0 ' + expectedQrCodeSize + ' ' + expectedQrCodeSize
}

function testSvgFragment (t, svgFragment, expectedTags) {
  return new Promise(function (resolve, reject) {
    const parser = new htmlparser.Parser({
      onopentag: function (name, attribs) {
        const tag = expectedTags.shift()

        t.equal(tag.name, name,
          'Should have a ' + tag.name + ' tag')

        tag.attribs.forEach(function (attr) {
          t.equal(attribs[attr.name], attr.value.toString(),
            'Should have attrib ' + attr.name + ' with value ' + attr.value)
        })
      },

      onend: function () {
        resolve()
      },

      onerror: function (e) {
        reject(e)
      }
    }, { decodeEntities: true })

    parser.write(svgFragment)
    parser.end()
  })
}

function buildTest (t, data, opts, expectedTags) {
  const svg = SvgRenderer.render(data, opts)
  return testSvgFragment(t, svg, expectedTags.slice())
}

test('svgrender interface', function (t) {
  t.type(SvgRenderer.render, 'function',
    'Should have render function')

  t.type(SvgRenderer.renderToFile, 'function',
    'Should have renderToFile function')

  t.end()
})

test('Svg render', function (t) {
  const tests = []

  const data = QRCode.create('sample text', { version: 2 })
  const size = data.modules.size

  tests.push(buildTest(t, data, {
    scale: 4,
    margin: 4,
    color: {
      light: '#ffffff80'
    }
  }, [
    {
      name: 'svg',
      attribs: [
        { name: 'viewbox', value: getExpectedViewbox(size, 4) }
      ]
    },
    {
      name: 'path',
      attribs: [
        { name: 'fill', value: '#ffffff' },
        { name: 'fill-opacity', value: '.50' }
      ]
    },
    {
      name: 'path',
      attribs: [
        { name: 'stroke', value: '#000000' }
      ]
    }
  ]))

  tests.push(buildTest(t, data, {
    scale: 0,
    margin: 8,
    color: {
      light: '#0000',
      dark: '#00000080'
    }
  }, [
    {
      name: 'svg',
      attribs: [
        { name: 'viewbox', value: getExpectedViewbox(size, 8) }
      ]
    },
    {
      name: 'path',
      attribs: [
        { name: 'stroke', value: '#000000' },
        { name: 'stroke-opacity', value: '.50' }
      ]
    }
  ]))

  tests.push(buildTest(t, data, {}, [
    {
      name: 'svg',
      attribs: [
        { name: 'viewbox', value: getExpectedViewbox(size, 4) }
      ]
    },
    { name: 'path', attribs: [{ name: 'fill', value: '#ffffff' }] },
    { name: 'path', attribs: [{ name: 'stroke', value: '#000000' }] }
  ]))

  tests.push(buildTest(t, data, { width: 250 }, [
    {
      name: 'svg',
      attribs: [
        { name: 'width', value: '250' },
        { name: 'height', value: '250' },
        { name: 'viewbox', value: getExpectedViewbox(size, 4) }
      ]
    },
    { name: 'path', attribs: [{ name: 'fill', value: '#ffffff' }] },
    { name: 'path', attribs: [{ name: 'stroke', value: '#000000' }] }
  ]))

  Promise.all(tests).then(function () {
    t.end()
  })
})

test('Svg render opacity near the endpoints', function (t) {
  const data = QRCode.create('sample text')
  const cases = [
    ['00', '.00', null],
    ['01', '0.00392156862745098', '0.00392156862745098'],
    ['80', '.50', '.50'],
    ['fd', '.99', '.99'],
    ['fe', '0.996078431372549', '0.996078431372549'],
    ['ff', null, null]
  ]

  cases.forEach(function ([alpha, darkOpacity, lightOpacity]) {
    const svg = SvgRenderer.render(data, {
      color: { dark: '#000000' + alpha, light: '#ffffff' + alpha }
    })
    const stroke = svg.match(/stroke-opacity="([^"]+)"/)
    const fill = svg.match(/fill-opacity="([^"]+)"/)

    t.equal(stroke && stroke[1], darkOpacity, 'stroke opacity for 0x' + alpha)
    t.equal(fill && fill[1], lightOpacity, 'fill opacity for 0x' + alpha)
    t.equal(svg.includes('<path fill="#ffffff"'), alpha !== '00', 'background presence for 0x' + alpha)
  })

  t.end()
})

test('Svg renderToFile', function (t) {
  const sampleQrData = QRCode.create('sample text', { version: 2 })
  const fileName = 'qrimage.svg'
  let fsStub = sinon.stub(fs, 'writeFile').callsArg(2)

  t.plan(5)

  SvgRenderer.renderToFile(fileName, sampleQrData, function (err) {
    t.ok(!err,
      'Should not generate errors with only qrData param')

    t.equal(fsStub.getCall(0).args[0], fileName,
      'Should save file with correct file name')
  })

  SvgRenderer.renderToFile(fileName, sampleQrData, {
    margin: 10,
    scale: 1
  }, function (err) {
    t.ok(!err,
      'Should not generate errors with options param')

    t.equal(fsStub.getCall(0).args[0], fileName,
      'Should save file with correct file name')
  })

  fsStub.restore()
  fsStub = sinon.stub(fs, 'writeFile').callsArgWith(2, new Error())

  SvgRenderer.renderToFile(fileName, sampleQrData, function (err) {
    t.ok(err,
      'Should fail if error occurs during save')
  })

  fsStub.restore()
})
