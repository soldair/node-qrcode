import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const babelConfig = {
  babelrc: false,
  presets: [['@babel/preset-env', { targets: 'defaults, IE >= 10, Safari >= 5.1' }]]
}

export default [{
  input: 'lib/browser.js',
  output: { file: 'build/qrcode.js', format: 'iife', name: 'QRCode', exports: 'named' },
  plugins: [commonjs(), resolve(), babel(babelConfig), terser()]
}, {
  input: 'helper/to-sjis-browser.js',
  output: { file: 'build/qrcode.tosjis.js', format: 'iife', exports: 'none' },
  plugins: [commonjs(), resolve(), babel(babelConfig), terser()]
}]
