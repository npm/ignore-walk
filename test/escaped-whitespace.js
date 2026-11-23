'use strict'

const t = require('tap')
const walk = require('..')

t.test('escaped whitespace in ignore rules', async t => {
  const entries = ['name', 'name ', 'name\t', 'name\u00a0', ' ', 'normal']
  if (process.platform !== 'win32') {
    entries.push('name\\', 'name\\ ')
  }
  const cases = [
    ['name\\ ', ['name ']],
    ['name\\  ', ['name ']],
    ['name\\\t', ['name\t']],
    ['name\\\u00a0', ['name\u00a0']],
    ['name\\\\ ', ['name\\']],
    ['name\\\\\\ ', ['name\\ ']],
    ['\\ ', [' ']],
    ['\\\\ ', []],
    ['  name  ', ['name']],
  ]
  for (const Walker of [walk.Walker, walk.WalkerSync]) {
    for (const [rule, ignored] of cases) {
      const walker = new Walker({ ignoreFiles: ['.ignore'] })
      walker.onReadIgnoreFile('.ignore', rule + '\r\n', () => {})
      t.same(entries.filter(entry => !walker.filterEntry(entry)),
        ignored.filter(entry => entries.includes(entry)), JSON.stringify(rule))
    }
  }
})

t.test('walk preserves quoted filenames instead of ignoring different files', async t => {
  // Win32 filenames cannot end in ASCII spaces or contain a backslash.
  const space = process.platform === 'win32' ? '\u00a0' : ' '
  const files = {
    '.ignore': `name\\${space}\r\n`,
    name: 'ordinary file',
    [`name${space}`]: 'quoted filename',
    nested: {
      name: 'ordinary nested file',
      [`name${space}`]: 'quoted nested filename',
    },
  }
  const expected = ['.ignore', 'name', 'nested/name']
  if (process.platform !== 'win32') {
    files['name\\'] = 'different file'
    expected.push('name\\')
  }
  const path = t.testdir(files)
  const options = { path, ignoreFiles: ['.ignore'] }
  t.same(walk.sync(options).sort(), expected.sort(), 'sync')
  t.same((await walk(options)).sort(), expected.sort(), 'promise')
  const callback = await new Promise((resolve, reject) =>
    walk(options, (er, result) => er ? reject(er) : resolve(result)))
  t.same(callback.sort(), expected.sort(), 'callback')
})

t.test('negated rules retain quoted trailing whitespace', async t => {
  const space = process.platform === 'win32' ? '\u00a0' : ' '
  const path = t.testdir({
    '.ignore': `*\n!name\\${space}\n`,
    name: 'ordinary file',
    [`name${space}`]: 'quoted filename',
  })
  const options = { path, ignoreFiles: ['.ignore'] }
  t.same(walk.sync(options), [`name${space}`], 'sync re-includes the quoted file')
  t.same(await walk(options), [`name${space}`], 'async re-includes the quoted file')
})
