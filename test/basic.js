'use strict'
var Walker = require('../')

// set the ignores just for this test
const c = require('./common.js')
c.ignores({ 'a/.basic-ignore': ['b/', 'aca'] })

// the files that we expect to not see
const notAllowed = [ /^\/a\/b\/.*/, /^\/a\/.*\/aca$/ ]

const t = require('tap')

t.test('async', t => {
  new Walker({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.basic-ignore' ]
  }).on('done', result => {
    result.forEach(r => notAllowed.forEach(na =>
      t.dissimilar(r, na, r + ' !~ ' + na)))
    t.end()
  })
})

t.test('sync', t => {
  const result = new Walker.Sync({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.basic-ignore' ]
  }).result.forEach(r => notAllowed.forEach(na =>
    t.dissimilar(r, na, r + ' !~ ' + na)))
  t.end()
})
