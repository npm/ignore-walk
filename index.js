'use strict'

const fs = require('fs')
const path = require('path')
const EE = require('events').EventEmitter
const Minimatch = require('minimatch').Minimatch

const _addIgnoreFiles = Symbol('_addIgnoreFiles')
const _addIgnoreFile = Symbol('_addIgnoreFile')
const _entries = Symbol('_entries')
const _filterEntries = Symbol('_filterEntries')
const _filterEntry = Symbol('_filterEntry')
const _ignoreFiles = Symbol('_ignoreFiles')
const _ignoreRules = Symbol('_ignoreRules')
const _isIgnoreFile = Symbol('_isIgnoreFile')
const _onReadIgnoreFile = Symbol('_onReadIgnoreFile')
const _onReaddir = Symbol('_onReaddir')
const _parent = Symbol('_parent')
const _readdir = Symbol('_readdir')
const _sawError = Symbol('_sawError')
const _stat = Symbol('_stat')
const _walker = Symbol('_walker')
const _walkerOpt = Symbol('_walkerOpt')
const _root = Symbol('_root')
const _includeEmpty = Symbol('_includeEmpty')
const _follow = Symbol('_follow')

class Walker extends EE {
  constructor (opts) {
    opts = opts || {}
    super(opts)
    this.path = opts.path || process.cwd()
    this.basename = path.basename(this.path)
    this[_ignoreFiles] = opts.ignoreFiles || [ '.ignore' ]
    this[_ignoreRules] = {}
    this[_parent] = opts.parent || null
    this[_includeEmpty] = !!opts.includeEmpty
    this[_root] = this[_parent] ? this[_parent][_root] : this.path
    this[_follow] = !!opts.follow
    this.result = this[_parent] ? this[_parent].result : []
    this[_entries] = null
    this[_readdir]()
    this[_sawError] = false
  }

  emit (ev, data) {
    let ret = false
    if (!(this[_sawError] && ev === 'error')) {
      if (ev === 'error')
        this[_sawError] = true
      else if (ev === 'done' && !this[_parent])
        data = data.sort()
      if (ev === 'error' && this[_parent])
        ret = this[_parent].emit('error', data)
      else
        ret = super.emit(ev, data)
    }
    return ret
  }

  [_readdir] () {
    fs.readdir(this.path, (er, entries) =>
      er ? this.emit('error', er) : this[_onReaddir](entries))
  }

  [_isIgnoreFile] (e) {
    return e !== "." &&
      e !== ".." &&
      -1 !== this[_ignoreFiles].indexOf(e)
  }

  [_onReaddir] (entries) {
    this[_entries] = entries
    if (entries.length === 0) {
      if (this[_includeEmpty])
        this.result.push(this.path.substr(this[_root].length + 1))
      this.emit('done', this.result)
    } else {
      const hasIg = this[_entries].some(e =>
        this[_isIgnoreFile](e))

      if (hasIg)
        this[_addIgnoreFiles]()
      else
        this[_filterEntries]()
    }
  }

  [_addIgnoreFiles] () {
    const newIg = this[_entries]
      .filter(e => this[_isIgnoreFile](e))

    let igCount = newIg.length
    const then = _ => {
      if (--igCount === 0)
        this[_filterEntries]()
    }

    newIg.forEach(e => this[_addIgnoreFile](e, then))
  }

  [_addIgnoreFile] (file, then) {
    const ig = path.resolve(this.path, file)
    fs.readFile(ig, 'utf8', (er, data) =>
      er ? this.emit('error', er) : this[_onReadIgnoreFile](file, data, then))
  }

