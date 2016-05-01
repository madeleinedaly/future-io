const wrapFunction = require('./lib/wrap-function')

exports.require = wrapFunction(
  'module.require',
  () => require
)

exports.require.resolve = wrapFunction(
  'module.require.resolve',
  () => require.resolve
)
