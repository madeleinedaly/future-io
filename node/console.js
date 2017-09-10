const _wrapFunction = require('../lib/wrap-function')

function create (Task, methods) {

  const wrapFunction = Task ? _wrapFunction.create(Task, methods) : _wrapFunction

  const consoleMethods = [
    'assert', 'dir', 'error', 'info', 'log',
    'time', 'timeEnd', 'trace', 'warn'
  ]

  return consoleMethods.reduce((wrappedMethods, name) => {
    wrappedMethods[name] = wrapFunction('console.' + name, console[name])
    return wrappedMethods
  }, {})

}

module.exports = create()
module.exports.create = create
