'use strict'

var walk = require('../lib/index.js')
const { resolve } = require('path')
const path = resolve(__dirname, 'fixtures')

// set the ignores just for this test
var c = require('./common.js')
c.ignores({
  '.ignore': ['*', '!/c/d', '!/d/c', '!/d/d/', '!/d/h/h'],
  'c/.ignore': ['!*', '.ignore'], // unignore everything
  'd/c/.ignore': ['!h', '!cc*'], // unignore directory
  'd/d/.ignore': ['!h/', '!cc*'], // unignore directory with slash
  'd/h/h/.ignore': ['!dd*'], // unignore files
})

// the only files we expect to see
var expected = [
  'd/c/h/ccc',
  'd/c/h/ccd',
  'd/c/h/cch',
  'd/d/h/ccc',
  'd/d/h/ccd',
  'd/d/h/cch',
  'd/h/h/ddc',
  'd/h/h/ddd',
  'd/h/h/ddh',
]

const t = require('tap')

t.test('sync', t => {
  t.same(walk.sync({
    path,
    ignoreFiles: ['.ignore'],
  }), expected)
  t.end()
})

t.test('async', t => walk({
  path,
  ignoreFiles: ['.ignore'],
}, (er, result) => t.same(result, expected)))
