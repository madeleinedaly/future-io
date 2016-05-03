const wrapFunction = require('../lib/wrap-function')

exports.stdout = {}
exports.stdout.write = wrapFunction(
  'process.stdout.write',
  process.stdout.write.bind(process.stdout)
)

exports.stderr = {}
exports.stderr.write = wrapFunction(
  'process.stderr.write',
  process.stderr.write.bind(process.stderr)
)

exports.argv = wrapFunction(
  'process.argv',
  () => process.argv
)()

exports.exit = wrapFunction(
  'process.exit',
  process.exit
)

exports.cwd = wrapFunction(
  'process.cwd',
  process.cwd
)
