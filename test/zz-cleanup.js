const rimraf = require('rimraf')
const path = require('path')
rimraf.sync(path.resolve(__dirname, 'fixtures'))
