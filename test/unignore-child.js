'use strict'
const Walker = require('../')

// set the ignores just for this test
var c = require('./common.js')
c.ignores({ '.ignore': ['*', 'a', 'c', '!a/b/c/.abc', '!/c/b/a/cba'] })

// the only files we expect to see
var expect = [
  'a/b/c/.abc',
  'c/b/a/cba'
]

const t = require('tap')
t.test('sync', t => {
  t.plan(1)
  t.same(new Walker.Sync({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.ignore' ]
  }).result, expect)
})

t.test('async', t => {
  t.plan(1)
  new Walker({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.ignore' ]
  }).on('done', result => t.same(result, expect))
})
