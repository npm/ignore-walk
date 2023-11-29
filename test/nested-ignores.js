'use strict'
// ignore most things
var walk = require('..')
const { resolve } = require('path')
const path = resolve(__dirname, 'fixtures')

// set the ignores just for this test
var c = require('./common.js')
c.ignores({
  '.ignore': ['*', 'd', 'h', '!d/c/h/.dch', '!/h/c/d/hcd', '!c/**/ccc'],
  'd/.ignore': ['!*', '.ignore'], // unignore everything
  'd/d/.ignore': ['*'], // re-ignore everything
  'd/c/.ignore': ['*', '!/h/.dch'], // original unignore
  'd/h/.ignore': ['*'], // ignore everything again
  'h/c/d/.ignore': ['!hcd', '!.hcd', '!/d{ch,dd}'],
  'c/.ignore': ['h/', 'c/c*'], // ignore directories recursively (GH#9)
})
// For GH#9, we need one more level of depth
c.createFile('c/c/d/d', 'ccc')
c.createFile('c/c/d/h', 'ccc')

// the only files we expect to see
var expected = [
  'c/c/d/ccc',
  'c/c/d/d/ccc',
  'c/d/c/ccc',
  'c/d/d/ccc',
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