  [_onReadIgnoreFile] (file, data, then) {
    const mmopt = {
      matchBase: true,
      dot: true,
      flipNegate: true
    }
    const rules = data.split(/\r?\n/)
      .filter(line => !/^#|^$/.test(line.trim()))
      .map(r => new Minimatch(r, mmopt))

    if (rules.length)
      this[_ignoreRules][file] = rules

    then()
  }

  [_filterEntries] () {
    // at this point we either have ignore rules, or just inheriting
    // this exclusion is at the point where we know the list of
    // entries in the dir, but don't know what they are.  since
    // some of them *might* be directories, we have to run the
    // match in dir-mode as well, so that we'll pick up partials
    // of files that will be included later.  Anything included
    // at this point will be checked again later once we know
    // what it is.
    const filtered = this[_entries].map(entry => {
      // at this point, we don't know if it's a dir or not.
      const passFile = this[_filterEntry](entry)
      const passDir = this[_filterEntry](entry, true)
      return (passFile || passDir) ? [entry, passFile, passDir] : false
    }).filter(e => e)

    // now we stat them all
    // if it's a dir, and passes as a dir, then recurse
    // if it's not a dir, but passes as a file, add to set
    let entryCount = filtered.length
    if (entryCount === 0) {
      this.emit('done', this.result)
    } else {
      const then = _ => {
        if (-- entryCount === 0)
          this.emit('done', this.result)
      }
      filtered.forEach(filt => {
        const entry = filt[0]
        const file = filt[1]
        const dir = filt[2]
        this[_stat](entry, file, dir, then)
      })
    }
  }

  [_stat] (entry, file, dir, then) {
    const abs = this.path + '/' + entry
    const onstat = (er, st) => {
      if (er)
        this.emit('error', er)
      else if (!st.isDirectory()) {
        if (file)
          this.result.push(abs.substr(this[_root].length + 1))
        then()
      } else {
        // is a directory
        if (dir)
          this[_walker](entry, then)
        else
          then()
      }
    }

    fs[this[_follow] ? 'stat' : 'lstat'](abs, onstat)
  }

  [_walkerOpt] (entry) {
    return {
      path: this.path + '/' + entry,
      parent: this,
      ignoreFiles: this[_ignoreFiles],
      follow: this[_follow],
      includeEmpty: this[_includeEmpty]
    }
  }

  [_walker] (entry, then) {
    new Walker(this[_walkerOpt](entry)).on('done', then)
  }

  [_filterEntry] (entry, partial) {
    let included = true

    // this = /a/b/c
    // entry = d
    // parent /a/b sees c/d
    if (this[_parent] && this[_parent][_filterEntry]) {
      var pt = this.basename + "/" + entry
      included = this[_parent][_filterEntry](pt, partial)
    }

    this[_ignoreFiles].forEach(f => {
      if (this[_ignoreRules][f]) {
        this[_ignoreRules][f].forEach(rule => {
          // negation means inclusion
          // so if it's negated, and already included, no need to check
          // likewise if it's neither negated nor included
          if (rule.negate !== included) {
            // first, match against /foo/bar
            // then, against foo/bar
            // then, in the case of partials, match with a /
            const match = rule.match('/' + entry) ||
              rule.match(entry) ||
              (!!partial && (
                rule.match('/' + entry + '/') ||
                rule.match(entry + '/'))) ||
              (!!partial && rule.negate && (
                rule.match('/' + entry, true) ||
                rule.match(entry, true)))

            if (match)
              included = rule.negate
          }
        })
      }
    })

    return included
  }
}

class WalkerSync extends Walker {
  constructor (opt) {
    super(opt)
    this.result = this.result.sort()
  }

  [_readdir] () {
    this[_onReaddir](fs.readdirSync(this.path))
  }

  [_addIgnoreFile] (file, then) {
    const ig = path.resolve(this.path, file)
    this[_onReadIgnoreFile](file, fs.readFileSync(ig, 'utf8'), then)
  }

  [_stat] (entry, file, dir, then) {
    const abs = this.path + '/' + entry
    const st = fs[this[_follow] ? 'statSync' : 'lstatSync'](abs)
    if (!st.isDirectory()) {
      if (file)
        this.result.push(abs.substr(this[_root].length + 1))
    } else {
      // is a directory
      if (dir)
        this[_walker](entry)
    }
    then()
  }

  [_walker] (entry) {
    new WalkerSync(this[_walkerOpt](entry))
  }
}

const walk = (options, callback) => {
  const p = new Promise((resolve, reject) => {
    new Walker(options).on('done', resolve).on('error', reject)
  })
  return callback ? p.then(res => callback(null, res), callback) : p
}

const walkSync = options => {
  return new WalkerSync(options).result
}

module.exports = walk
walk.sync = walkSync
walk.Walker = Walker
walk.WalkerSync = WalkerSync
