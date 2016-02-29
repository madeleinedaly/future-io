module.exports = runner;

var R = require('ramda');
var figures = require('figures');
var chalk = require('chalk');

function runner (path) {
  var tests = R.values(require(path));
  var output = tests.reduce(runTest, []);
  report(output);
}

function runTest (output, test) {
  var result = doesThrow(test);
  output.push({
    description: test.description,
    result: result
  });
  return output;
}

function doesThrow (fn) {
  try {
    fn();
  } catch (err) {
    return false;
  }
  return true;
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
