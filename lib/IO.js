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
IO.of = function (x) {
  return new IO(world => Task.of(x));
}

IO.async = function (f) {
  return new IO(
    world => new Task((_, resolve) => f(resolve))
  );
}

IO.prototype.chain = function (g) {
  return new IO(
    world => {
      var task = this.unpack(world);
      var newTask = task.chain(x => g(x).unpack(world))
      return newTask;
    }
  );
}

// Derived
IO.prototype.map = function (f) {
  return this.chain(a => IO.of(f(a)));
}

IO.prototype.ap = function (a) {
  return this.chain(f => a.map(f));
}

// # IO returning functions.
// log :: String -> IO ()
IO.log = function (text) {
  return new IO(world => {
    world.process.stdout.write(text + '\n');
    return Task.of(null);
  });
}

//TODO: return a IO Maybe Module (for when require fails).
// require :: String -> IO Module
IO.require = function (path) {
  return new IO(world => {
    var module = world.require(path);
    return Task.of(module);
  });
}

// cwdIO :: () -> IO String
IO.cwd = function () {
  return new IO(
    world => Task.of(world.process.cwd())
  );
}

// argv :: () -> IO [String]
IO.argv = function () {
  return new IO(
    world => Task.of(world.process.argv)
  );
}

// run :: IO -> world -> ()
IO.run = function run (io, world) {
  io.unpack(world).fork(
    //By definition, this produces only side effects.
    function () {},
    function () {}
  );
}

IO.realWorld = {
  process,
  require
};

module.exports = IO;
