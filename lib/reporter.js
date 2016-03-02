module.exports = report;

var chalk = require('chalk');
var figures = require('figures');


function report (results) {
  return results.reduce(function printLine (output, item) {
    var success = (item.result ==='SUCCESS') ;
    var resultFigure = success
      ? chalk.green(figures.tick)
      : chalk.red(figures.cross);
    return (output + '  ' + resultFigure + ' ' + item.description + '\n');
  }, '');
}
