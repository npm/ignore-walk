'use strict'
// ignore most things
const walk = require('../')

// set the ignores just for this test
require('./common.js').ignores({
  '.ignore': ['*', '!/link/c/h/.dch', '!link/h/c/hcd'],
})

const path = require('path')
const t = require('tap')
const fs = require('fs')

const link = path.resolve(__dirname, 'fixtures/link')
try {
  fs.unlinkSync(link)
} catch (_) {}
fs.symlinkSync('d', link)

t.teardown(_ => fs.unlinkSync(link))

t.test('follow symlink', t => {
  const expected = [
    'link/c/h/.dch',
    'link/h/c/hcd',
  ]

  t.test('sync', t => {
    t.same(walk.sync({
      ignoreFiles: ['.ignore'],
      follow: true,
      path: path.resolve(__dirname, 'fixtures'),
    }), expected)
    t.end()
  })

  t.test('async', t => walk({
    ignoreFiles: ['.ignore'],
    follow: true,
    path: path.resolve(__dirname, 'fixtures'),
  }, (er, result) => t.same(result, expected)))

  t.end()
})

t.test('do not include link', t => {
  const expected = []

  t.test('sync', t => {
    t.same(walk.sync({
      ignoreFiles: ['.ignore'],
      path: path.resolve(__dirname, 'fixtures'),
    }), expected)
    t.end()
  })

  t.test('async', t => walk({
    ignoreFiles: ['.ignore'],
    path: path.resolve(__dirname, 'fixtures'),
  }).then(result => t.same(result, expected)))

  t.end()
})

const isWindows = process.platform === 'win32'
t.test('fail following symlink to nowhere', {
  skip: isWindows && 'no symlink support for missing dirs on windows',
}, async t => {
  const path = t.testdir({
    a: {
      b: {},
    },
    alink: t.fixture('symlink', './a/b/c'),
  })
  t.throws(() => walk.sync({ path, follow: true }), { code: 'ENOENT' })
  t.rejects(() => walk({ path, follow: true }), { code: 'ENOENT' })
})
