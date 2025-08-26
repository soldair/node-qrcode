import { spawn as spawn$0 } from 'child_process'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const spawn = { spawn: spawn$0 }.spawn
const opt = {
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
