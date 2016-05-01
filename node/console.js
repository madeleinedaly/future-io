const wrapFunction = require('../lib/wrap-function')

const consoleMethods = ['assert', 'dir', 'error', 'info', 'log', 'time', 'timeEnd', 'trace', 'warn']
consoleMethods.forEach(
  name => { exports[name] = wrapFunction('console.' + name, console[name]) }
)
