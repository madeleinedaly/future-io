var R = require('ramda')
var RF = require('ramda-fantasy')
var daggy = require('daggy')

// IO :: { unpack :: World -> Future }
var IO = daggy.tagged('unpack')
var toFuture = R.curryN(2, R.compose)(RF.Future.of)

IO.of = function of (x) {
  return new IO(toFuture(() => x))
}

IO.io = function io (f) {
  return new IO(toFuture(f))
}

IO.task = function task (f) {
  return new IO(
    (world) => new RF.Future((ioError, resolve) => f(world, resolve, ioError))
  )
}

IO.error = function (error) {
  return new IO(
    (_) => RF.Future.reject(error)
  )
}

IO.prototype.unsafePerform = function unsafePerform (world, onIOError) {
  this.unpack(world).fork(
    // By definition, this produces only side effects.
    onIOError,
    () => {}
  )
}

IO.prototype.chain = function chain (g) {
  return new IO(
    (world) => {
      var task = this.unpack(world)
      var newTask = task.chain((x) => g(x).unpack(world))
      return newTask
    }
  )
}

// Derived
IO.prototype.map = function map (f) {
  return this.chain((a) => IO.of(f(a)))
}

IO.prototype.ap = function ap (a) {
  return this.chain((f) => a.map(f))
}

module.exports = IO
