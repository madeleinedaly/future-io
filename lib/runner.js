module.exports = runner;

var R = require('ramda');
var Task = require('data.task');
var parallel = require('parallel-future')(Task);
var figures = require('figures');
var chalk = require('chalk');

var mergeResults = function(tasks, results) {
  var idx = 0;
  return R.map(function(result) {
    var task = tasks[idx];
    idx = idx + 1;
    return R.merge(task, { result: result });
  }, results);
};

function runner (path) {
  var tests = R.values(require(path));
  parallel(tests)
    .fork(
      function() {},
      function (results) {
        report(mergeResults(tests, results));
      }
    );
}


function report (output) {
  output.forEach(function printLine (item) {
    const resultFigure = item.result
      ? chalk.green(figures.tick)
      : chalk.red(figures.cross);
    console.log(
      '  ' + resultFigure + ' ' + item.description
    );
  });
}
