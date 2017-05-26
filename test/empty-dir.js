'use strict'
const mkdirp = require('mkdirp')
const t = require('tap')
const walk = require('../')
const Walker = walk.Walker
const WalkerSync = walk.WalkerSync
const path = require('path')
const dir = path.resolve(__dirname, 'fixtures/empty')
const rimraf = require('rimraf')
mkdirp.sync(dir)
t.teardown(_ => rimraf.sync(dir))
process.chdir(path.resolve(__dirname, 'fixtures'))

require('./common.js').ignores({
  '.ignore': ['*', '!a/b/c/.abc', '!/c/b/a/cba', '!empty'],
  '.empty-ignore': []
})

t.test('do not include empty dir', t => {
  const expected = [
    'a/b/c/.abc',
    'c/b/a/cba'
  ]

  t.test('sync', t => {
    t.same(walk.sync({
      ignoreFiles: [ '.ignore', '.empty-ignore' ]
    }), expected)
    t.end()
  })

  return t.test('async', t => walk({
    ignoreFiles: [ '.ignore', '.empty-ignore' ]
  }).then(result => t.same(result, expected)))
})

t.test('include empty dir', t => {
  const expected = [
    'a/b/c/.abc',
    'c/b/a/cba',
    'empty'
  ]

  t.test('sync', t => {
    t.same(new WalkerSync({
      includeEmpty: true,
      ignoreFiles: [ '.ignore', '.empty-ignore' ]
    }).start().result, expected)
    t.end()
  })

  t.test('async', t => {
    new Walker({
      includeEmpty: true,
      ignoreFiles: [ '.ignore', '.empty-ignore' ]
    }).start().on('done', result => {
      t.same(result, expected)
      t.end()
    })
  })

  t.end()
})
