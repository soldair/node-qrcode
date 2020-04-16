const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

require('colors')

function createFolder (folderPath) {
  console.log('*'.green + ' creating folder: '.grey + folderPath.white)

  fs.mkdirSync(folderPath, { recursive: true })
}

function bundle (inputFile, exportName, outputFile, onDone) {
  console.log('*'.green + ' bundling: '.grey + inputFile.white + ' -> '.grey + outputFile.white)

  const { status, stderr } = childProcess.spawnSync('node', [
    'node_modules/.bin/browserify',
    inputFile,
    '-s', exportName,
    '-d',
    '-o', outputFile
  ])

  if (status !== 0) {
    console.error(stderr.toString())
    process.exit(status)
  }
}

function minify (inputFile, outputFile) {
  console.log('*'.green + ' minifying: '.grey + inputFile.white + ' -> '.grey + outputFile.white)

  const { status, stderr } = childProcess.spawnSync('node', [
    'node_modules/.bin/uglifyjs',
    '--compress', '--mangle',
    '--output', outputFile,
    '--source-map', `url='${path.basename(outputFile)}.map'`,
    '--', inputFile
  ])

  if (status !== 0) {
    console.error(stderr.toString())
    process.exit(status)
  }
}

createFolder('./build')
bundle('lib/index.js', 'QRCode', 'build/qrcode.js')
bundle('helper/to-sjis.js', 'QRCode.toSJIS', 'build/qrcode.tosjis.js')
minify('build/qrcode.js', 'build/qrcode.min.js')
minify('build/qrcode.tosjis.js', 'build/qrcode.tosjis.min.js')
console.log('\nBuild complete =)\n'.green)
