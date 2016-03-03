module.exports = run;

var R = require('ramda');
var Task = require('data.task');
var parallel = require('parallel-future')(Task);


function run (tests) {
  var outcomes = tests.map(outcome);
  var mergeResults = R.zipWith(R.merge, tests);
  return parallel(outcomes).map(mergeResults);
}


function outcome (test) {
  var outcome = test.fold(
    function onRejected (failure) {
      if (failure.failingTestId === test.id) {
        return {
          result: 'FAILED',
          reason: failure.error
        };
      } else {
        return {
          result: 'INDETERMINATE',
          failingDependency: failure.failingTestId
        };
      }

    },
    function onSuccess () {
      return {
        result: 'SUCCESS'
      };
    }
  );
  return outcome;
}
