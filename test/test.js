var test = require('tap').test;
var sampleTests = require('./fixtures/tests');


test('Succeeding test returns a future that will resolve', function (t) {
  var test = sampleTests.succeeding;
  test.fork(t.notOk, t.end);
});


test('Failing test returns a future that rejects with the failure error', function (t) {
  var test = sampleTests.failing;
  test.fork(
    function (failure) {
      t.equal(failure.failingTestId, test.id);
      t.type(failure.error, 'Error');
      t.equal(failure.error.message, 'failed');
      t.end();
    },
    t.notOk
  );
});


test('Returning test returns a promise that resolves with the returned value', function (t) {
  var test = sampleTests.returning;
  test.fork(t.notOk, function (result) {
    t.equal(result, 42);
    t.end();
  });
});


test('Test can require other tests', function (t) {
  var test = sampleTests.requiring;
  test.fork(t.notOk, t.end);
});


test('Test requiring a failing test fails itself', function (t) {
  var test = sampleTests.requiringFailing;
  test.fork(
    function (failure) {
      t.equal(failure.failingTestId, sampleTests.failing.id);
      t.type(failure.error, 'Error');
      t.equal(failure.error.message, 'failed');
      t.end();
    },
    t.notOk
  );

});
