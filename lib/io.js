var R = require('ramda');
var IO = require('fantasy-io');
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

module.exports = {
  runIO: runIO,
  logIO: logIO,
  errorIO: errorIO
};
