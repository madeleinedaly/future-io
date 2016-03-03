var assert = require('assert');
var Test = require('../../lib/test');

exports.succeeding = Test(
  'succeeding test',
  {},
  function () {
    assert(true);
  }
);

exports.failing = Test(
  'failing test',
  {},
  function () {
    throw new Error('failed');
  }
);

exports.returning = Test(
  'returning test',
  {},
  function () {
    return 42;
  }
);

exports.requiring = Test(
  'requiring test',
  { answer: exports.returning },
  function (result) {
    assert.equal(result.answer, 42);
  }
);

exports.requiringFailing = Test(
  'requiring failing test',
  { answers: exports.failing },
  function () {
    assert.equal(true);
  }
)
