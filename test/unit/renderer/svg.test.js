var test = require('tap').test
var sinon = require('sinon')
var fs = require('fs')
var libxml = require('libxmljs')
var QRCode = require('core/qrcode')
var SvgRenderer = require('renderer/svg')

test('svgrender interface', function (t) {
  t.type(SvgRenderer.render, 'function',
    'Should have render function')

  t.type(SvgRenderer.renderToFile, 'function',
    'Should have renderToFile function')

  t.end()
})

test('Svg render', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })
  var expectedTrueBitNumber = sampleQrData.modules.data.filter(function (b) {
    return b
  }).length

  var margin = 8
  var expectedMargin = 40
  var expectedScale = 5
  var expectedQrCodeSize = (25 + margin * 2) * expectedScale
  var expectedLightColor = 'rgb(255,255,255)'
  var expectedDarkColor = 'rgb(0,0,0)'

  var xml = SvgRenderer.render(sampleQrData, {
    scale: expectedScale,
    margin: margin
  })

  var xmlDoc = libxml.parseXml(xml)

  t.equal(xmlDoc.errors.length, 0, 'should output a valid xml')

  var rootElem = xmlDoc.root()
  t.equal('svg', rootElem.name(), 'should have <svg> has root element')

  t.equal(rootElem.attr('width').value(), expectedQrCodeSize.toString(),
    'should have a valid width')

  t.equal(rootElem.attr('height').value(), expectedQrCodeSize.toString(),
    'should have a valid height')

  var rectElem = rootElem.child(1)
  t.equal(rectElem.name(), 'rect', 'should have <rect> as first child element')

  t.equal(rectElem.attr('width').value(), expectedQrCodeSize.toString(),
    'should have a valid rect width')

  t.equal(rectElem.attr('height').value(), expectedQrCodeSize.toString(),
    'should have a valid rect height')

  t.equal(rectElem.attr('fill').value(), expectedLightColor,
    'should have the background color specified in options')

  var dotDef = rectElem.nextElement()
  t.equal(dotDef.name(), 'defs', 'should have a <defs> element')

  var dotRect = dotDef.child(0)
  t.equal(dotRect.name(), 'rect', 'should have a <rect> definition')

  t.equal(dotRect.attr('width').value(), expectedScale.toString(),
    'should have a valid rect width')

  t.equal(dotRect.attr('height').value(), expectedScale.toString(),
    'should have a valid rect height')

  var gElem = dotDef.nextElement()
  t.equal(gElem.name(), 'g', 'should have a <g> element')

  t.equal(gElem.attr('fill').value(), expectedDarkColor,
    'should have the color specified in options')

  var useElems = gElem.find('*')
  t.equal(useElems.length, expectedTrueBitNumber,
    'should have one element for each "true" bit')

  t.equal(useElems[0].attr('x').value(), expectedMargin.toString(),
    'should have a left margin as specified in options')

  t.equal(useElems[0].attr('y').value(), expectedMargin.toString(),
    'should have a top margin as specified in options')

  t.end()
})

test('Svg renderToFile', function (t) {
  var sampleQrData = QRCode.create('sample text', { version: 2 })
  var fileName = 'qrimage.svg'

  var fsStub = sinon.stub(fs, 'writeFileSync', function (path, buffer) {
    t.equal(path, fileName,
      'Should save file with correct file name')
  })

  fsStub.reset()

  t.notThrow(function () { SvgRenderer.renderToFile(fileName, sampleQrData) },
    'Should not throw with only qrData param')

  t.notThrow(function () {
    SvgRenderer.renderToFile(fileName, sampleQrData, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  fsStub.restore()
  fsStub = sinon.stub(fs, 'writeFileSync').throws()
  fsStub.reset()

  t.throw(function () { SvgRenderer.renderToFile(fileName, sampleQrData) },
    'Should throw if error occurs during save')

  fsStub.restore()
  t.end()
})
