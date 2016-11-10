var test = require('tap').test
var version = require('../version')
var ECLevel = require('../error-correction-level')
var ByteData = require('../byte-data')

var EXPECTED_CAPACITY = [
  [17, 14, 11, 7],
  [32, 26, 20, 14],
  [53, 42, 32, 24],
  [78, 62, 46, 34],
  [106, 84, 60, 44],
  [134, 106, 74, 58],
  [154, 122, 86, 64],
  [192, 152, 108, 84],
  [230, 180, 130, 98],
  [271, 213, 151, 119],
  [321, 251, 177, 137],
  [367, 287, 203, 155],
  [425, 331, 241, 177],
  [458, 362, 258, 194],
  [520, 412, 292, 220],
  [586, 450, 322, 250],
  [644, 504, 364, 280],
  [718, 560, 394, 310],
  [792, 624, 442, 338],
  [858, 666, 482, 382],
  [929, 711, 509, 403],
  [1003, 779, 565, 439],
  [1091, 857, 611, 461],
  [1171, 911, 661, 511],
  [1273, 997, 715, 535],
  [1367, 1059, 751, 593],
  [1465, 1125, 805, 625],
  [1528, 1190, 868, 658],
  [1628, 1264, 908, 698],
  [1732, 1370, 982, 742],
  [1840, 1452, 1030, 790],
  [1952, 1538, 1112, 842],
  [2068, 1628, 1168, 898],
  [2188, 1722, 1228, 958],
  [2303, 1809, 1283, 983],
  [2431, 1911, 1351, 1051],
  [2563, 1989, 1423, 1093],
  [2699, 2099, 1499, 1139],
  [2809, 2213, 1579, 1219],
  [2953, 2331, 1663, 1273]
]

test('Version validity', function (t) {
  t.notOk(version.isValidVersion(), 'Should return false if no input')
  t.notOk(version.isValidVersion(''), 'Should return false if version is not a number')
  t.notOk(version.isValidVersion(0), 'Should return false if version is not in range')
  t.notOk(version.isValidVersion(41), 'Should return false if version is not in range')

  t.end()
})

test('Version capacity', function (t) {
  t.throws(function () { version.getCapacity() }, 'Should throw if version is undefined')
  t.throws(function () { version.getCapacity('') }, 'Should throw if version is not a number')
  t.throws(function () { version.getCapacity(0) }, 'Should throw if version is not in range')
  t.throws(function () { version.getCapacity(41) }, 'Should throw if version is not in range')

  for (var i = 1; i <= 40; i++) {
    t.equal(version.getCapacity(i, ECLevel.L), EXPECTED_CAPACITY[i - 1][0], 'Should return correct capacity')
    t.equal(version.getCapacity(i, ECLevel.M), EXPECTED_CAPACITY[i - 1][1], 'Should return correct capacity')
    t.equal(version.getCapacity(i, ECLevel.Q), EXPECTED_CAPACITY[i - 1][2], 'Should return correct capacity')
    t.equal(version.getCapacity(i, ECLevel.H), EXPECTED_CAPACITY[i - 1][3], 'Should return correct capacity')
  }

  t.end()
})

test('Version best match', function (t) {
  var levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H]

  for (var v = 0; v < 40; v++) {
    for (var l = 0; l < levels.length; l++) {
      var capacity = EXPECTED_CAPACITY[v][l]
      var dataArray = new Array(capacity + 1)
      var dataBuffer = new Buffer(capacity)
      var byteData = new ByteData(new Array(capacity))

      t.equal(version.getBestVersionForData(dataArray, levels[l]), v + 1, 'Should return best version')
      t.equal(version.getBestVersionForData(dataBuffer, levels[l]), v + 1, 'Should return best version')
      t.equal(version.getBestVersionForData(byteData, levels[l]), v + 1, 'Should return best version')

      if (l === 3) {
        t.deepEqual(version.getBestVersionForData(dataArray), v + 1, 'Should return best version for ECLevel.H if error level is undefined')
        t.deepEqual(version.getBestVersionForData(dataBuffer), v + 1, 'Should return best version for ECLevel.H if error level is undefined')
        t.deepEqual(version.getBestVersionForData(byteData), v + 1, 'Should return best version for ECLevel.H if error level is undefined')
      }
    }
  }

  for (var i = 0; i < levels.length; i++) {
    var exceededCapacity = EXPECTED_CAPACITY[39][i] + 1
    var tooBigDataArray = new Array(exceededCapacity + 1)
    var tooBigDataBuffer = new Buffer(exceededCapacity)
    var tooBigByteData = new ByteData(new Array(exceededCapacity))

    t.notOk(version.getBestVersionForData(tooBigDataArray, levels[i]), 'Should return undefined if data is too big')
    t.notOk(version.getBestVersionForData(tooBigDataBuffer, levels[i]), 'Should return undefined if data is too big')
    t.notOk(version.getBestVersionForData(tooBigByteData, levels[i]), 'Should return undefined if data is too big')
  }

  t.end()
})