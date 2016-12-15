var test = require('tap').test
var pattern = require('core/finder-pattern')

test('Finder pattern', function (t) {
  for (var i = 1; i <= 40; i++) {
    t.equal(pattern.getPositions(i).length, 3, 'Should always return 3 pattern positions')
  }

  t.end()
})
