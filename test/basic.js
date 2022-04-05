'use strict'
const walk = require('..')
const { resolve } = require('path')
const path = resolve(__dirname, 'fixtures')

// set the ignores just for this test
const c = require('./common.js')
c.ignores({
  'd/.basic-ignore': ['c/', 'dhd'],
  // not actually an ignore file, but whatever
  '@foo': [],
})

// the files that we expect to not see
const notAllowed = [
  /^\/d\/c\/.*/,
  /^\/d\/.*\/dhd$/,
  /^@/,
]

const t = require('tap')

t.test('async', t => walk({
  path,
  ignoreFiles: ['.basic-ignore'],
}, (er, result) => result.forEach(r => notAllowed.forEach(na =>
  t.notMatch(r, na, r + ' !~ ' + na)))))

t.test('sync', t => {
  walk.sync({
    path,
    ignoreFiles: ['.basic-ignore'],
  }).forEach(r => notAllowed.forEach(na =>
    t.notMatch(r, na, r + ' !~ ' + na)))
  t.end()
})
