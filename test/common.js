'use strict'

if (require.main === module) {
  return require('tap').pass('this is fine')
}

const fs = require('fs')
const path = require('path')

exports.ignores = ignores
exports.writeIgnoreFile = writeIgnoreFile
exports.writeIgnores = writeIgnores
exports.clearIgnores = clearIgnores
exports.createFile = createFile

function writeIgnoreFile (file, rules) {
  file = path.resolve(__dirname, 'fixtures', file)
  if (Array.isArray(rules)) {
    rules = rules.join('\n')
  }

  fs.writeFileSync(file, rules)
}

function writeIgnores (set) {
  Object.keys(set).forEach(function (f) {
    writeIgnoreFile(f, set[f])
  })
}

function clearIgnores (set) {
  Object.keys(set).forEach(function (file) {
    fs.unlinkSync(path.resolve(__dirname, 'fixtures', file))
  })
}

function ignores (set) {
  writeIgnores(set)
  process.on('exit', clearIgnores.bind(null, set))
}

/** Used to create an extra file next to the fixtures from 00-setup.js. */
function createFile (dir, file) {
  var fixtures = path.resolve(__dirname, 'fixtures')

  dir = path.resolve(fixtures, dir)
  fs.mkdirSync(dir, { recursive: true })
  file = path.resolve(dir, file)
  fs.writeFileSync(file, path.basename(file))
}
