var spawn = require('child_process').spawn

var opt = {
  cwd: __dirname,
  env: (function () {
    process.env.NODE_PATH = './lib'
    return process.env
  }()),
  stdio: [process.stdin, process.stdout, process.stderr]
}

spawn('node', [
  'node_modules/.bin/tap',
  '--cov',
  'test/**/*.test.js'
], opt)
