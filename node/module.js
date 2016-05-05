const IO = require('../lib/io')
const Task = require('data.task')
const stack = require('callsite')
const resolveRelative = require('resolve')
const path = require('path')

exports.require = function (modulePath) {
  // To resolve the require path later we need to store the calling file here.
  const callingFile = stack()[1].getFileName()
  return IO(
    (interpreter) => interpreter(
      'module.require',
      () => resolveToTask(modulePath, callingFile).map(require),
      [modulePath]
    )
  )
}

exports.require.resolve = function (modulePath) {
  // To resolve the require path later we need to store the calling file here.
  const callingFile = stack()[1].getFileName()
  return IO(
    (interpreter) => interpreter(
      'module.require.resolve',
      () => resolveToTask(modulePath, callingFile),
      [modulePath]
    )
  )
}

function resolveToTask (modulePath, callingFile) {
  const basedir = path.dirname(callingFile)
  return new Task(
    (reject, resolve) => resolveRelative(
      modulePath,
      { basedir },
      (err, res) => err ? reject(err) : resolve(res)
    )
  )
}
