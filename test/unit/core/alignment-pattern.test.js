var test = require('tap').test
var pattern = require('core/alignment-pattern')

/**
 * Row/column coordinates of the center module of each alignment pattern.
 * Each sub-array refers to a qr code version.
 *
 * @type {Array}
 */
var EXPECTED_POSITION_TABLE = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170]
]

test('Alignment pattern - Row/Col coords', function (t) {
  t.plan(40)

  for (var i = 1; i <= 40; i++) {
    var pos = pattern.getRowColCoords(i)
    t.deepEqual(pos, EXPECTED_POSITION_TABLE[i - 1], 'Should return correct coords')
  }
})

test('Alignment pattern - Positions', function (t) {
  for (var i = 1; i <= 40; i++) {
    var pos = pattern.getPositions(i)
    var expectedPos = EXPECTED_POSITION_TABLE[i - 1]
    var expectedLength = (Math.pow(expectedPos.length, 2) || 3) - 3

    t.equal(pos.length, expectedLength, 'Should return correct number of positions')

    // For each coord value check if it's present in the expected coords table
    pos.forEach(function (position) {
      position.forEach(function (coord) {
        t.notEqual(expectedPos.indexOf(coord), -1, 'Should return valid coord value')
      })
    })
  }

  t.end()
})
