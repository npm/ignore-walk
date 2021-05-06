'use strict'
// ignore most things
var walk = require('../')

// set the ignores just for this test
var c = require('./common.js')
c.ignores({
  '.ignore': ['*', 'd', 'h', '!d/c/h/.dch', '!/h/c/d/hcd'],
  'd/.ignore': [ '!*', '.ignore' ], // unignore everything
  'd/d/.ignore': [ '*' ], // re-ignore everything
  'd/c/.ignore': [ '*', '!/h/.dch' ], // original unignore
  'd/h/.ignore': [ '*' ], // ignore everything again
  'h/c/d/.ignore': [ '!hcd', '!.hcd', '!/d{ch,dd}' ]
})

// the only files we expect to see
var expected = [
  'd/c/h/.dch',
  'h/c/d/.hcd',
  'h/c/d/dch',
  'h/c/d/ddd',
  'h/c/d/hcd'
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
