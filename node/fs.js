const wrapFunction = require('../lib/wrap-function')
const fs = require('mz/fs')

const api = Object.keys(fs)

api.forEach((name) => {
  exports[name] = wrapFunction('fs.' + name, fs[name])
})
