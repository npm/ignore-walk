'use strict'
// ignore most things
const walk = require('../')

// set the ignores just for this test
require('./common.js').ignores({
  '.ignore': ['*', '!a/b/c/.abc', '!/c/b/a/cba']
})

// the only files we expect to see
const expected = [
  'c/b/a/cba',
  'a/b/c/.abc'
]

const rev = Class => class extends Class {
  sort (a, b) {
    return b.localeCompare(a)
  }
}

const RevWalker = rev(walk.Walker)
const RevWalkerSync = rev(walk.WalkerSync)

const t = require('tap')

t.test('sync', t => {
  t.same(new RevWalkerSync({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.ignore' ]
  }).start().result, expected)
  t.end()
})

t.test('async', t => {
  t.plan(1)
  const w = new RevWalker({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.ignore' ]
  })
  w.on('done', result => t.same(result, expected)).start()
})
