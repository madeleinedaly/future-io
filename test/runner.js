var test = require('tap').test;
var run = require('../lib/runner');
var sampleTests = require('./fixtures/tests');


test('Runner returns a future', function (t) {
  var tests = [];
  run(tests).fork(t.notOk, function (result) {
    t.same(result, []);
    t.end();
  });
});


test('Runner reports a succeeding test', function (t) {
  var tests = [sampleTests.succeeding];
  run(tests).fork(t.notOk, function (outcome) {
    t.equal(outcome.length, 1);
    t.equal(outcome[0].description, 'succeeding test');
    t.equal(outcome[0].result, 'SUCCESS');
    t.end();
  });
});


test('Runner reports a failing test', function (t) {
  var tests = [sampleTests.failing];
  run(tests).fork(t.notOk, function (outcome) {
    t.equal(outcome.length, 1);
    t.equal(outcome[0].description, 'failing test');
    t.equal(outcome[0].result, 'FAILED');
    var reason = outcome[0].reason;
    t.type(reason, 'Error');
    t.equal(reason.message, 'failed');
    t.end();
  });
});


test('Runner reports a indeterminate test', function (t) {
  var tests = [sampleTests.requiringFailing];
  run(tests).fork(t.notOk, function (outcome) {
    t.equal(outcome.length, 1);
    t.equal(outcome[0].description, 'requiring failing test');
    t.equal(outcome[0].result, 'INDETERMINATE');
    t.equal(outcome[0].failingDependency, sampleTests.failing.id);
    t.end();
  });
});
