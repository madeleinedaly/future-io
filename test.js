var test = require('./lib/test');
var assert = require('assert');

exports.test1 = test(
  'success test',
  {},
  () => {
    assert(true);
  }
);

exports.test2 = test(
  'failing test',
  {},
  () => {
    assert(false);
  }
);
