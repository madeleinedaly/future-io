var Task = require('data.task');
var daggy = require('daggy');

// IO :: { unpack :: World -> Task }
var IO = daggy.tagged('unpack');

IO.of = function of (x) {
  return new IO(world => Task.of(x));
}

IO.task = function task (f) {
  return new IO(
    world => new Task((_, resolve) => f(resolve))
  );
}

IO.prototype.unsafePerform = function unsafePerform (world) {
  this.unpack(world).fork(
    //By definition, this produces only side effects.
    () => {},
    () => {}
  );
}

IO.prototype.chain = function chain (g) {
  return new IO(
    world => {
      var task = this.unpack(world);
      var newTask = task.chain(x => g(x).unpack(world))
      return newTask;
    }
  );
}

// Derived
IO.prototype.map = function map (f) {
  return this.chain(a => IO.of(f(a)));
}

IO.prototype.ap = function ap (a) {
  return this.chain(f => a.map(f));
}


module.exports = IO;
