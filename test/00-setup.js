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

const path = require('path')
const fs = require('fs/promises')
const fixtures = path.resolve(__dirname, 'fixtures')

const chars = ['d', 'c', 'h']
const dirs = []

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 3; k++) {
      dirs.push(chars[i] + '/' + chars[j] + '/' + chars[k])
    }
  }
}

const files = []

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 3; k++) {
      files.push(chars[i] + chars[j] + chars[k])
      files.push('.' + chars[i] + chars[j] + chars[k])
    }
  }
}

const main = async () => {
  fs.rm(path.resolve(__dirname, 'fixtures'), { recursive: true, force: true })

  for (let dir of dirs) {
    dir = path.resolve(fixtures, dir)
    await fs.mkdir(dir, { recursive: true })
    for (let file of files) {
      file = path.resolve(dir, file)
      await fs.writeFile(file, path.basename(file))
    }
  }
}

main()
