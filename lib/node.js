const io = require('./io').io;
const RF = require('ramda-fantasy');

const Just = RF.Maybe.Just;
const Nothing = RF.Maybe.Nothing;

// # IO returning functions.
// log :: String -> IO ()
exports.log = function (text) {
  return io(world => {
    world.process.stdout.write(text + '\n');
  });
}

// require :: Path -> IO Maybe Module
exports.require = function (path) {
  return io(world => {
    try {
      const module = world.require(path);
      return Just(module);
    } catch (e) {
      return Nothing();
    }
  });
}

// cwdIO :: () -> IO Path
exports.cwd = function () {
  return io(
    world => world.process.cwd()
  );
}

// argv :: () -> IO [Arg]
exports.argv = function () {
  return io(
    world => world.process.argv
  );
}

exports.realWorld = {
  process,
  require
};
