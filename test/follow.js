'use strict'
// ignore most things
const Walker = require('../')

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
    t.same(new Walker.Sync({
      ignoreFiles: [ '.ignore' ],
      follow: true,
      path: path.resolve(__dirname, 'fixtures')
    }).result, expected)
    t.end()
  })

  t.test('async', t => {
    new Walker({
      ignoreFiles: [ '.ignore' ],
      follow: true,
      path: path.resolve(__dirname, 'fixtures')
    }).on('done', result => {
      t.same(result, expected)
      t.end()
    })
  })

  t.end()
})

t.test('do not include link', t => {
  const expected = []

  t.test('sync', t => {
    t.same(new Walker.Sync({
      ignoreFiles: [ '.ignore' ],
      path: path.resolve(__dirname, 'fixtures')
    }).result, expected)
    t.end()
  })

  t.test('async', t => {
    new Walker({
      ignoreFiles: [ '.ignore' ],
      path: path.resolve(__dirname, 'fixtures')
    }).on('done', result => {
      t.same(result, expected)
      t.end()
    })
  })

  t.end()
})
