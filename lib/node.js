const fs = require('fs')
const io = require('./io').io
const ioTask = require('./io').task
const R = require('ramda')
const RF = require('ramda-fantasy')

const Just = RF.Maybe.Just
const Nothing = RF.Maybe.Nothing
const Left = RF.Either.Left
const Right = RF.Either.Right

// # IO returning functions.
// log :: String -> IO ()
exports.log = function (text) {
  return io((world) => {
    world.process.stdout.write(text + '\n')
  })
}

// require :: Path -> IO Maybe Module
exports.require = function (path) {
  return io((world) => {
    try {
      const module = world.require(path)
      return Just(module)
    } catch (e) {
      return Nothing()
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

// readFile :: Object -> Path -> IO (Either Error String)
exports.readFile = R.curry(function (options, path) {
  return ioTask(
    (world, resolve) => world.fs.readFile(path, options, toCallback(resolve))
  )
})

// readFile :: Object -> Path -> String|Buffer -> IO (Either Error ())
exports.writeFile = R.curry(function (options, path, data) {
  return ioTask(
    (world, resolve) => world.fs.writeFile(path, data, options, toCallback(resolve))
  )
})

function toCallback (resolve) {
  const callback = (error, result) => resolve(error ? Left(error) : Right(result))
  return callback
}

exports.realWorld = {
  process,
  require,
  fs
}
