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

IO.prototype.chain = function chain (g) {
  return new IO(
    (interpreter) => this.interpret(interpreter).chain(
      (x) => g(x).interpret(interpreter)
    )
  )
}

IO.prototype.ap = function ap (m) {
  return this.chain((f) => m.map(f))
}

IO.prototype.map = function map (f) {
  return this.chain((a) => IO.of(f(a)))
}

IO.prototype.catch = function _catch (f) {
  return new IO(
    (interpreter) => this.interpret(interpreter).orElse(
      (x) => f(x).interpret(interpreter)
    )
  )
}

IO.prototype.run = function run (interpreter) {
  const noop = () => {}
  const onIoError = (err) => { throw err }
  this.interpret(interpreter).fork(onIoError, noop)
}

module.exports = IO
