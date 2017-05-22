'use strict'
// ignore most things
var walk = require('../')

// set the ignores just for this test
var c = require('./common.js')
c.ignores({
  '.ignore': ['*', 'a', 'c', '!a/b/c/.abc', '!/c/b/a/cba'],
  'a/.ignore': [ '!*', '.ignore' ], // unignore everything
  'a/a/.ignore': [ '*' ], // re-ignore everything
  'a/b/.ignore': [ '*', '!/c/.abc' ], // original unignore
  'a/c/.ignore': [ '*' ], // ignore everything again
  'c/b/a/.ignore': [ '!cba', '!.cba', '!/a{bc,cb}' ]
})

// the only files we expect to see
var expected = [
  'a/b/c/.abc',
  'c/b/a/.cba',
  'c/b/a/abc',
  'c/b/a/acb',
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
