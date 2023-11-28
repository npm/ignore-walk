'use strict'

var walk = require('../lib/index.js')
const { resolve } = require('path')
const path = resolve(__dirname, 'fixtures')

// set the ignores just for this test
var c = require('./common.js')
c.ignores({
  '.ignore': ['*', '!/c', '!/d'],
  'c/.ignore': ['!*', '.ignore'], // unignore everything
})

// the only files we expect to see
var expected = []

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
