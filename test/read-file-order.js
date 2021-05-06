'use strict'
const walk = require('../')
const Walker = walk.Walker
const WalkerSync = walk.WalkerSync
const fs = require('fs')

// set the ignores just for this test
var c = require('./common.js')
c.ignores({ '.gitignore': ['d/c/h/dch'] })
c.ignores({ '.ignore': ['*', '!d/c/h/dch'] })

// the only file we expect to see
const expect = [
  'd/c/h/dch',
]

const originalReadFile = fs.readFile
let parallelCount = 0
let firstCall

// Overwrite fs.readFile so that when .gitignore and .ignore are read in
// parallel, .ignore will always be read first.
fs.readFile = (filename, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = false
  }

  parallelCount++

  process.nextTick(_ => {
    if (parallelCount > 1) {
      if (!firstCall) {
        return firstCall = cb => {
          originalReadFile(filename, options, (err, data) => {
            callback(err, data)
            if (cb)
              cb()
          })
        }
      }

      if (filename.indexOf('.gitignore') !== -1)
        firstCall(_ => originalReadFile(filename, options, callback))
      else {
        originalReadFile(filename, options, (err, data) => {
          callback(err, data)
          firstCall()
        })
      }
    } else {
      originalReadFile(filename, options, callback)
      parallelCount = 0
    }
  })
}

const t = require('tap')

t.test('async', t => {
  t.plan(1)
  new Walker({
    path: __dirname + '/fixtures',
    ignoreFiles: ['.gitignore', '.ignore'],
  }).on('done', result => t.same(result, expect)).start()
})

t.test('sync', t => {
  t.plan(1)
  t.same(new WalkerSync({
    path: __dirname + '/fixtures',
    ignoreFiles: ['.gitignore', '.ignore'],
  }).start().result, expect)
})
