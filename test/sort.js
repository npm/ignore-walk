'use strict'
// ignore most things
const walk = require('..')
const { resolve } = require('path')

// set the ignores just for this test
require('./common.js').ignores({
  '.ignore': ['*', '!d/c/h/.dch', '!/h/c/d/hcd', '!d/c/h/.ddd'],
})

// the only files we expect to see
// Note that the sort is *reversed*
const expected = [
  'h/c/d/hcd',
  'd/c/h/.ddd',
  'd/c/h/.dch',
]

const rev = Class => class extends Class {
  sort (a, b) {
    return b.localeCompare(a, 'en')
  }
}

const RevWalker = rev(walk.Walker)
const RevWalkerSync = rev(walk.WalkerSync)

const t = require('tap')

t.test('sync', t => {
  t.same(new RevWalkerSync({
    path: resolve(__dirname, 'fixtures'),
    ignoreFiles: ['.ignore'],
  }).start().result, expected)
  t.end()
})

t.test('async', t => {
  t.plan(1)
  const w = new RevWalker({
    path: resolve(__dirname, 'fixtures'),
    ignoreFiles: ['.ignore'],
  })
  w.on('done', result => t.same(result, expected)).start()
})
