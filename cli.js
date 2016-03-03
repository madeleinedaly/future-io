#!/usr/bin/env node

var R = require('ramda');
var path = require('path');
var minimist = require('minimist');
var fork = require('fork-future');
var run = require('./lib/runner');
var report = require('./lib/reporter');

var argv = minimist(process.argv.slice(2));

var file = path.join(process.cwd(), argv._[0]);
var runFromPath = R.compose(run, loadTests);

var cli = R.compose(
  fork(onError, onCompletion),
  R.map(report),
  runFromPath
);

cli(file);

function onError (err) {
  console.log('Macho imploded');
  console.log(err);
}

function onCompletion (output) {
  console.log(output);
}

function loadTests (path) {
  var tests = R.values(require(path));
  return tests;
}
