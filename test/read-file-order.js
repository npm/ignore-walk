const Walker = require('../')
const fs = require('fs')

// set the ignores just for this test
var c = require('./common.js')
c.ignores({ '.gitignore': ['a/b/c/abc'] })
c.ignores({ '.ignore': ['*', '!a/b/c/abc'] })

// the only file we expect to see
const expect = [
  'a/b/c/abc'
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
            if (cb) cb()
          })
        }
      }

      if (filename.indexOf('.gitignore') !== -1) {
        firstCall(_ => originalReadFile(filename, options, callback))
      } else {
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
    ignoreFiles: [ '.gitignore', '.ignore' ]
  }).on('done', result => t.same(result, expect))
})

t.test('sync', t => {
  t.plan(1)
  t.same(new Walker.Sync({
    path: __dirname + '/fixtures',
    ignoreFiles: [ '.gitignore', '.ignore' ]
  }).result, expect)
})
