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
    function onRejected (error) {
      return {
        result: 'FAILED',
        reason: error
      };
    },
    function onSuccess () {
      return {
        result: 'SUCCESS'
      };
    }
  );
  return outcome;
}
