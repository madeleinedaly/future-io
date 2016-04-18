const fs = require('fs')
const io = require('./io').io
const ioTask = require('./io').task
const R = require('ramda')
const fsMethodLengths = require('./node-functions').fs

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

// argv :: IO [Arg]
exports.argv = io(
  (world) => world.process.argv
)

// Return a IO method equivalent of a node method of a certain module.
const ioFunction = R.curry(function (moduleName, numberOfArgs, methodName) {
  return R.curryN(numberOfArgs, function ioWrapper () {
    const args = Array.prototype.slice.call(arguments)
    return ioTask(
      (world, resolve, ioError) => {
        const callback = toCallback(resolve, ioError)
        args.push(callback)
        return world[moduleName][methodName].apply(null, args)
      }
    )
  })
})

exports.fs = R.mapObjIndexed(
  ioFunction('fs'),
  fsMethodLengths
)

function toCallback (resolve, ioError) {
  const callback = (error, result) => error ? ioError(error) : resolve(result)
  return callback
}

exports.realWorld = {
  process,
  require,
  fs
}
