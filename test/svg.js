var test = require('tap').test;
var libxml = require("libxmljs");
var fs = require('fs');

var svgRender = require('../lib/svgrender');
var QRCode = require('../qrcode');

test('svgrender interface', function(t) {
  t.ok(svgRender.hasOwnProperty('renderBits'), 'function "renderBits" should be defined');
  t.throws(function() { svgrender.renderBits(); }, 'should throws if called without params');
  t.throws(function() { svgrender.renderBits([]); }, 'should throws if called without "width" param');
  t.throws(function() { svgrender.renderBits([], ""); }, 'should throws if called with invalid "width" param');
  t.throws(function() { svgrender.renderBits(null, 0); }, 'should throws if called with undefined "bits" param');
  t.throws(function() { svgrender.renderBits("", 0); }, 'should throws if "bits" param is not an array');
  t.end();
});

test('svgrender output', function(t) {
  var expectedWidth = 2;
  var expectedMargin = 8;
  var expectedScale = 5;

  var expectedQrCodeSize = '26'; // qrcode size = width * scale + margin * 2
  var expectedLightColor = '#AAAAAA';
  var expectedDarkColor = '#555555';

  var bits = [1, 1, 0, 1];
  var expectedTrueBitNumber = bits.filter(function(b) { return b; }).length;

  var xml = svgRender.renderBits(bits, expectedWidth, {
    scale: expectedScale,
    margin: expectedMargin,
    lightColor: expectedLightColor,
    darkColor: expectedDarkColor
  });

  var xmlDoc = libxml.parseXml(xml);

  t.equal(xmlDoc.errors.length, 0, 'should output a valid xml');

  var rootElem = xmlDoc.root();
  t.equal('svg', rootElem.name(), 'should have <svg> has root element');
  t.equal(rootElem.attr('width').value(), expectedQrCodeSize, 'should have a valid width');
  t.equal(rootElem.attr('height').value(), expectedQrCodeSize, 'should have a valid height');

  var rectElem = rootElem.child(1);
  t.equal(rectElem.name(), 'rect', 'should have <rect> as first child element');
  t.equal(rectElem.attr('width').value(), expectedQrCodeSize, 'should have a valid rect width');
  t.equal(rectElem.attr('height').value(), expectedQrCodeSize, 'should have a valid rect height');
  t.equal(rectElem.attr('fill').value(), expectedLightColor, 'should have the background color specified in options');

  var dotDef = rectElem.nextElement();
  t.equal(dotDef.name(), 'defs', 'should have a <defs> element');

  var dotRect = dotDef.child(0);
  t.equal(dotRect.name(), 'rect', 'should have a <rect> definition');
  t.equal(dotRect.attr('width').value(), expectedScale.toString(), 'should have a valid rect width');
  t.equal(dotRect.attr('height').value(), expectedScale.toString(), 'should have a valid rect height');

  var gElem = dotDef.nextElement();
  t.equal(gElem.name(), 'g', 'should have a <g> element');
  t.equal(gElem.attr('fill').value(), expectedDarkColor, 'should have the color specified in options');

  var useElems = gElem.find('*');
  t.equal(useElems.length, expectedTrueBitNumber, 'should have one element for each "true" bit');
  t.equal(useElems[0].attr('x').value(), expectedMargin.toString(), 'should have a left margin as specified in options');
  t.equal(useElems[0].attr('y').value(), expectedMargin.toString(), 'should have a top margin as specified in options');

  t.end();
});

test('drawSvg', function(t) {
  var expectedSvg = fs.readFileSync(__dirname + '/fixtures/expected-output.svg', 'UTF-8');

  QRCode.drawSvg('http://www.google.com', function(err, code) {
    t.ok(!err, 'there should be no error');
    t.equal(code, expectedSvg, 'should output a valid svg');

    t.end()
  });
});
