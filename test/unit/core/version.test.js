var test = require('tap').test
var Version = require('core/version')
var ECLevel = require('core/error-correction-level')
var Mode = require('core/mode')
var NumericData = require('core/numeric-data')
var AlphanumericData = require('core/alphanumeric-data')
var KanjiData = require('core/kanji-data')
var ByteData = require('core/byte-data')

var EC_LEVELS = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H]

var EXPECTED_NUMERIC_CAPACITY = [
  [41, 34, 27, 17], [77, 63, 48, 34], [127, 101, 77, 58], [187, 149, 111, 82],
  [255, 202, 144, 106], [322, 255, 178, 139], [370, 293, 207, 154], [461, 365, 259, 202],
  [552, 432, 312, 235], [652, 513, 364, 288], [772, 604, 427, 331], [883, 691, 489, 374],
  [1022, 796, 580, 427], [1101, 871, 621, 468], [1250, 991, 703, 530], [1408, 1082, 775, 602],
  [1548, 1212, 876, 674], [1725, 1346, 948, 746], [1903, 1500, 1063, 813], [2061, 1600, 1159, 919],
  [2232, 1708, 1224, 969], [2409, 1872, 1358, 1056], [2620, 2059, 1468, 1108], [2812, 2188, 1588, 1228],
  [3057, 2395, 1718, 1286], [3283, 2544, 1804, 1425], [3517, 2701, 1933, 1501], [3669, 2857, 2085, 1581],
  [3909, 3035, 2181, 1677], [4158, 3289, 2358, 1782], [4417, 3486, 2473, 1897], [4686, 3693, 2670, 2022],
  [4965, 3909, 2805, 2157], [5253, 4134, 2949, 2301], [5529, 4343, 3081, 2361], [5836, 4588, 3244, 2524],
  [6153, 4775, 3417, 2625], [6479, 5039, 3599, 2735], [6743, 5313, 3791, 2927], [7089, 5596, 3993, 3057]
]

var EXPECTED_ALPHANUMERIC_CAPACITY = [
  [25, 20, 16, 10], [47, 38, 29, 20], [77, 61, 47, 35], [114, 90, 67, 50],
  [154, 122, 87, 64], [195, 154, 108, 84], [224, 178, 125, 93], [279, 221, 157, 122],
  [335, 262, 189, 143], [395, 311, 221, 174], [468, 366, 259, 200], [535, 419, 296, 227],
  [619, 483, 352, 259], [667, 528, 376, 283], [758, 600, 426, 321], [854, 656, 470, 365],
  [938, 734, 531, 408], [1046, 816, 574, 452], [1153, 909, 644, 493], [1249, 970, 702, 557],
  [1352, 1035, 742, 587], [1460, 1134, 823, 640], [1588, 1248, 890, 672], [1704, 1326, 963, 744],
  [1853, 1451, 1041, 779], [1990, 1542, 1094, 864], [2132, 1637, 1172, 910], [2223, 1732, 1263, 958],
  [2369, 1839, 1322, 1016], [2520, 1994, 1429, 1080], [2677, 2113, 1499, 1150], [2840, 2238, 1618, 1226],
  [3009, 2369, 1700, 1307], [3183, 2506, 1787, 1394], [3351, 2632, 1867, 1431], [3537, 2780, 1966, 1530],
  [3729, 2894, 2071, 1591], [3927, 3054, 2181, 1658], [4087, 3220, 2298, 1774], [4296, 3391, 2420, 1852]
]

var EXPECTED_KANJI_CAPACITY = [
  [10, 8, 7, 4], [20, 16, 12, 8], [32, 26, 20, 15], [48, 38, 28, 21],
  [65, 52, 37, 27], [82, 65, 45, 36], [95, 75, 53, 39], [118, 93, 66, 52],
  [141, 111, 80, 60], [167, 131, 93, 74], [198, 155, 109, 85], [226, 177, 125, 96],
  [262, 204, 149, 109], [282, 223, 159, 120], [320, 254, 180, 136], [361, 277, 198, 154],
  [397, 310, 224, 173], [442, 345, 243, 191], [488, 384, 272, 208], [528, 410, 297, 235],
  [572, 438, 314, 248], [618, 480, 348, 270], [672, 528, 376, 284], [721, 561, 407, 315],
  [784, 614, 440, 330], [842, 652, 462, 365], [902, 692, 496, 385], [940, 732, 534, 405],
  [1002, 778, 559, 430], [1066, 843, 604, 457], [1132, 894, 634, 486], [1201, 947, 684, 518],
  [1273, 1002, 719, 553], [1347, 1060, 756, 590], [1417, 1113, 790, 605], [1496, 1176, 832, 647],
  [1577, 1224, 876, 673], [1661, 1292, 923, 701], [1729, 1362, 972, 750], [1817, 1435, 1024, 784]
]

var EXPECTED_BYTE_CAPACITY = [
  [17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34],
  [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84],
  [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155],
  [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250],
  [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382],
  [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511],
  [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658],
  [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842],
  [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051],
  [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]
]

var EXPECTED_VERSION_BITS = [
  0x07C94, 0x085BC, 0x09A99, 0x0A4D3, 0x0BBF6, 0x0C762, 0x0D847, 0x0E60D,
  0x0F928, 0x10B78, 0x1145D, 0x12A17, 0x13532, 0x149A6, 0x15683, 0x168C9,
  0x177EC, 0x18EC4, 0x191E1, 0x1AFAB, 0x1B08E, 0x1CC1A, 0x1D33F, 0x1ED75,
  0x1F250, 0x209D5, 0x216F0, 0x228BA, 0x2379F, 0x24B0B, 0x2542E, 0x26A64,
  0x27541, 0x28C69
]

