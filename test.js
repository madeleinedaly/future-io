var test = require('./lib/test');
var assert = require('assert');

exports.test1 = test(
  'success test',
  {},
  () => {
    assert(true);
    return 42;
  }
);

exports.test2 = test(
  'failing test',
  {},
  () => {
    assert(false);
  }
);

exports.test3 = test(
  'test with dependency',
  { x: exports.test1 },
  (results) => {
    assert.equal(results.x, 42);
  }
);
