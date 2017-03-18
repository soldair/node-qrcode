var spawn = require('child_process').spawn
var path = require('path')

var opt = {
  cwd: __dirname,
  env: (function () {
    process.env.NODE_PATH = './' + path.delimiter + './lib'
    return process.env
  }()),
  stdio: [process.stdin, process.stdout, process.stderr]
}

spawn('node', [
  'node_modules/.bin/tap',
  '--cov', '--100',
  process.argv[2] || 'test/**/*.test.js'
], opt)
