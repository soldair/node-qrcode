var test = require('tap').test
var ECLevel = require('core/error-correction-level')

var EC_LEVELS = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H]

test('Error level from input value', function (t) {
  var values = [['l', 'low'], ['m', 'medium'], ['q', 'quartile'], ['h', 'high']]

  for (var l = 0; l < values.length; l++) {
    for (var i = 0; i < values[l].length; i++) {
      t.equal(ECLevel.from(values[l][i]), EC_LEVELS[l])
      t.equal(ECLevel.from(values[l][i].toUpperCase()), EC_LEVELS[l])
    }
  }

  t.equal(ECLevel.from(ECLevel.L), ECLevel.L, 'Should return passed level if value is valid')
  t.equal(ECLevel.from(undefined, ECLevel.M), ECLevel.M, 'Should return default level if value is undefined')
  t.equal(ECLevel.from('', ECLevel.Q), ECLevel.Q, 'Should return default level if value is invalid')

  t.end()
})

test('Error level validity', function (t) {
  for (var l = 0; l < EC_LEVELS.length; l++) {
    t.ok(ECLevel.isValid(EC_LEVELS[l]), 'Should return true if error level is valid')
  }

  t.notOk(ECLevel.isValid(undefined), 'Should return false if level is undefined')
  t.notOk(ECLevel.isValid({}), 'Should return false if bit property is undefined')
  t.notOk(ECLevel.isValid({ bit: -1 }), 'Should return false if bit property value is < 0')
  t.notOk(ECLevel.isValid({ bit: 4 }), 'Should return false if bit property value is > 3')

  t.end()
})
