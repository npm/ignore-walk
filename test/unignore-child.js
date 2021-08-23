'use strict'
const walk = require('../')

const {resolve} = require('path')
// set the ignores just for this test
var c = require('./common.js')
c.ignores({ '.ignore': ['*', 'd', 'h', '!d/c/h/.dch', '!/h/c/d/hcd'] })

// the only files we expect to see
var expect = [
  'd/c/h/.dch',
  'h/c/d/hcd',
]

const t = require('tap')
t.test('sync', t => {
  t.plan(1)
  t.same(walk.sync({
    path: resolve(__dirname, 'fixtures'),
    ignoreFiles: ['.ignore'],
  }), expect)
})

t.test('async', t => walk({
  path: resolve(__dirname, 'fixtures'),
  ignoreFiles: ['.ignore'],
}, (er, result) => t.same(result, expect)))
