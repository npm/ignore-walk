'use strict'
// ignore most things
const walk = require('..')
const { resolve } = require('path')
const path = resolve(__dirname, 'fixtures')

// set the ignores just for this test
require('./common.js').ignores({
  '.ignore': ['*', '!d/c/h/.dch', '!/h/c/d/hcd'],
})

// the only files we expect to see
const expected = [
  'd/c/h/.dch',
  'h/c/d/hcd',
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
