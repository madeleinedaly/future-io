const daggy = require('daggy')
const Task = require('data.task')

const IO = daggy.tagged('interpret')

IO.of = function of (x) {
  return new IO(
    (interpreter) => Task.of(x)
  )
}

IO.error = function error (x) {
  return new IO(
    (interpreter) => Task.rejected(x)
  )
}

IO.prototype.chain = method(function chain (io, g) {
  // TODO: throw a nice error if the value returned by g is not an IO.
  return new IO(
    (interpreter) => io.interpret(interpreter).chain(
      (x) => g(x).interpret(interpreter)
    )
  )
})

IO.prototype.ap = method(function ap (io, m) {
  return io.chain((f) => m.map(f))
})

IO.prototype.map = method(function map (io, f) {
  return io.chain((a) => IO.of(f(a)))
})

IO.prototype.catch = method(function _catch (io, f) {
  return new IO(
    (interpreter) => io.interpret(interpreter).orElse(
      (x) => f(x).interpret(interpreter)
    )
  )
})

IO.prototype.run = method(function run (io, interpreter) {
  const noop = () => {}
  // When encountering an error, throw it outside of all contexts.
  const onIoError = (err) => setImmediate(() => { throw err })
  io.interpret(interpreter).fork(onIoError, noop)
})

// Create a `method` by taking an ordinary function and pre-applying `this` as its first agument.
function method (f) {
  return function () {
    const args = [this].concat(Array.prototype.slice.call(arguments))
    return f.apply(null, args)
  }
}

module.exports = IO
