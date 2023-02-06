const fs = require('fs/promises')
const path = require('path')

const main = () => {
  fs.rm(path.resolve(__dirname, 'fixtures'), { recursive: true, force: true })
}

main()
