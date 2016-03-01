module.exports = runner;

var R = require('ramda');
var Task = require('data.task');
var parallel = require('parallel-future')(Task);
var figures = require('figures');
var chalk = require('chalk');

var mergeResults = R.curryN(2, function(tasks, results) {
  return R.zipWith(R.merge, tasks, results);
});


//All IO goes in here.
function runner (path) {
  var tests = R.values(require(path))
  var outcomes = tests.map(outcome);
  parallel(outcomes)
    .map(R.compose(
      report,
      mergeResults(tests)
    ))
    .fork(
      function (err) {
        console.log('Macho imploded');
        console.log(err);
      },
      function (output) {
        console.log(output);
      }
    );
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


function report (results) {
  return results.reduce(function printLine (output, item) {
    var success = (item.result ==='SUCCESS') ;
    var resultFigure = success
      ? chalk.green(figures.tick)
      : chalk.red(figures.cross);
    return (output + '  ' + resultFigure + ' ' + item.description + '\n');
  }, '');
}