test('Version validity', function (t) {
  t.notOk(Version.isValid(), 'Should return false if no input')
  t.notOk(Version.isValid(''), 'Should return false if version is not a number')
  t.notOk(Version.isValid(0), 'Should return false if version is not in range')
  t.notOk(Version.isValid(41), 'Should return false if version is not in range')

  t.end()
})

test('Version from value', function (t) {
  t.equal(Version.from(5), 5, 'Should return correct version from a number')
  t.equal(Version.from('5'), 5, 'Should return correct version from a string')
  t.equal(Version.from(0, 1), 1, 'Should return default value if version is invalid')
  t.equal(Version.from(null, 1), 1, 'Should return default value if version is undefined')

  t.end()
})

test('Version capacity', function (t) {
  t.throws(function () { Version.getCapacity() }, 'Should throw if version is undefined')
  t.throws(function () { Version.getCapacity('') }, 'Should throw if version is not a number')
  t.throws(function () { Version.getCapacity(0) }, 'Should throw if version is not in range')
  t.throws(function () { Version.getCapacity(41) }, 'Should throw if version is not in range')

  for (var l = 0; l < EC_LEVELS.length; l++) {
    for (var i = 1; i <= 40; i++) {
      t.equal(Version.getCapacity(i, EC_LEVELS[l], Mode.NUMERIC),
        EXPECTED_NUMERIC_CAPACITY[i - 1][l], 'Should return correct numeric mode capacity')

      t.equal(Version.getCapacity(i, EC_LEVELS[l], Mode.ALPHANUMERIC),
        EXPECTED_ALPHANUMERIC_CAPACITY[i - 1][l], 'Should return correct alphanumeric mode capacity')

      t.equal(Version.getCapacity(i, EC_LEVELS[l], Mode.KANJI),
        EXPECTED_KANJI_CAPACITY[i - 1][l], 'Should return correct kanji mode capacity')

      t.equal(Version.getCapacity(i, EC_LEVELS[l], Mode.BYTE),
        EXPECTED_BYTE_CAPACITY[i - 1][l], 'Should return correct byte mode capacity')

      t.equal(Version.getCapacity(i, EC_LEVELS[l]),
        EXPECTED_BYTE_CAPACITY[i - 1][l], 'Should return correct byte mode capacity')
    }
  }

  t.end()
})

test('Version best match', function (t) {
  function testBestVersionForCapacity (expectedCapacity, DataCtor) {
    for (var v = 0; v < 40; v++) {
      for (var l = 0; l < EC_LEVELS.length; l++) {
        var capacity = expectedCapacity[v][l]
        var data = new DataCtor(new Array(capacity + 1).join('-'))

        t.equal(Version.getBestVersionForData(data, EC_LEVELS[l]), v + 1, 'Should return best version')
        t.equal(Version.getBestVersionForData([data], EC_LEVELS[l]), v + 1, 'Should return best version')

        if (l === 1) {
          t.equal(Version.getBestVersionForData(data, null), v + 1,
            'Should return best version for ECLevel.M if error level is undefined')
          t.equal(Version.getBestVersionForData([data], null), v + 1,
            'Should return best version for ECLevel.M if error level is undefined')
        }
      }
    }

    for (var i = 0; i < EC_LEVELS.length; i++) {
      var exceededCapacity = expectedCapacity[39][i] + 1
      var tooBigData = new DataCtor(new Array(exceededCapacity + 1).join('-'))
      var tooBigDataArray = [
        new DataCtor(new Array(Math.floor(exceededCapacity / 2)).join('-')),
        new DataCtor(new Array(Math.floor(exceededCapacity / 2) + 1).join('-'))
      ]

      t.notOk(Version.getBestVersionForData(tooBigData, EC_LEVELS[i]),
        'Should return undefined if data is too big')
      t.notOk(Version.getBestVersionForData([tooBigData], EC_LEVELS[i]),
        'Should return undefined if data is too big')
      t.notOk(Version.getBestVersionForData(tooBigDataArray, EC_LEVELS[i]),
        'Should return undefined if data is too big')
    }
  }

  testBestVersionForCapacity(EXPECTED_NUMERIC_CAPACITY, NumericData)
  testBestVersionForCapacity(EXPECTED_ALPHANUMERIC_CAPACITY, AlphanumericData)
  testBestVersionForCapacity(EXPECTED_KANJI_CAPACITY, KanjiData)
  testBestVersionForCapacity(EXPECTED_BYTE_CAPACITY, ByteData)

  t.ok(Version.getBestVersionForData([new ByteData('abc'), new NumericData('1234')]),
    'Should return a version number if input array is valid')

  t.equal(Version.getBestVersionForData([]), 1,
    'Should return 1 if array is empty')

  t.end()
})

test('Version encoded info', function (t) {
  var v

  for (v = 0; v < 7; v++) {
    t.throws(function () { Version.getEncodedBits(v) },
      'Should throw if version is invalid or less than 7')
  }

  for (v = 7; v <= 40; v++) {
    var bch = Version.getEncodedBits(v)
    t.equal(bch, EXPECTED_VERSION_BITS[v - 7], 'Should return correct bits')
  }

  t.end()
})
