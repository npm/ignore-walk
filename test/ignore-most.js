'use strict'
// ignore most things
const walk = require('../')

// set the ignores just for this test
require('./common.js').ignores({
  '.ignore': ['*', '!a/b/c/.abc', '!/c/b/a/cba']
})

// the only files we expect to see
const expected = [
  'a/b/c/.abc',
  'c/b/a/cba'
]

const t = require('tap')

t.test('sync', t => {
  t.same(walk.sync({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.ignore' ]
  }), expected)
  t.end()
})

t.test('async', t => walk({
  path: __dirname + '/fixtures',
  ignoreFiles: [ '.ignore' ]
}, (er, result) => t.same(result, expected)))
