import tap from 'tap'
import * as pattern from '../../../lib/core/finder-pattern.js'
const test = tap.test
test('Finder pattern', function (t) {
  for (let i = 1; i <= 40; i++) {
    t.equal(pattern.getPositions(i).length, 3, 'Should always return 3 pattern positions')
  }
  t.end()
})
