// The test fixtures work like this:
// These dirs are all created: {d,c,h}/{d,c,h}/{d,c,h}/
// in each one, these files are created:
// {.,}{d,c,h}{d,c,h}{d,c,h}
//
// So, there'll be d/c/h/dch, d/c/h/dcd, etc., and dot-versions of each.
//
// Each test then writes their own ignore file rules for their purposes,
// and is responsible for removing them afterwards.
//
// The letters "d", "c", and "h" are chosen to expose locale-specific
// sorting issues stemming from the fact that "ch" is one letter in some
// locales, and two letters in the 'sk' locale, sorting after d.  So, if
// we make the sorting locale-specific, the tests will all fail, because
// it'll go ['ccc','dhc','chd'] instead of ['ccc','chd','dhc'].

var mkdirp = require('mkdirp')
var path = require('path')
var i = 0
var fs = require('fs')
var rimraf = require('rimraf')
var fixtures = path.resolve(__dirname, 'fixtures')

var chars = ['d', 'c', 'h']
var dirs = []

for (var i = 0; i < 3; i ++) {
  for (var j = 0; j < 3; j ++) {
    for (var k = 0; k < 3; k ++) {
      dirs.push(chars[i] + '/' + chars[j] + '/' + chars[k])
    }
  }
}

var files = []

for (var i = 0; i < 3; i ++) {
  for (var j = 0; j < 3; j ++) {
    for (var k = 0; k < 3; k ++) {
      files.push(chars[i] + chars[j] + chars[k])
      files.push('.' + chars[i] + chars[j] + chars[k])
    }
  }
}

rimraf.sync(path.resolve(__dirname, 'fixtures'))

dirs.forEach(function (dir) {
  dir = path.resolve(fixtures, dir)
  mkdirp.sync(dir)
  files.forEach(function (file) {
    file = path.resolve(dir, file)
    fs.writeFileSync(file, path.basename(file))
  })
})
