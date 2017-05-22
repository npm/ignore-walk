'use strict'
// ignore most things
const walk = require('../')

// set the ignores just for this test
require('./common.js').ignores({
  '.ignore': ['*', '!/link/b/c/.abc', '!link/c/b/cba']
})

const path = require('path')
const t = require('tap')
const fs = require('fs')

const link = path.resolve(__dirname, 'fixtures/link')
try { fs.unlinkSync(link) } catch (_) {}
fs.symlinkSync('a', link)

t.teardown(_ => fs.unlinkSync(link))

t.test('follow symlink', t => {
  const expected = [
    'link/b/c/.abc',
    'link/c/b/cba'
  ]

  t.test('sync', t => {
    t.same(walk.sync({
      ignoreFiles: [ '.ignore' ],
      follow: true,
      path: path.resolve(__dirname, 'fixtures')
    }), expected)
    t.end()
  })

  t.test('async', t => walk({
    ignoreFiles: [ '.ignore' ],
    follow: true,
    path: path.resolve(__dirname, 'fixtures')
  }, (er, result) => t.same(result, expected)))

  t.end()
})

t.test('do not include link', t => {
  const expected = []

  t.test('sync', t => {
    t.same(walk.sync({
      ignoreFiles: [ '.ignore' ],
      path: path.resolve(__dirname, 'fixtures')
    }), expected)
    t.end()
  })

  t.test('async', t => walk({
    ignoreFiles: [ '.ignore' ],
    path: path.resolve(__dirname, 'fixtures')
  }).then(result => t.same(result, expected)))

  t.end()
})
