var R = require('ramda');
var IO = require('fantasy-io');
var minimist = require('minimist');
var utils = require('./utils');


var runIO = utils.dispatch('unsafePerform');

// logIO :: a -> IO a
function logIO (msg) {
  return new IO(function() {
    console.log(msg);
  });
}

// errorIO :: a -> IO a
var errorIO = R.compose(
  logIO,
  R.chain(logIO('Macho imploded'))
);

// argv :: * -> IO *
var argv = function() {
  return new IO(function() {
    return process.argv.slice(2);
  });
};

// cwdIO :: * -> IO *
var cwdIO = function() {
  return new IO(function() {
    return process.cwd();
  });
};

// minimistIO :: * -> IO *
var minimistIO = R.compose(
  R.map(minimist),
  argv
);

var _0 = R.compose(R.head, R.prop('_'));

// pathIO :: * -> IO *
var path2testIO = R.compose(
  R.map(_0),
  minimistIO
);

module.exports = {
  runIO: runIO,
  logIO: logIO,
  errorIO: errorIO,
  cwdIO: cwdIO,
  minimistIO: minimistIO,
  path2testIO: path2testIO
};
