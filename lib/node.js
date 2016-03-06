const IO = require('./io');
const Task = require('data.task');

// # IO returning functions.
// log :: String -> IO ()
exports.log = function (text) {
  return new IO(world => {
    world.process.stdout.write(text + '\n');
    return Task.of(null);
  });
}

//TODO: return a IO Maybe Module (for when require fails).
// require :: Path -> IO Module
exports.require = function (path) {
  return new IO(world => {
    const module = world.require(path);
    return Task.of(module);
  });
}

// cwdIO :: () -> IO Path
exports.cwd = function () {
  return new IO(
    world => Task.of(world.process.cwd())
  );
}

// argv :: () -> IO [Arg]
exports.argv = function () {
  return new IO(
    world => Task.of(world.process.argv)
  );
}

exports.realWorld = {
  process,
  require
};
