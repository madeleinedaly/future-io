const fs = require('fs')
const io = require('./io').io
const ioTask = require('./io').task
const R = require('ramda')

// # IO returning functions.
// log :: String -> IO ()
exports.log = function (text) {
  return io((world) => {
    world.process.stdout.write(text + '\n')
  })
}

// require :: Path -> IO Maybe Module
exports.require = function (path) {
  return ioTask((world, resolve, ioError) => {
    try {
      const module = world.require(path)
      return resolve(module)
    } catch (error) {
      return ioError(error)
    }
  })
}

// cwd :: () -> IO Path
exports.cwd = function () {
  return io(
    (world) => world.process.cwd()
  )
}

// exit :: (int) -> IO int
exports.exit = function (code) {
  return io(
    (world) => world.process.exit(code)
  )
}

// argv :: () -> IO [Arg]
exports.argv = function () {
  return io(
    (world) => world.process.argv
  )
}

// readFile :: Object -> Path -> IO String
exports.readFile = R.curry(function (options, path) {
  return ioTask(
    (world, resolve, ioError) => world.fs.readFile(path, options, toCallback(resolve, ioError))
  )
})

// readFile :: Object -> Path -> String|Buffer -> IO ()
exports.writeFile = R.curry(function (options, path, data) {
  return ioTask(
    (world, resolve, ioError) => world.fs.writeFile(path, data, options, toCallback(resolve, ioError))
  )
})

// stat :: Path -> IO Object
exports.stat = R.curry(function (path) {
  return ioTask(
    (world, resolve, ioError) => world.fs.stat(path, toCallback(resolve, ioError))
  )
})

function toCallback (resolve, ioError) {
  const callback = (error, result) => error ? ioError(error) : resolve(result)
  return callback
}

exports.realWorld = {
  process,
  require,
  fs
}
