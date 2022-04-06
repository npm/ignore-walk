'use strict'
const walk = require('..')
const { resolve } = require('path')
const path = resolve(__dirname, 'fixtures')

// set the ignores just for this test
const c = require('./common.js')
c.ignores({
  'd/.ignore-spaces': [' h'],
})

// the files that we expect to not see
const notAllowed = [
  /^d\/h\/.*/,
]

const t = require('tap')

t.test('async', t => walk({
  path,
  ignoreFiles: ['.ignore-spaces'],
}, (er, result) => {
  result.forEach(r => notAllowed.forEach(na =>
    t.notMatch(r, na, r + ' !~ ' + na)))
}))

t.test('sync', t => {
  walk.sync({
    path,
    ignoreFiles: ['.ignore-spaces'],
  }).forEach(r => notAllowed.forEach(na =>
    t.notMatch(r, na, r + ' !~ ' + na)))
  t.end()
})
