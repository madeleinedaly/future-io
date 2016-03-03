module.exports = report;

var chalk = require('chalk');
var figures = require('figures');

var statusToFigure = {
  'SUCCESS': chalk.green(figures.tick),
  'FAILED': chalk.red(figures.cross),
  'INDETERMINATE': chalk.gray('?')
};

function report (results) {
  return results.reduce(function printLine (output, item) {
    var resultFigure = statusToFigure[item.result];
    return (output + '  ' + resultFigure + ' ' + item.description + '\n');
  }, '');
}
