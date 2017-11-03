var spawn = require('child_process').spawn
var fs = require('fs')
var path = require('path')
require('colors')

function createFolder (folderPath, onDone) {
  console.log('*'.green + ' creating folder: '.grey + folderPath.white)

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }

  onDone()
}

function bundle (inputFile, exportName, outputFile, onDone) {
  console.log('*'.green + ' bundling: '.grey +
   inputFile.white + ' -> '.grey + outputFile.white)

  var browserify = spawn('node', [
    'node_modules/.bin/browserify',
    inputFile,
    '-s', exportName,
    '-d',
    '-o', outputFile
  ])

  browserify.stdin.end()
  browserify.stdout.pipe(process.stdout)
  browserify.stderr.pipe(process.stderr)
  browserify.on('exit', function (code) {
    if (code) {
      console.error('browserify failed!')
      process.exit(code)
    }

    onDone()
  })
}

function minify (inputFile, outputFile, onDone) {
  console.log('*'.green + ' minifying: '.grey +
   inputFile.white + ' -> '.grey + outputFile.white)

  var uglify = spawn('node', [
    'node_modules/.bin/uglifyjs',
    '--compress', '--mangle',
    '--source-map', outputFile + '.map',
    '--source-map-url', path.basename(outputFile) + '.map',
    '--', inputFile])

  var minStream = fs.createWriteStream(outputFile)
  uglify.stdout.pipe(minStream)
  uglify.stdin.end()
  uglify.on('exit', function (code) {
    if (code) {
      console.error('uglify failed!')
      fs.unlink(outputFile, function () {
        process.exit(code)
      })
    }

    onDone()
  })
}

var q = [
  createFolder.bind(null, './build', done),
  bundle.bind(null, 'lib/index.js', 'QRCode', 'build/qrcode.js', done),
  bundle.bind(null, 'helper/to-sjis.js', 'QRCode.toSJIS', 'build/qrcode.tosjis.js', done),
  minify.bind(null, 'build/qrcode.js', 'build/qrcode.min.js', done),
  minify.bind(null, 'build/qrcode.tosjis.js', 'build/qrcode.tosjis.min.js', done)
]

function done () {
  var j = q.shift()
  if (j) j()
  else complete()
}

function complete () {
  console.log('\nBuild complete =)\n'.green)
}

done()
