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
  var tasks = tests.reduce(testTasks, []);
  parallel(R.map(run, tasks))
    .fork(
      function() {},
      function (results) {
        report(mergeResults(tasks, results));
      }
    );
}

function run(test) {
  return test.run();
}

function testTasks (tasks, test) {
  return tasks.concat(
    test
    .map(doesThrow)
    .map(TestToTask)
  );
}

function TestToTask(fn) {
  return function() {
    return new Task(function(reject, resolve) {
      var result = fn();
      resolve(result); // TODO define result type daggy('success', 'time', ...)
    })
  };
}

function doesThrow (fn) {
  return function() {
    try {
      fn();
    } catch (err) {
      return false;
    }
    return true;
  };
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
