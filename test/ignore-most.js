'use strict'
// ignore most things
const Walker = require('../')

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
  t.same(new Walker.Sync({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.ignore' ]
  }).result, expected)
  t.end()
})

t.test('async', t => {
  new Walker({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.ignore' ]
  }).on('done', result => {
    t.same(result, expected)
    t.end()
  })
})
