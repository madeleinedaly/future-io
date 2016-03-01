module.exports = runner;

var R = require('ramda');
var Task = require('data.task');
var parallel = require('parallel-future')(Task);
var figures = require('figures');
var chalk = require('chalk');

var mergeResults = R.curryN(2, function(tasks, results) {
  var idx = 0;
  return R.map(function(result) {
    var task = tasks[idx];
    idx = idx + 1;
    return R.merge(task, { result: result });
  }, results);
});


//All IO goes in here.
function runner (path) {
  var tests = R.values(require(path));
  parallel(tests)
    .map(R.compose(
      report,
      mergeResults(tests)
    ))
    .fork(
      function() {},
      function (output) {
        console.log(output);
      }
    );
}


function report (results) {
  return results.reduce(function printLine (output, item) {
    const resultFigure = item.result
      ? chalk.green(figures.tick)
      : chalk.red(figures.cross);
    return (output + '  ' + resultFigure + ' ' + item.description + '\n');
  }, '');
}
