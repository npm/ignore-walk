'use strict'
const walk = require('../')

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
  t.same(walk.sync({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.ignore' ]
  }), expect)
})

t.test('async', t => walk({
  path: __dirname + '/fixtures',
  ignoreFiles: [ '.ignore' ]
}, (er, result) => t.same(result, expect)))
