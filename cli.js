#!/usr/bin/env node

var R = require('ramda');
var path = require('path');
var minimist = require('minimist');
var fork = require('fork-future');
var run = require('./lib/runner');
var report = require('./lib/reporter');
var io = require('./lib/io');

var argv = minimist(process.argv.slice(2));

var file = path.join(process.cwd(), argv._[0]);
var runFromPath = R.compose(run, loadTests);

function loadTests (path) {
  var tests = R.values(require(path));
  return tests;
}

// UNSAFECODE
// ===============================
var cli = R.compose(
  fork(
    R.compose(io.runIO, io.errorIO),
    R.compose(io.runIO, io.logIO)
  ),
  R.map(report),
  runFromPath
);

cli(file);
