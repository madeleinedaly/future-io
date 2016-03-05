//TODO: make this ES5. Or compile it.

var Task = require('data.task');
var daggy = require('daggy');
var IO = daggy.tagged('unpack');

// # IO :: World -> Task
//
// Many IO operations in node are asynchronous.
// That's why this IO monad implementation uses a future behind the scenes.
//
// The Task is only used for asynchoronity and should always resolve succesfully.
// If you need error behavior, nest it inside the promise. For instance:
// readFile :: String -> IO Maybe String
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
