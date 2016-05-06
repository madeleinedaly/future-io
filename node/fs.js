const wrapFunction = require('../lib/wrap-function')
const fs = require('mz/fs')

const api = Object.keys(fs)

api.forEach((name) => {
  if (typeof fs[name] === 'function') {
    exports[name] = wrapFunction('fs.' + name, fs[name])
  }
})
